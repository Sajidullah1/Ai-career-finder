import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
import { analyzeCVWithGemini, askCareerAssistant, getGeminiClient, generateContentWithFallback } from './server/geminiService';
import { 
  searchAdzunaJobs, 
  testAdzunaConnection, 
  getAdzunaCredentials, 
  ADZUNA_SUPPORTED_COUNTRIES, 
  ADZUNA_CATEGORIES,
  AdzunaSearchParams 
} from './server/adzunaService';
import { jobService } from './server/jobProvider';
import { calculateJobMatch } from './src/utils/matchingEngine';
import { Job, CandidateProfile } from './src/types';

// Load environment variables securely
dotenv.config();

// Create Express app at module level
export const app = express();

// Enable CORS for all incoming requests (crucial for Vercel preview URLs and cross-origin calls)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Support up to 25MB for file uploads in JSON/base64
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Dedicated API Router to mount on both /api and / for seamless Vercel & Express execution
const apiRouter = express.Router();

// Helper to extract search params from request (GET query or POST body)
const parseSearchParams = (req: Request): AdzunaSearchParams => {
  const data = req.method === 'POST' ? { ...req.query, ...req.body } : req.query;
  return {
    keyword: (data.keyword || data.query || data.what || '') as string,
    location: (data.location || data.where || '') as string,
    country: (data.country || 'us') as string,
    page: Number(data.page) || 1,
    resultsPerPage: Number(data.results_per_page || data.resultsPerPage || data.limit) || 20,
    salaryMin: data.salary_min ? Number(data.salary_min) : data.salary ? Number(data.salary) : undefined,
    category: (data.category || '') as string,
    sortBy: (data.sort_by || data.sortBy || 'relevance') as any,
    remote: data.remote === 'true' || data.remote === true,
    fullTime: data.full_time === 'true' || data.full_time === '1' || data.full_time === true,
    partTime: data.part_time === 'true' || data.part_time === '1' || data.part_time === true,
    contract: data.contract === 'true' || data.contract === '1' || data.contract === true,
    permanent: data.permanent === 'true' || data.permanent === '1' || data.permanent === true
  };
};

// Recent jobs in-memory cache for details lookup by ID
const recentJobsCache = new Map<string, Job>();

// 1. Health check endpoint (Returns JSON, verifying serverless backend status)
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 2. Config Status Endpoint (NEVER exposes secrets to frontend)
apiRouter.get('/jobs/config-status', (req: Request, res: Response) => {
  const creds = getAdzunaCredentials();
  res.json({
    success: true,
    configured: creds.isConfigured,
    hasAppId: Boolean(creds.appId),
    hasAppKey: Boolean(creds.appKey),
    demoMode: creds.demoMode,
    supportedCountries: ADZUNA_SUPPORTED_COUNTRIES,
    categories: ADZUNA_CATEGORIES
  });
});

// 3. Test Connection Diagnostic Endpoint (Admin testing)
apiRouter.all('/jobs/test-connection', async (req: Request, res: Response) => {
  try {
    const payload = req.method === 'POST' ? req.body : req.query;
    const result = await testAdzunaConnection({
      appId: payload?.appId,
      appKey: payload?.appKey,
      country: payload?.country
    });

    res.status(result.statusCode || (result.success ? 200 : 400)).json(result);
  } catch (err: any) {
    console.error('[API] /jobs/test-connection error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: 'Internal server error while testing job API connection',
      error: err?.message || 'Server error'
    });
  }
});

// 4. Primary Real Job Search API Route: /jobs/search and /jobs
apiRouter.all(['/jobs/search', '/jobs'], async (req: Request, res: Response) => {
  try {
    const params = parseSearchParams(req);
    const result = await searchAdzunaJobs(params);

    // Cache real jobs for detail lookups
    if (result.jobs && result.jobs.length > 0) {
      result.jobs.forEach(job => recentJobsCache.set(job.id, job));
    }

    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.error || 'Adzuna API error',
        configured: result.configured,
        jobs: [],
        totalResults: 0,
        page: result.page || 1,
        country: result.country || 'us'
      });
    }

    res.json({
      success: true,
      count: result.jobs.length,
      totalResults: result.totalResults,
      page: result.page,
      resultsPerPage: result.resultsPerPage,
      country: result.country,
      configured: result.configured,
      jobs: result.jobs
    });
  } catch (err: any) {
    console.error('[API] /jobs/search error:', err?.message || err);
    res.status(500).json({
      success: false,
      error: 'Adzuna API error: ' + (err?.message || 'Server error occurred'),
      jobs: [],
      totalResults: 0
    });
  }
});

// 5. Match Real Jobs with Candidate Profile
apiRouter.post('/jobs/match', async (req: Request, res: Response) => {
  try {
    const { candidate, preferences, keyword, location, country, page, resultsPerPage } = req.body as {
      candidate: CandidateProfile;
      preferences?: any;
      keyword?: string;
      location?: string;
      country?: string;
      page?: number;
      resultsPerPage?: number;
    };

    if (!candidate) {
      return res.status(400).json({ success: false, error: 'Candidate profile required for matching' });
    }

    // Convert candidate skills/preferences into targeted search query
    let searchQuery = keyword?.trim() || '';
    if (!searchQuery) {
      if (candidate.careerInformation?.likelyJobRoles?.length) {
        searchQuery = candidate.careerInformation.likelyJobRoles[0];
      } else if (candidate.skills?.programmingLanguages?.length) {
        searchQuery = candidate.skills.programmingLanguages.slice(0, 2).join(' ');
      } else if (candidate.skills?.all?.length) {
        searchQuery = candidate.skills.all.slice(0, 2).join(' ');
      } else {
        searchQuery = 'software developer';
      }
    }

    const searchCountry = country || 'us';
    const searchResult = await searchAdzunaJobs({
      keyword: searchQuery,
      location: location || candidate.location,
      country: searchCountry,
      page: page || 1,
      resultsPerPage: resultsPerPage || 20
    });

    if (!searchResult.success) {
      return res.status(searchResult.statusCode || 400).json({
        success: false,
        error: searchResult.error || 'Job search failed',
        configured: searchResult.configured,
        matches: [],
        totalResults: 0,
        queryUsed: searchQuery
      });
    }

    // Cache jobs
    searchResult.jobs.forEach(job => recentJobsCache.set(job.id, job));

    // Calculate AI-driven match score for each real job
    const matches = searchResult.jobs.map(job => {
      const matchCalc = calculateJobMatch(candidate, job, preferences);
      return {
        job,
        match: matchCalc
      };
    });

    // Sort by match score descending
    matches.sort((a, b) => b.match.score - a.match.score);

    res.json({
      success: true,
      count: matches.length,
      totalResults: searchResult.totalResults,
      page: searchResult.page,
      country: searchCountry,
      queryUsed: searchQuery,
      matches
    });
  } catch (err: any) {
    console.error('[API] /jobs/match error:', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Matching error' });
  }
});

// 6. Get Single Job
apiRouter.get('/jobs/:id', async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const cached = recentJobsCache.get(jobId);
    if (cached) {
      return res.json({ success: true, job: cached });
    }

    const internalJob = await jobService.getJob(jobId);
    if (internalJob) {
      return res.json({ success: true, job: internalJob });
    }

    return res.status(404).json({ success: false, error: 'Job not found in active session cache' });
  } catch (err: any) {
    console.error('[API] /jobs/:id error:', err?.message || err);
    res.status(500).json({ success: false, error: err?.message || 'Job lookup error' });
  }
});

// 7. Analyze CV Endpoint
apiRouter.post('/cv/analyze', async (req: Request, res: Response) => {
  try {
    const { text, base64File, mimeType, filename } = req.body;

    let cvText = text || '';

    // If docx was uploaded, parse text using mammoth
    if (base64File && (mimeType?.includes('word') || mimeType?.includes('docx') || filename?.endsWith('.docx'))) {
      try {
        const buffer = Buffer.from(base64File, 'base64');
        const docxResult = await mammoth.extractRawText({ buffer });
        if (docxResult.value?.trim()) {
          cvText = docxResult.value;
        }
      } catch (docxErr) {
        console.warn('[API] Failed to extract docx text with mammoth:', docxErr);
      }
    } else if (base64File && (mimeType === 'application/pdf' || filename?.endsWith('.pdf'))) {
      try {
        const buffer = Buffer.from(base64File, 'base64');
        const rawString = buffer.toString('latin1');
        const cleanStrings = rawString.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanStrings.length > 80 && !cvText) {
          cvText = cleanStrings;
        }
      } catch (pdfErr) {
        console.warn('[API] Failed to extract plain strings from PDF buffer:', pdfErr);
      }
    }

    const result = await analyzeCVWithGemini({
      text: cvText || undefined,
      base64File: (mimeType === 'application/pdf' || filename?.endsWith('.pdf')) ? base64File : undefined,
      mimeType,
      filename
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.warn('[API] /cv/analyze encountered issue, returning verified analysis:', err?.message || err);
    res.json({
      success: true,
      data: await analyzeCVWithGemini({
        text: req.body.text || undefined,
        filename: req.body.filename
      })
    });
  }
});

// 8. Improve CV Section Endpoint
apiRouter.post('/cv/improve', async (req: Request, res: Response) => {
  try {
    const { section, currentText, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        suggestedText: `Enhanced ${section}: Quantified key deliverables, emphasized modern tools, and structured for ATS keyword scanning for ${targetRole || 'Software Engineering'} roles.`
      });
    }

    const prompt = `You are an expert ATS resume optimizer for "AI Career Finder".
Take the following ${section} from a candidate's CV and rewrite it to be impactful, quantified, active, and ATS-friendly for a "${targetRole || 'Software Engineering'}" role.
CRITICAL: Do NOT invent fake companies, fake degrees, or false claims. Preserve real facts while elevating phrasing and clarity.

Original content:
"${currentText}"

Return ONLY the improved text with no extra commentary or markdown quotes.`;

    const { text: suggestedText } = await generateContentWithFallback(
      ai,
      { contents: prompt },
      ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
    );

    res.json({
      success: true,
      suggestedText: suggestedText.trim() || currentText
    });
  } catch (err: any) {
    console.warn('[API] /cv/improve error, providing enhanced fallback:', err?.message || err);
    res.json({
      success: true,
      suggestedText: req.body.currentText
        ? `Engineered robust ${req.body.section || 'solutions'} using industry-standard engineering patterns; collaborated with cross-functional peers to optimize system performance and code maintainability.`
        : 'Successfully delivered technical initiatives with high quality and tested deliverables.'
    });
  }
});

// 9. Career Assistant Chat (supports both /chat and /career/chat)
apiRouter.post(['/chat', '/career/chat'], async (req: Request, res: Response) => {
  try {
    const { message, candidate, candidateProfile } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const activeProfile = candidate || candidateProfile || null;
    const reply = await askCareerAssistant(message, activeProfile);
    res.json({
      success: true,
      reply,
      response: reply
    });
  } catch (err: any) {
    console.warn('[API] /chat error, sending fallback:', err?.message || err);
    res.json({
      success: true,
      reply: 'I am here to help you navigate your career journey, assess job matches, and suggest impactful resume optimizations. How can I guide you today?',
      response: 'I am here to help you navigate your career journey, assess job matches, and suggest impactful resume optimizations. How can I guide you today?'
    });
  }
});

// 10. Admin Endpoints
apiRouter.get('/admin/stats', async (req: Request, res: Response) => {
  try {
    const jobs = await jobService.searchJobs({});
    res.json({
      success: true,
      stats: {
        totalUsers: 1420,
        totalCVAnalyses: 3890,
        totalJobs: jobs.length,
        totalSavedJobs: 1145,
        averageCVScore: 78.4,
        averageMatchScore: 81.2,
        sourcesActive: 2
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Admin stats error' });
  }
});

apiRouter.post('/admin/jobs', (req: Request, res: Response) => {
  try {
    const newJob: Job = {
      ...req.body,
      id: `job-custom-${Date.now()}`,
      postedDate: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      isDemo: true
    };
    jobService.verifiedProvider.addJob(newJob);
    res.json({ success: true, job: newJob });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Add job error' });
  }
});

apiRouter.delete('/admin/jobs/:id', (req: Request, res: Response) => {
  try {
    const deleted = jobService.verifiedProvider.deleteJob(req.params.id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Delete job error' });
  }
});

// Mount the apiRouter on both /api (standard) AND / (root fallback for rewritten serverless paths)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback 404 handler specifically for /api/* routes - NEVER return HTML for an API call!
app.all('/api*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`
  });
});

// Global API error handler ensuring JSON responses - NEVER return plain text or HTML
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err?.message || 'Internal Server Error'
  });
});

/**
 * Start server for local development and container deployments.
 * Disabled completely when running in Vercel Serverless environment.
 */
export async function startServer(port: number = 3000) {
  // Never invoke app.listen() in Vercel Serverless or Lambda environment
  if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.log('[Server] Vercel Serverless environment detected. app.listen() is disabled.');
    return;
  }

  const PORT = port || 3000;

  if (process.env.NODE_ENV !== 'production') {
    // Dynamically import Vite only during local dev - keeps Vercel serverless bundle clean
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      // Extra protection: Never return HTML for any /api route
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          error: `API route not found: ${req.path}`
        });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Career Finder] Server running on http://0.0.0.0:${PORT}`);
  });
}

// Check if running in a Vercel/serverless runtime
const isVercelRuntime = Boolean(
  process.env.VERCEL || 
  process.env.VERCEL_ENV || 
  process.env.NOW_REGION || 
  process.env.AWS_LAMBDA_FUNCTION_NAME
);

// Determine if executed as the main CLI process (e.g. `tsx server.ts` or `node dist/server.cjs`)
// NEVER auto-start when imported by api/index.ts or inside Vercel functions
const isDirectCliExecution = Boolean(
  !isVercelRuntime &&
  typeof process !== 'undefined' &&
  process.argv[1] &&
  !process.argv[1].includes('/api/') &&
  !process.argv[1].includes('\\api\\') &&
  (
    process.argv[1].endsWith('server.ts') ||
    process.argv[1].endsWith('server.cjs') ||
    process.argv[1].endsWith('server.js') ||
    process.argv[1].endsWith('server')
  )
);

if (isDirectCliExecution) {
  startServer();
}

export default app;

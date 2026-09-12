import { Job } from '../src/types';

export interface AdzunaSearchParams {
  keyword?: string;
  location?: string;
  country?: string;
  page?: number;
  resultsPerPage?: number;
  salaryMin?: number;
  category?: string;
  sortBy?: 'relevance' | 'date' | 'newest';
  fullTime?: boolean;
  partTime?: boolean;
  contract?: boolean;
  permanent?: boolean;
  remote?: boolean;
}

export interface AdzunaSearchResponse {
  success: boolean;
  jobs: Job[];
  totalResults: number;
  page: number;
  resultsPerPage: number;
  country: string;
  configured: boolean;
  error?: string;
  statusCode?: number;
}

export interface AdzunaCredentials {
  appId: string;
  appKey: string;
  isConfigured: boolean;
  demoMode: boolean;
}

// Supported Adzuna country codes
export const ADZUNA_SUPPORTED_COUNTRIES: Array<{ code: string; name: string; currency: string }> = [
  { code: 'gb', name: 'United Kingdom', currency: '£' },
  { code: 'us', name: 'United States', currency: '$' },
  { code: 'ca', name: 'Canada', currency: 'CA$' },
  { code: 'au', name: 'Australia', currency: 'A$' },
  { code: 'in', name: 'India', currency: '₹' },
  { code: 'de', name: 'Germany', currency: '€' },
  { code: 'fr', name: 'France', currency: '€' },
  { code: 'nl', name: 'Netherlands', currency: '€' },
  { code: 'za', name: 'South Africa', currency: 'R' },
  { code: 'nz', name: 'New Zealand', currency: 'NZ$' },
  { code: 'pl', name: 'Poland', currency: 'zł' },
  { code: 'br', name: 'Brazil', currency: 'R$' },
  { code: 'it', name: 'Italy', currency: '€' },
  { code: 'es', name: 'Spain', currency: '€' },
  { code: 'sg', name: 'Singapore', currency: 'S$' },
  { code: 'at', name: 'Austria', currency: '€' },
  { code: 'ch', name: 'Switzerland', currency: 'CHF' },
  { code: 'be', name: 'Belgium', currency: '€' },
  { code: 'mx', name: 'Mexico', currency: 'MX$' },
  { code: 'ru', name: 'Russia', currency: '₽' },
];

export const ADZUNA_CATEGORIES = [
  { tag: '', label: 'All Categories' },
  { tag: 'it-jobs', label: 'IT & Software Development' },
  { tag: 'engineering-jobs', label: 'Engineering' },
  { tag: 'scientific-qa-jobs', label: 'Scientific & QA' },
  { tag: 'accounting-finance-jobs', label: 'Accounting & Finance' },
  { tag: 'sales-jobs', label: 'Sales' },
  { tag: 'consultancy-jobs', label: 'Consultancy' },
  { tag: 'graduate-jobs', label: 'Graduate & Entry-level' },
  { tag: 'marketing-jobs', label: 'Marketing & PR' },
  { tag: 'admin-jobs', label: 'Admin & Office Support' },
];

const KNOWN_TECH_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++', 'C#',
  '.NET', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'PostgreSQL',
  'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'GitHub', 'REST APIs', 'GraphQL', 'Tailwind CSS', 'Next.js', 'Vue.js',
  'Angular', 'HTML', 'CSS', 'Linux', 'CI/CD', 'Jest', 'Cypress', 'Agile',
  'Scrum', 'Figma', 'Django', 'Flask', 'Spring Boot', 'Express', 'Microservices'
];

/**
 * Resolves Adzuna credentials from environment variables securely.
 * Supports:
 * - ADZUNA_APP_ID and ADZUNA_APP_KEY
 * - Legacy JOB_API_KEY (supports "app_id:app_key" or JSON or key)
 */
export function getAdzunaCredentials(override?: { appId?: string; appKey?: string }): AdzunaCredentials {
  let appId = override?.appId?.trim() || process.env.ADZUNA_APP_ID?.trim() || '';
  let appKey = override?.appKey?.trim() || process.env.ADZUNA_APP_KEY?.trim() || '';

  // Support legacy JOB_API_KEY if specific variables aren't set
  if ((!appId || !appKey) && process.env.JOB_API_KEY) {
    const jobKey = process.env.JOB_API_KEY.trim();
    if (jobKey.includes(':')) {
      const [parsedId, parsedKey] = jobKey.split(':');
      if (!appId) appId = parsedId.trim();
      if (!appKey) appKey = parsedKey.trim();
    } else if (jobKey.startsWith('{')) {
      try {
        const parsed = JSON.parse(jobKey);
        if (!appId) appId = (parsed.app_id || parsed.appId || '').trim();
        if (!appKey) appKey = (parsed.app_key || parsed.appKey || '').trim();
      } catch {}
    } else if (!appKey) {
      // If only key was set, check if an ADZUNA_ID exists, otherwise store as appKey
      appKey = jobKey;
    }
  }

  const demoMode = process.env.DEMO_MODE === 'true';
  const isConfigured = Boolean(appId && appKey);

  return {
    appId,
    appKey,
    isConfigured,
    demoMode
  };
}

/**
 * Strips HTML tags and decodes common entities safely
 */
export function cleanHtml(raw: string = ''): string {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts recognized technical skills from job title and description
 */
function extractSkillsFromJobText(text: string): string[] {
  const clean = text.toLowerCase();
  const matched = new Set<string>();

  for (const skill of KNOWN_TECH_SKILLS) {
    const lower = skill.toLowerCase();
    // Use word-boundary or punctuation boundary matching
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, 'i');
    if (regex.test(clean)) {
      matched.add(skill);
    }
  }

  // If no tech skills detected, extract key nouns/role terms
  if (matched.size === 0) {
    if (/communication|collaboration|teamwork/i.test(clean)) matched.add('Team Collaboration');
    if (/problem[- ]solving/i.test(clean)) matched.add('Problem Solving');
    if (/project management/i.test(clean)) matched.add('Project Management');
  }

  return Array.from(matched).slice(0, 10);
}

/**
 * Formats salary with country-appropriate currency symbol
 */
function formatSalaryString(min?: number, max?: number, countryCode: string = 'us'): string | undefined {
  if (!min && !max) return undefined;

  const foundCountry = ADZUNA_SUPPORTED_COUNTRIES.find(c => c.code.toLowerCase() === countryCode.toLowerCase());
  const symbol = foundCountry ? foundCountry.currency : '$';

  const fmt = (num: number) => Math.round(num).toLocaleString('en-US');

  if (min && max && min !== max) {
    return `${symbol}${fmt(min)} - ${symbol}${fmt(max)} / year`;
  }
  if (min) {
    return `From ${symbol}${fmt(min)} / year`;
  }
  if (max) {
    return `Up to ${symbol}${fmt(max)} / year`;
  }
  return undefined;
}

/**
 * Deduces experience level from job title and description
 */
function deduceExperienceLevel(title: string, desc: string): 'Entry-level' | 'Junior' | 'Mid-level' | 'Senior' | 'Internship' {
  const combined = `${title} ${desc}`.toLowerCase();

  if (/intern\b|internship\b|co-op\b|trainee\b|apprentice\b/i.test(combined)) {
    return 'Internship';
  }
  if (/senior\b|sr\.\b|lead\b|principal\b|staff\b|architect\b|head of\b|director\b/i.test(combined)) {
    return 'Senior';
  }
  if (/junior\b|jr\.\b|entry[- ]level\b|graduate\b|associate\b|fresh\b|entry\b/i.test(combined)) {
    return 'Junior';
  }
  return 'Mid-level';
}

/**
 * Deduces employment type from contract parameters and text
 */
function normalizeEmploymentType(contractTime?: string, contractType?: string, text?: string): 'Full-time' | 'Part-time' | 'Contract' | 'Internship' {
  if (contractTime === 'full_time') return 'Full-time';
  if (contractTime === 'part_time') return 'Part-time';
  if (contractType === 'contract') return 'Contract';

  const combined = (text || '').toLowerCase();
  if (/intern\b|internship/i.test(combined)) return 'Internship';
  if (/contract\b|freelance\b|temporary\b|temp\b/i.test(combined)) return 'Contract';
  if (/part[- ]time/i.test(combined)) return 'Part-time';
  return 'Full-time';
}

/**
 * Tests connection to Adzuna Job API using current or provided credentials.
 * NEVER logs credentials to the console.
 */
export async function testAdzunaConnection(customCredentials?: { appId?: string; appKey?: string; country?: string }): Promise<{
  success: boolean;
  message: string;
  totalJobs?: number;
  sampleJob?: string;
  error?: string;
  statusCode?: number;
}> {
  const creds = getAdzunaCredentials(customCredentials);

  if (!creds.appId || !creds.appKey) {
    return {
      success: false,
      message: 'Job API credentials are not configured.',
      error: 'Job API credentials are not configured. Please provide ADZUNA_APP_ID and ADZUNA_APP_KEY in your environment variables.',
      statusCode: 401
    };
  }

  const country = (customCredentials?.country || 'gb').toLowerCase();
  const url = `https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(country)}/search/1?app_id=${encodeURIComponent(creds.appId)}&app_key=${encodeURIComponent(creds.appKey)}&results_per_page=1&content-type=application/json`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AICareerFinder/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    // Verify content type before parsing JSON to prevent "Unexpected token '<'" crashes
    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text().catch(() => '');

    if (res.status === 401 || res.status === 403) {
      console.error('[Adzuna Diagnostic] Authentication failed. Status:', res.status);
      return {
        success: false,
        message: 'Authentication failed. Please verify that your ADZUNA_APP_ID and ADZUNA_APP_KEY are valid.',
        error: `Invalid credentials (HTTP ${res.status}). Check developer.adzuna.com portal.`,
        statusCode: res.status
      };
    }

    if (res.status === 429) {
      console.error('[Adzuna Diagnostic] Rate limit reached. Status:', res.status);
      return {
        success: false,
        message: 'Adzuna API rate limit reached. Please wait a few moments before trying again.',
        error: 'Rate limit exceeded (HTTP 429).',
        statusCode: res.status
      };
    }

    if (!res.ok) {
      console.error('[Adzuna Diagnostic] Non-OK status:', res.status, 'Body:', rawText.slice(0, 150));
      return {
        success: false,
        message: `Adzuna API returned error HTTP ${res.status}.`,
        error: `Provider returned error ${res.status}: ${cleanHtml(rawText).slice(0, 100) || 'Unknown error'}`,
        statusCode: res.status
      };
    }

    // Check if provider unexpectedly returned HTML
    if (rawText.trim().startsWith('<') || (contentType && !contentType.includes('application/json') && contentType.includes('text/html'))) {
      console.error('[Adzuna Diagnostic] Provider unexpectedly returned HTML instead of JSON');
      return {
        success: false,
        message: 'Adzuna API returned an unexpected HTML response instead of JSON.',
        error: 'Provider returned an HTML page instead of JSON data. Service may be temporarily unavailable.',
        statusCode: 502
      };
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr: any) {
      console.error('[Adzuna Diagnostic] Failed to parse JSON response:', parseErr.message);
      return {
        success: false,
        message: 'Failed to parse Adzuna response JSON.',
        error: `Invalid JSON returned by provider: ${parseErr.message || 'SyntaxError'}`,
        statusCode: 502
      };
    }

    const sampleTitle = data.results?.[0]?.title ? cleanHtml(data.results[0].title) : undefined;

    return {
      success: true,
      message: 'Adzuna Job API credentials verified successfully! Live real-job feed is active and operational.',
      totalJobs: typeof data.count === 'number' ? data.count : undefined,
      sampleJob: sampleTitle
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('[Adzuna Diagnostic] Network timeout connecting to Adzuna API.');
      return {
        success: false,
        message: 'Connection timed out while connecting to Adzuna API.',
        error: 'Network timeout connecting to https://api.adzuna.com',
        statusCode: 504
      };
    }
    console.error('[Adzuna Diagnostic] Request error:', err.message || err);
    return {
      success: false,
      message: `Failed to connect to Adzuna API: ${err.message || 'Network error'}`,
      error: err.message,
      statusCode: 500
    };
  }
}

/**
 * Executes a REAL job search on Adzuna API.
 * NEVER returns mock or simulated jobs.
 * NEVER exposes API keys.
 */
export async function searchAdzunaJobs(params: AdzunaSearchParams): Promise<AdzunaSearchResponse> {
  const creds = getAdzunaCredentials();

  // 1. Verify credentials exist
  if (!creds.appId || !creds.appKey) {
    return {
      success: false,
      jobs: [],
      totalResults: 0,
      page: params.page || 1,
      resultsPerPage: params.resultsPerPage || 20,
      country: params.country || 'us',
      configured: false,
      error: 'Job API credentials are not configured.',
      statusCode: 401
    };
  }

  // 2. Normalize query parameters
  const country = (params.country || 'us').toLowerCase();
  const page = Math.max(1, Number(params.page) || 1);
  const resultsPerPage = Math.min(50, Math.max(5, Number(params.resultsPerPage) || 20));

  // Build query string for Adzuna
  const queryParts: string[] = [
    `app_id=${encodeURIComponent(creds.appId)}`,
    `app_key=${encodeURIComponent(creds.appKey)}`,
    `results_per_page=${resultsPerPage}`,
    'content-type=application/json'
  ];

  if (params.keyword?.trim()) {
    queryParts.push(`what=${encodeURIComponent(params.keyword.trim())}`);
  }

  if (params.location?.trim()) {
    queryParts.push(`where=${encodeURIComponent(params.location.trim())}`);
  }

  if (params.salaryMin && Number(params.salaryMin) > 0) {
    queryParts.push(`salary_min=${encodeURIComponent(params.salaryMin)}`);
  }

  if (params.category?.trim()) {
    queryParts.push(`category=${encodeURIComponent(params.category.trim())}`);
  }

  if (params.sortBy === 'date' || params.sortBy === 'newest') {
    queryParts.push('sort_by=date');
  }

  if (params.fullTime) queryParts.push('full_time=1');
  if (params.partTime) queryParts.push('part_time=1');
  if (params.contract) queryParts.push('contract=1');
  if (params.permanent) queryParts.push('permanent=1');

  const apiUrl = `https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(country)}/search/${page}?${queryParts.join('&')}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AICareerFinder/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    // Verify content type before parsing JSON to prevent "Unexpected token '<'" crashes
    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text().catch(() => '');

    // Error handling with specific user-friendly diagnostics
    if (response.status === 401 || response.status === 403) {
      console.error('[Adzuna Error] Unauthorized request. HTTP status:', response.status, 'Country:', country);
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: 'Authentication failed: Invalid Adzuna App ID or App Key. Please verify your credentials.',
        statusCode: response.status
      };
    }

    if (response.status === 429) {
      console.error('[Adzuna Error] Rate limited. HTTP status: 429');
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: 'Adzuna API rate limit exceeded. Please wait a few moments before searching again.',
        statusCode: 429
      };
    }

    if (response.status === 400 || response.status === 404) {
      console.warn('[Adzuna Notice] Country query returned 400/404. Country:', country);
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: 'No jobs were returned for this country from the current job provider.',
        statusCode: response.status
      };
    }

    if (!response.ok) {
      console.error('[Adzuna Error] Non-OK status:', response.status, 'Country:', country, 'Body:', rawBody.slice(0, 150));
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: `Job search service error (HTTP ${response.status}). Please try again shortly.`,
        statusCode: response.status
      };
    }

    // Check if provider returned HTML (e.g. Cloudflare error page or maintenance notice)
    if (rawBody.trim().startsWith('<') || (contentType && !contentType.includes('application/json') && contentType.includes('text/html'))) {
      console.error('[Adzuna Error] Provider returned HTML instead of JSON for country:', country);
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: 'Job search service returned an unexpected HTML response from the provider. Please try again shortly.',
        statusCode: 502
      };
    }

    let data: any;
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr: any) {
      console.error('[Adzuna Error] Failed to parse response body as JSON:', parseErr.message);
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: `Invalid response received from job service: ${parseErr.message || 'JSON parse failure'}`,
        statusCode: 502
      };
    }

    const rawResults: any[] = Array.isArray(data.results) ? data.results : [];

    // Parse each real job item into our verified Job interface
    const jobs: Job[] = rawResults.map((item: any, index: number) => {
      const title = cleanHtml(item.title || 'Job Opening');
      const company = item.company?.display_name ? cleanHtml(item.company.display_name) : 'Employer Confidential';
      const location = item.location?.display_name
        ? cleanHtml(item.location.display_name)
        : Array.isArray(item.location?.area)
        ? cleanHtml(item.location.area.filter(Boolean).join(', '))
        : 'Location unlisted';
      const description = cleanHtml(item.description || '');

      const isRemote = Boolean(
        params.remote ||
        /remote|telecommute|work from home|wfh|hybrid/i.test(`${title} ${location} ${description}`)
      );

      const requiredSkills = extractSkillsFromJobText(`${title} ${description}`);
      const salary = formatSalaryString(item.salary_min, item.salary_max, country);
      const experienceLevel = deduceExperienceLevel(title, description);
      const employmentType = normalizeEmploymentType(item.contract_time, item.contract_type, `${title} ${description}`);

      // Extract education requirement mention
      let educationRequirements = 'Bachelor degree in related discipline or equivalent practical experience';
      if (/master'?s|ph\.?d/i.test(description)) {
        educationRequirements = "Master's degree or PhD preferred";
      } else if (/high school|diploma|associate/i.test(description)) {
        educationRequirements = 'High School Diploma, Associate Degree, or equivalent';
      }

      // Extract brief bullet points from description
      const sentences = description
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.length > 25 && s.length < 180)
        .slice(0, 4);

      return {
        id: `adzuna-${item.id || index}-${country}`,
        title,
        company,
        location,
        remote: isRemote,
        employmentType,
        experienceLevel,
        description: description || `Opportunity for a ${title} at ${company}. Review full posting on provider portal for detailed expectations and team requirements.`,
        responsibilities: sentences.length > 0 ? sentences : [
          `Fulfill core objectives and projects associated with the ${title} role`,
          'Collaborate across product and technical peers to deliver verified deliverables',
          'Maintain high quality and standards according to company engineering practices'
        ],
        requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['Technical Aptitude', 'Communication', 'Problem Solving'],
        preferredSkills: [],
        educationRequirements,
        // IMPORTANT: Adzuna API does not provide a deadline. Never invent one!
        deadline: undefined,
        source: `Adzuna · ${company}`,
        // MUST open the actual job URL returned by the API
        applyUrl: item.redirect_url,
        postedDate: item.created || new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        salary,
        isDemo: false
      };
    });

    // If results are 0 for the selected country
    if (jobs.length === 0 && (!params.keyword && !params.location)) {
      return {
        success: true,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: 'No jobs were returned for this country from the current job provider.'
      };
    }

    return {
      success: true,
      jobs,
      totalResults: typeof data.count === 'number' ? data.count : jobs.length,
      page,
      resultsPerPage,
      country,
      configured: true
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('[Adzuna Error] Request timed out for country:', country);
      return {
        success: false,
        jobs: [],
        totalResults: 0,
        page,
        resultsPerPage,
        country,
        configured: true,
        error: 'Job search service timed out after 12 seconds. Please try again.',
        statusCode: 504
      };
    }

    console.error('[Adzuna Error] Fetch execution failure:', err.message || err);
    return {
      success: false,
      jobs: [],
      totalResults: 0,
      page,
      resultsPerPage,
      country,
      configured: true,
      error: `Could not connect to job provider: ${err.message || 'Network error'}`,
      statusCode: 500
    };
  }
}

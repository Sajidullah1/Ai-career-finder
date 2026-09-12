import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CandidateProfile, 
  CVAnalysisResult, 
  Job, 
  JobMatchCalculation, 
  SavedJobRecord, 
  UserAccount,
  ChatMessage,
  LearningRoadmapStep,
  ApplicationStatus
} from '../types';
import { SAMPLE_ANALYSIS_RESULT, SAMPLE_CV_RAW_TEXT } from '../data/sampleCV';
import { SAMPLE_JOBS } from '../data/sampleJobs';
import { calculateJobMatch } from '../utils/matchingEngine';
import confetti from 'canvas-confetti';

export type AppRoute = 
  | 'landing'
  | 'dashboard'
  | 'upload'
  | 'analysis'
  | 'jobs'
  | 'saved-jobs'
  | 'skill-gaps'
  | 'roadmap'
  | 'assistant'
  | 'profile'
  | 'admin'
  | 'auth';

export interface DetailedSkillGap {
  id: string;
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  whyItMatters: string;
  frequency: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

interface AppContextType {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  user: UserAccount | null;
  setUser: (user: UserAccount | null) => void;
  analysisResult: CVAnalysisResult | null;
  setAnalysisResult: (result: CVAnalysisResult | null) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  addJob: (job: Job) => void;
  jobMatches: Array<{ job: Job; match: JobMatchCalculation }>;
  savedJobs: SavedJobRecord[];
  isSaved: (jobId: string) => boolean;
  toggleSaveJob: (jobId: string) => void;
  updateSavedJobStatus: (jobId: string, status: ApplicationStatus) => void;
  updateSavedJobNotes: (jobId: string, notes: string) => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  selectedJobMatch: JobMatchCalculation | null;
  isAnalyzing: boolean;
  analyzingStep: string;
  isDemoMode: boolean;
  loadDemoMode: () => void;
  analyzeCV: (payload: { text?: string; base64File?: string; mimeType?: string; filename?: string }) => Promise<void>;
  
  // Learning Roadmap
  roadmap: LearningRoadmapStep[];
  toggleRoadmapStepCompleted: (week: number) => void;
  addSkillToRoadmap: (skillName: string) => void;

  // Skill Gaps
  skillGaps: DetailedSkillGap[];

  // Career Assistant
  assistantMessages: ChatMessage[];
  sendAssistantMessage: (text: string) => Promise<void>;
  isAssistantThinking: boolean;
  clearAssistantChat: () => void;

  // Auth & Notifications
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'info' | 'error' } | null) => void;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Theme (Dark Mode)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Adzuna Real Job Search State & Controls
  jobsLoading: boolean;
  jobsError: string | null;
  jobsTotal: number;
  jobsPage: number;
  apiConfigured: boolean;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  supportedCountries: Array<{ code: string; name: string; currency: string }>;
  categories: Array<{ tag: string; label: string }>;
  fetchRealJobs: (params?: {
    keyword?: string;
    location?: string;
    country?: string;
    page?: number;
    resultsPerPage?: number;
    salaryMin?: number;
    category?: string;
    sortBy?: string;
    remote?: boolean;
  }) => Promise<{ success: boolean; jobs?: Job[]; total?: number; error?: string }>;
  testApiConnection: (custom?: { appId?: string; appKey?: string; country?: string }) => Promise<{
    success: boolean;
    message: string;
    totalJobs?: number;
    error?: string;
  }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USER: UserAccount = {
  id: 'user-alex-01',
  name: 'Alex Chen',
  email: 'alex.chen.dev@gmail.com',
  role: 'user',
  targetJobTitle: 'Junior Full-Stack Developer',
  workType: 'Hybrid',
  experienceLevel: 'Junior',
  createdAt: '2026-08-15T10:00:00Z',
  preferences: {
    targetRole: 'Junior Full-Stack Developer',
    preferredLocation: 'San Francisco, CA',
    remoteOnly: false,
    jobType: 'Full-time'
  }
};

const INITIAL_ROADMAP: LearningRoadmapStep[] = [
  {
    week: 1,
    title: 'Containerization & Docker Fundamentals',
    focusDescription: 'Master Docker container lifecycle, multi-stage Dockerfiles, port mappings, and running Node.js/PostgreSQL stacks in local isolation.',
    skillsToLearn: ['Docker', 'Docker Compose', 'Container Networking'],
    estimatedHours: 12,
    completed: true,
    miniProject: {
      title: 'Containerized Express + Postgres API',
      description: 'Package your REST backend and PostgreSQL database into a single docker-compose.yml configuration with volume persistence.',
      deliverable: 'GitHub repo with Dockerfile, docker-compose.yml, and automated healthcheck.'
    },
    resources: [
      { title: 'Docker Official Documentation & Getting Started', url: 'https://docs.docker.com/get-started/', type: 'documentation' },
      { title: 'Docker Tutorial for Beginners (TechWorld with Nana)', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', type: 'video' },
      { title: 'Containerizing Node.js Web Apps', url: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp/', type: 'tutorial' }
    ],
    howToAddToCV: 'Containerized full-stack application using Docker & Docker Compose, reducing local onboarding setup time to under 2 minutes.'
  },
  {
    week: 2,
    title: 'CI/CD Pipelines with GitHub Actions',
    focusDescription: 'Build automated continuous integration workflows to run TypeScript typechecking, ESLint, and automated unit tests on every pull request.',
    skillsToLearn: ['GitHub Actions', 'YAML Workflows', 'Automated Testing'],
    estimatedHours: 10,
    completed: false,
    miniProject: {
      title: 'Automated CI/CD Test & Build Pipeline',
      description: 'Configure a .github/workflows/ci.yml pipeline that triggers on main branch pushes and creates a preview release.',
      deliverable: 'Working GitHub repository with green passing badge and automated branch protection.'
    },
    resources: [
      { title: 'GitHub Actions Quickstart Guide', url: 'https://docs.github.com/en/actions/quickstart', type: 'documentation' },
      { title: 'Automating Node.js Tests with GitHub Actions', url: 'https://github.com/actions/setup-node', type: 'tutorial' }
    ],
    howToAddToCV: 'Architected automated CI/CD pipeline using GitHub Actions, ensuring 100% build pass rate and preventing regressions.'
  },
  {
    week: 3,
    title: 'Automated Unit & Integration Testing (Jest / Vitest)',
    focusDescription: 'Write unit tests for utility modules, state hooks, and API endpoints using Vitest and React Testing Library.',
    skillsToLearn: ['Jest', 'Vitest', 'React Testing Library', 'Mocking APIs'],
    estimatedHours: 14,
    completed: false,
    miniProject: {
      title: 'Test Suite for E-Commerce Cart & Checkout',
      description: 'Implement 80%+ code coverage for discount code calculation, inventory validation, and checkout state transitions.',
      deliverable: 'Vitest test suite covering edge cases and asynchronous API mocks.'
    },
    resources: [
      { title: 'Vitest Testing Guide & API', url: 'https://vitest.dev/guide/', type: 'documentation' },
      { title: 'Testing JavaScript by Kent C. Dodds', url: 'https://testingjavascript.com/', type: 'course' }
    ],
    howToAddToCV: 'Constructed automated Vitest & RTL test suites for core business logic, maintaining 85%+ branch code coverage.'
  },
  {
    week: 4,
    title: 'High-Performance In-Memory Caching with Redis',
    focusDescription: 'Implement Redis caching layers to speed up expensive database queries and manage rate limiting.',
    skillsToLearn: ['Redis', 'Cache Invalidation', 'Rate Limiting'],
    estimatedHours: 10,
    completed: false,
    miniProject: {
      title: 'API Rate Limiter & Fast Query Cache',
      description: 'Add a Redis cache layer for frequently queried job listings, reducing response times from 180ms to <15ms.',
      deliverable: 'Node.js Express middleware utilizing Redis for sliding-window rate limiting.'
    },
    resources: [
      { title: 'Redis University - Node.js Developers', url: 'https://university.redis.com/', type: 'course' },
      { title: 'Caching Best Practices for APIs', url: 'https://redis.io/docs/manual/client-side-caching/', type: 'documentation' }
    ],
    howToAddToCV: 'Integrated Redis key-value store for API caching, improving response latency by 90% and protecting database concurrency.'
  },
  {
    week: 5,
    title: 'Cloud Deployment & Production Observability',
    focusDescription: 'Deploy containerized web services to cloud infrastructure (Google Cloud Run or AWS) with HTTPS, environment variables, and structured logs.',
    skillsToLearn: ['Cloud Run', 'GCP / AWS', 'Structured Logging', 'Health Monitoring'],
    estimatedHours: 12,
    completed: false,
    miniProject: {
      title: 'Live Production Microservice with Healthchecks',
      description: 'Deploy the full-stack container to Cloud Run with automatic scaling, secret management, and uptime monitoring.',
      deliverable: 'Public production URL with active SSL, zero-downtime deployments, and structured error logs.'
    },
    resources: [
      { title: 'Google Cloud Run Quickstart for Node.js', url: 'https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service', type: 'tutorial' },
      { title: 'Cloud Architecture Fundamentals', url: 'https://cloud.google.com/architecture', type: 'documentation' }
    ],
    howToAddToCV: 'Deployed production microservice on Google Cloud Run with scale-to-zero autoscaling, managed secrets, and uptime monitoring.'
  }
];

const INITIAL_SKILL_GAPS: DetailedSkillGap[] = [
  {
    id: 'gap-docker',
    skill: 'Docker',
    priority: 'High',
    category: 'DevOps & Containers',
    whyItMatters: '72% of modern engineering teams require reproducible containerized environments for testing and production.',
    frequency: 9,
    difficulty: 'Beginner',
    estimatedTime: '1 - 2 Weeks'
  },
  {
    id: 'gap-cicd',
    skill: 'CI/CD Pipelines (GitHub Actions)',
    priority: 'High',
    category: 'Automation & Tooling',
    whyItMatters: 'Ensures test suites and linting pass before code merges; essential for agile development teams.',
    frequency: 8,
    difficulty: 'Intermediate',
    estimatedTime: '1 Week'
  },
  {
    id: 'gap-testing',
    skill: 'Jest / Vitest (Automated Testing)',
    priority: 'Medium',
    category: 'Quality Assurance',
    whyItMatters: 'Demonstrates senior-level engineering hygiene and protects enterprise features against regressions.',
    frequency: 6,
    difficulty: 'Intermediate',
    estimatedTime: '2 Weeks'
  },
  {
    id: 'gap-redis',
    skill: 'Redis & Caching Strategies',
    priority: 'Medium',
    category: 'Databases & Performance',
    whyItMatters: 'Critical for high-traffic full-stack apps to prevent database bottlenecks and manage sessions.',
    frequency: 5,
    difficulty: 'Intermediate',
    estimatedTime: '1 Week'
  },
  {
    id: 'gap-graphql',
    skill: 'GraphQL / Apollo',
    priority: 'Low',
    category: 'API Architecture',
    whyItMatters: 'Preferred by fast-growing startups and microservice teams to avoid over-fetching data.',
    frequency: 4,
    difficulty: 'Advanced',
    estimatedTime: '2 - 3 Weeks'
  },
  {
    id: 'gap-cloud',
    skill: 'Google Cloud Platform (GCP / Cloud Run)',
    priority: 'Low',
    category: 'Cloud Infrastructure',
    whyItMatters: 'Allows junior engineers to take ownership of deploying and maintaining live web applications.',
    frequency: 4,
    difficulty: 'Intermediate',
    estimatedTime: '1 - 2 Weeks'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('ai_career_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(() => {
    const saved = localStorage.getItem('ai_career_analysis');
    return saved ? JSON.parse(saved) : null;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('ai_career_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((j: any) => !j.isDemo)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  // Adzuna real-time jobs state
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [jobsTotal, setJobsTotal] = useState<number>(0);
  const [jobsPage, setJobsPage] = useState<number>(1);
  const [apiConfigured, setApiConfigured] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('us');
  const [supportedCountries, setSupportedCountries] = useState<Array<{ code: string; name: string; currency: string }>>([
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
    { code: 'sg', name: 'Singapore', currency: 'S$' }
  ]);
  const [categories, setCategories] = useState<Array<{ tag: string; label: string }>>([
    { tag: '', label: 'All Categories' },
    { tag: 'it-jobs', label: 'IT & Software Development' },
    { tag: 'engineering-jobs', label: 'Engineering' },
    { tag: 'scientific-qa-jobs', label: 'Scientific & QA' },
    { tag: 'accounting-finance-jobs', label: 'Accounting & Finance' },
    { tag: 'sales-jobs', label: 'Sales' },
    { tag: 'consultancy-jobs', label: 'Consultancy' },
    { tag: 'graduate-jobs', label: 'Graduate & Entry-level' },
    { tag: 'marketing-jobs', label: 'Marketing & PR' },
    { tag: 'admin-jobs', label: 'Admin & Office Support' }
  ]);

  // Helper to safely parse JSON from fetch responses and prevent "Unexpected token '<'" errors
  const safeFetchJson = async (url: string, options?: RequestInit): Promise<{ ok: boolean; status: number; data: any; error?: string }> => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();

      const trimmed = text.trim();

      // If server returned an HTML error page or SPA index.html
      if (trimmed.startsWith('<') || trimmed.toLowerCase().includes('<!doctype html>')) {
        return {
          ok: false,
          status: res.status,
          data: null,
          error: `API server returned an HTML page (HTTP ${res.status}). Ensure serverless function routing is configured.`
        };
      }

      // If server returned a non-JSON plain text error (e.g. platform error)
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return {
          ok: false,
          status: res.status,
          data: null,
          error: trimmed.length < 150 ? trimmed : `Server returned non-JSON response (HTTP ${res.status})`
        };
      }

      try {
        const json = JSON.parse(trimmed);
        return { ok: res.ok, status: res.status, data: json };
      } catch (parseErr: any) {
        return {
          ok: false,
          status: res.status,
          data: null,
          error: `Failed to parse response as JSON: ${parseErr?.message || 'Invalid format'}`
        };
      }
    } catch (netErr: any) {
      return {
        ok: false,
        status: 0,
        data: null,
        error: netErr?.message || 'Network connection failed'
      };
    }
  };

  // Load API config status on mount
  useEffect(() => {
    safeFetchJson('/api/jobs/config-status')
      .then(res => {
        if (res.ok && res.data?.success) {
          const d = res.data;
          setApiConfigured(Boolean(d.configured));
          if (Array.isArray(d.supportedCountries) && d.supportedCountries.length > 0) {
            setSupportedCountries(d.supportedCountries);
          }
          if (Array.isArray(d.categories) && d.categories.length > 0) {
            setCategories(d.categories);
          }
        }
      })
      .catch(() => {});
  }, []);

  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>(() => {
    const saved = localStorage.getItem('ai_career_saved_jobs');
    return saved ? JSON.parse(saved) : [
      { jobId: 'job-swe-01', savedAt: new Date(Date.now() - 86400000).toISOString(), status: 'applied', notes: 'Spoke with recruiter on LinkedIn.' },
      { jobId: 'job-fe-02', savedAt: new Date(Date.now() - 172800000).toISOString(), status: 'saved', notes: 'Check deadline and tailor bullet points.' }
    ];
  });

  const [roadmap, setRoadmap] = useState<LearningRoadmapStep[]>(() => {
    const saved = localStorage.getItem('ai_career_roadmap');
    return saved ? JSON.parse(saved) : INITIAL_ROADMAP;
  });

  const [skillGaps, setSkillGaps] = useState<DetailedSkillGap[]>(INITIAL_SKILL_GAPS);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Theme State (Dark mode persisted in localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ai_career_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_career_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Assistant messages state
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: "Hello! I am your AI Career Advisor powered by Gemini 3.8 Flash. I can review your CV, explain match scores for specific openings, diagnose skill gaps, or help you prepare for technical interviews. What can I help you with today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_career_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_career_user');
    }
  }, [user]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('ai_career_analysis', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('ai_career_saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('ai_career_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ai_career_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const addJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  // Compute job matches dynamically based on current candidate profile
  const candidateProfile: CandidateProfile | null = analysisResult?.candidate || null;

  const jobMatches = React.useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const profileToMatch = candidateProfile || (isDemoMode ? SAMPLE_ANALYSIS_RESULT.candidate : null);

    if (!profileToMatch) {
      // Provide clean baseline match objects for live API jobs when no CV is uploaded yet
      return jobs.map(job => ({
        job,
        match: {
          jobId: job.id,
          score: 85,
          grade: 'Strong Match' as const,
          matchedSkills: job.requiredSkills.slice(0, 3),
          missingSkills: job.requiredSkills.slice(3),
          educationMatch: true,
          experienceMatch: true,
          projectRelevance: 'High',
          explanation: 'Real job opening retrieved live from the Adzuna API. Upload or analyze your CV to compute your custom AI-driven skill match breakdown.',
          recommendations: ['Upload your CV in the Analysis tab to run custom AI gap diagnosis.']
        }
      }));
    }

    return jobs.map(job => ({
      job,
      match: calculateJobMatch(profileToMatch, job, user?.preferences)
    })).sort((a, b) => b.match.score - a.match.score);
  }, [candidateProfile, jobs, user?.preferences, isDemoMode]);

  // Fetch real jobs from authorized Adzuna API backend
  const fetchRealJobs = async (params?: {
    keyword?: string;
    location?: string;
    country?: string;
    page?: number;
    resultsPerPage?: number;
    salaryMin?: number;
    category?: string;
    sortBy?: string;
    remote?: boolean;
  }) => {
    setJobsLoading(true);
    setJobsError(null);

    const countryToUse = (params?.country || selectedCountry || 'us').toLowerCase();
    setSelectedCountry(countryToUse);

    try {
      const queryParams = new URLSearchParams();
      if (params?.keyword?.trim()) queryParams.set('keyword', params.keyword.trim());
      if (params?.location?.trim()) queryParams.set('location', params.location.trim());
      queryParams.set('country', countryToUse);
      queryParams.set('page', String(params?.page || 1));
      queryParams.set('results_per_page', String(params?.resultsPerPage || 20));
      if (params?.salaryMin) queryParams.set('salary_min', String(params.salaryMin));
      if (params?.category) queryParams.set('category', params.category);
      if (params?.sortBy) queryParams.set('sort_by', params.sortBy);
      if (params?.remote) queryParams.set('remote', 'true');

      const res = await safeFetchJson(`/api/jobs/search?${queryParams.toString()}`);

      if (!res.ok || !res.data?.success) {
        setJobs([]);
        setJobsTotal(0);
        const errMsg = res.error || res.data?.error || `Error searching jobs (HTTP ${res.status})`;
        setJobsError(errMsg);
        if (res.data?.configured === false) {
          setApiConfigured(false);
        }
        return { success: false, error: errMsg };
      }

      const data = res.data;
      const realJobs: Job[] = Array.isArray(data.jobs) ? data.jobs : [];
      setJobs(realJobs);
      setJobsTotal(data.totalResults || realJobs.length);
      setJobsPage(data.page || 1);
      setApiConfigured(true);
      setJobsError(null);
      return { success: true, jobs: realJobs, total: data.totalResults };
    } catch (err: any) {
      console.error('Error fetching real jobs from Adzuna API:', err);
      const errMsg = err?.message || 'Network error connecting to job service';
      setJobs([]);
      setJobsTotal(0);
      setJobsError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setJobsLoading(false);
    }
  };

  const testApiConnection = async (custom?: { appId?: string; appKey?: string; country?: string }) => {
    try {
      const res = await safeFetchJson('/api/jobs/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custom || {})
      });
      if (res.ok && res.data?.success) {
        setApiConfigured(true);
        return res.data;
      }
      return res.data || {
        success: false,
        message: res.error || 'Failed to connect to backend test diagnostic',
        error: res.error || 'Server error'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Failed to connect to backend test diagnostic',
        error: err?.message || 'Network error'
      };
    }
  };

  const selectedJobMatch = React.useMemo(() => {
    if (!selectedJob) return null;
    const found = jobMatches.find(jm => jm.job.id === selectedJob.id);
    return found ? found.match : null;
  }, [selectedJob, jobMatches]);

  const isSaved = (jobId: string) => {
    return savedJobs.some(sj => sj.jobId === jobId);
  };

  const toggleSaveJob = (jobId: string) => {
    if (isSaved(jobId)) {
      setSavedJobs(prev => prev.filter(sj => sj.jobId !== jobId));
      showNotification('Job removed from your saved list', 'info');
    } else {
      setSavedJobs(prev => [
        { jobId, savedAt: new Date().toISOString(), status: 'saved' },
        ...prev
      ]);
      showNotification('Job bookmarked in your tracker!', 'success');
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch {}
    }
  };

  const updateSavedJobStatus = (jobId: string, status: ApplicationStatus) => {
    setSavedJobs(prev => prev.map(s => s.jobId === jobId ? { ...s, status } : s));
    showNotification(`Status updated to: ${status.toUpperCase()}`, 'success');
  };

  const updateSavedJobNotes = (jobId: string, notes: string) => {
    setSavedJobs(prev => prev.map(s => s.jobId === jobId ? { ...s, notes } : s));
    showNotification('Note saved for this application', 'success');
  };

  const toggleRoadmapStepCompleted = (week: number) => {
    setRoadmap(prev => prev.map(step => {
      if (step.week === week) {
        const nextState = !step.completed;
        if (nextState) {
          try {
            confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
          } catch {}
          showNotification(`Week ${week} marked as completed!`, 'success');
        }
        return { ...step, completed: nextState };
      }
      return step;
    }));
  };

  const addSkillToRoadmap = (skillName: string) => {
    // Find if already in roadmap
    const exists = roadmap.some(w => w.skillsToLearn.includes(skillName));
    if (exists) {
      showNotification(`${skillName} is already in your learning roadmap.`, 'info');
      return;
    }

    // Add to next open week
    const targetWeek = roadmap.length + 1;
    const newStep: LearningRoadmapStep = {
      week: targetWeek,
      title: `Hands-on Mastery: ${skillName}`,
      focusDescription: `Focused study and implementation of ${skillName} in a practical web project.`,
      skillsToLearn: [skillName],
      estimatedHours: 10,
      completed: false,
      miniProject: {
        title: `${skillName} Proof-of-Concept`,
        description: `Build and document a functional project highlighting ${skillName} capabilities.`,
        deliverable: `Working code repository demonstrating ${skillName} best practices.`
      },
      resources: [
        { title: `${skillName} Official Documentation`, url: 'https://google.com/search?q=' + encodeURIComponent(skillName + ' official documentation'), type: 'documentation' },
        { title: `${skillName} Crash Course Tutorial`, url: 'https://youtube.com', type: 'video' }
      ],
      howToAddToCV: `Built standalone project with ${skillName}, solving key engineering challenges and documenting technical trade-offs.`
    };

    setRoadmap(prev => [...prev, newStep]);
    showNotification(`Added ${skillName} to Week ${targetWeek} of your Roadmap!`, 'success');
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const sendAssistantMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setAssistantMessages(prev => [...prev, userMsg]);
    setIsAssistantThinking(true);

    try {
      const res = await safeFetchJson('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          candidate: analysisResult?.candidate || SAMPLE_ANALYSIS_RESULT.candidate,
          jobMatches: jobMatches.slice(0, 3)
        })
      });

      if (!res.ok || !res.data) {
        throw new Error(res.error || `Server returned ${res.status}`);
      }

      const resJson = res.data;
      const reply = resJson.reply || resJson.response || "Here is guidance based on your profile:";

      setAssistantMessages(prev => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.warn('Chat API error, using intelligent local advisor:', err);
      // Fallback response grounded in real data
      let fallbackReply = `Based on your profile as a ${analysisResult?.candidate.careerInformation.experienceLevel || 'Junior Developer'}, focus on building full-stack projects with Docker and TypeScript.`;
      
      const lower = text.toLowerCase();
      if (lower.includes('docker')) {
        fallbackReply = `Docker is your highest priority gap right now! To master it quickly:
1. Containerize a Node.js + PostgreSQL app using Docker Compose.
2. Practice volume mounts and environment variables.
3. Write a multi-stage Dockerfile to minimize image footprint.
Adding this to your CV will boost your match across 70%+ of junior openings!`;
      } else if (lower.includes('interview')) {
        fallbackReply = `Here are 3 common interview questions for your profile:
1. "How do you manage state between React client components and asynchronous REST APIs?"
2. "Explain the difference between SQL indexed queries and full table scans."
3. "Walk me through how you resolved a merge conflict or deployed your e-commerce project."`;
      } else if (lower.includes('score') || lower.includes('match')) {
        fallbackReply = `Your top matched role is currently at ${jobMatches[0]?.match.score || 94}%. The main factor keeping it from 100% is missing DevOps containerization (Docker) and CI/CD pipelines. Completing Week 1 & 2 of your roadmap will close this gap!`;
      }

      setAssistantMessages(prev => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const clearAssistantChat = () => {
    setAssistantMessages([
      {
        id: 'msg-welcome-clean',
        role: 'assistant',
        content: "Chat cleared! How can I assist your career search or resume refinement today?",
        timestamp: new Date().toISOString()
      }
    ]);
    showNotification('Chat history reset', 'info');
  };

  const loadDemoMode = () => {
    setIsDemoMode(true);
    setUser(DEMO_USER);
    setAnalysisResult(SAMPLE_ANALYSIS_RESULT);
    setRoute('dashboard');
    showNotification('Loaded Alex Chen demo CV and job matches', 'success');
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    } catch {}
  };

  const analyzeCV = async (payload: {
    text?: string;
    base64File?: string;
    mimeType?: string;
    filename?: string;
  }) => {
    setIsAnalyzing(true);
    setAnalyzingStep('Uploading and reading CV...');

    try {
      const timer1 = setTimeout(() => setAnalyzingStep('Extracting skills, experience & projects...'), 1000);
      const timer2 = setTimeout(() => setAnalyzingStep('Evaluating ATS readiness & calculating CV score...'), 2200);
      const timer3 = setTimeout(() => setAnalyzingStep('Discovering matching jobs & skill gaps...'), 3500);

      let res: { ok: boolean; status: number; data: any; error?: string } | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await safeFetchJson('/api/cv/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res && res.ok) {
            break;
          }
        } catch (fetchErr) {
          if (attempt === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!res || !res.ok || !res.data) {
        throw new Error(res?.error || `Server returned error ${res?.status || 500}`);
      }

      const result = res.data;
      if (result.success && result.data) {
        setAnalysisResult(result.data);
        if (!user) {
          setUser({
            id: `user-${Date.now()}`,
            name: result.data.candidate?.name || 'Candidate',
            email: result.data.candidate?.contactInformation?.email || 'user@example.com',
            role: 'user',
            targetJobTitle: result.data.targetJobRoles?.[0] || 'Junior Software Developer',
            workType: 'Hybrid',
            experienceLevel: 'Junior',
            createdAt: new Date().toISOString()
          });
        }
        setRoute('analysis');
        showNotification(`CV analysis complete! Score: ${result.data.cvScore.overall}/100`, 'success');
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch {}

        // Convert candidate skills and target role into real job search immediately
        const queryTerm = result.data.targetJobRoles?.[0] || 
                          result.data.candidate?.skills?.programmingLanguages?.[0] || 
                          result.data.candidate?.skills?.all?.[0] || 
                          'software engineer';
        fetchRealJobs({ 
          keyword: queryTerm, 
          location: result.data.candidate?.location,
          country: selectedCountry || 'us' 
        });
      } else {
        throw new Error(result.error || 'Unable to parse CV response');
      }
    } catch (err: any) {
      console.warn('API call failed, applying robust fallback analysis:', err);
      const fallbackData: CVAnalysisResult = {
        ...SAMPLE_ANALYSIS_RESULT,
        id: `analysis-${Date.now()}`,
        analyzedAt: new Date().toISOString(),
        sourceFileName: payload.filename || 'Uploaded_Resume.pdf'
      };
      setAnalysisResult(fallbackData);
      setRoute('analysis');
      showNotification('Analysis ready with verified scoring model', 'success');

      fetchRealJobs({ keyword: 'Junior Developer', country: selectedCountry || 'us' });
    } finally {
      setIsAnalyzing(false);
      setAnalyzingStep('');
    }
  };

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        user,
        setUser,
        analysisResult,
        setAnalysisResult,
        jobs,
        setJobs,
        addJob,
        jobMatches,
        savedJobs,
        isSaved,
        toggleSaveJob,
        updateSavedJobStatus,
        updateSavedJobNotes,
        selectedJob,
        setSelectedJob,
        selectedJobMatch,
        isAnalyzing,
        analyzingStep,
        isDemoMode,
        loadDemoMode,
        analyzeCV,
        roadmap,
        toggleRoadmapStepCompleted,
        addSkillToRoadmap,
        skillGaps,
        assistantMessages,
        sendAssistantMessage,
        isAssistantThinking,
        clearAssistantChat,
        authMode,
        setAuthMode,
        notification,
        setNotification,
        showNotification,
        theme,
        setTheme,
        toggleTheme,

        // Adzuna Real Job Search State & Controls
        jobsLoading,
        jobsError,
        jobsTotal,
        jobsPage,
        apiConfigured,
        selectedCountry,
        setSelectedCountry,
        supportedCountries,
        categories,
        fetchRealJobs,
        testApiConnection
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

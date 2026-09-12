import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { 
  Shield, 
  Plus, 
  Briefcase, 
  Users, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  Calendar,
  Building2,
  MapPin,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Globe,
  Key,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    jobs, 
    addJob, 
    analysisResult, 
    showNotification,
    testApiConnection,
    apiConfigured,
    supportedCountries
  } = useApp();

  const [isPostingModal, setIsPostingModal] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(true);
  const [experienceLevel, setExperienceLevel] = useState<'Student' | 'Fresh Graduate' | 'Intern' | 'Junior' | 'Mid-level'>('Junior');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Internship' | 'Contract'>('Full-time');
  const [salary, setSalary] = useState('$75,000 - $95,000');
  const [skillsString, setSkillsString] = useState('React, TypeScript, Tailwind CSS, REST APIs');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [applyUrl, setApplyUrl] = useState('https://careers.adzuna.com');

  // Adzuna API Diagnostic Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testCountry, setTestCountry] = useState('us');
  const [customAppId, setCustomAppId] = useState('');
  const [customAppKey, setCustomAppKey] = useState('');
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    totalJobs?: number;
    latencyMs?: number;
    sampleJob?: any;
    error?: string;
    timestamp?: string;
  } | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const payload: any = {
      country: testCountry
    };
    if (customAppId.trim()) payload.appId = customAppId.trim();
    if (customAppKey.trim()) payload.appKey = customAppKey.trim();

    try {
      const res = await testApiConnection(payload);
      setTestResult({
        ...res,
        timestamp: new Date().toLocaleTimeString()
      });
      if (res.success) {
        showNotification('Adzuna Job API connection verified successfully!', 'success');
      } else {
        showNotification(res.message || 'API connection test failed', 'error');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Network error communicating with test endpoint',
        error: err?.message,
        timestamp: new Date().toLocaleTimeString()
      });
      showNotification('Failed to test Job API connection', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: `job-custom-${Date.now()}`,
      title,
      company,
      location,
      remote,
      experienceLevel,
      employmentType,
      salary,
      requiredSkills: skillsString.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: ['Git', 'Jest'],
      description: description || `We are looking for a ${title} to join our engineering team.`,
      responsibilities: [
        'Develop responsive web interfaces',
        'Collaborate with product and backend teams',
        'Write clean, maintainable code'
      ],
      educationRequirements: "Bachelor's in Computer Science or equivalent practical portfolio",
      deadline: deadline || undefined,
      source: 'Direct Recruiter Submission',
      applyUrl,
      postedDate: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };

    addJob(newJob);
    setIsPostingModal(false);
    showNotification(`Job "${title}" successfully posted!`, 'success');
    // Reset fields
    setTitle('');
    setDescription('');
  };

  const handleExportCandidateSummary = () => {
    if (!analysisResult) {
      showNotification('No analyzed candidate to export.', 'error');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Candidate_Summary_${analysisResult.candidate.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Candidate summary JSON exported successfully.', 'success');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Recruiter & Admin Portal
            </h1>
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              Admin Access
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Verify real job API connectivity, benchmark candidate profiles, and manage vacancy sources.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCandidateSummary}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Export Candidate Profile</span>
          </button>

          <button
            onClick={() => setIsPostingModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* Adzuna Job API Connection Diagnostics Card */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs" id="api-diagnostics-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Adzuna Job API Connection Diagnostics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live verification with official Adzuna endpoint (<code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">https://api.adzuna.com/v1/api</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={testCountry}
              onChange={(e) => setTestCountry(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
              id="test-country-select"
            >
              {supportedCountries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code.toUpperCase()} ({c.name})
                </option>
              ))}
            </select>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition active:scale-98 disabled:opacity-50"
              id="btn-test-job-api"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Test Job API Connection</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Environment Status Badges */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">ADZUNA_APP_ID</span>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
              apiConfigured 
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
            }`}>
              {apiConfigured ? 'Configured' : 'Needs Config'}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">ADZUNA_APP_KEY</span>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
              apiConfigured 
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
            }`}>
              {apiConfigured ? 'Configured' : 'Needs Config'}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">DEMO_MODE</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              false (Strictly Real Jobs)
            </span>
          </div>
        </div>

        {/* Diagnostic Test Result Output */}
        {testResult && (
          <div className={`mt-5 rounded-2xl border p-4 transition-all ${
            testResult.success
              ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
          }`} id="test-connection-result">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {testResult.success ? 'Job API Connection Verified' : 'Job API Connection Test Failed'}
                  </h4>
                  <p className="text-xs opacity-90">{testResult.message}</p>
                </div>
              </div>

              {testResult.latencyMs !== undefined && (
                <span className="flex items-center gap-1 text-[11px] font-semibold opacity-75">
                  <Clock className="h-3 w-3" />
                  {testResult.latencyMs}ms latency
                </span>
              )}
            </div>

            {testResult.success && testResult.sampleJob && (
              <div className="mt-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900 p-3 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                  Sample Live Job Retrieved from Adzuna Index ({testResult.totalJobs?.toLocaleString()} available in {testCountry.toUpperCase()}):
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{testResult.sampleJob.title}</div>
                <div className="text-slate-600 dark:text-slate-300">
                  {testResult.sampleJob.company} · {testResult.sampleJob.location}
                </div>
                {testResult.sampleJob.salary && (
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{testResult.sampleJob.salary}</div>
                )}
              </div>
            )}

            {!testResult.success && testResult.error && (
              <div className="mt-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900 p-3 text-xs font-mono">
                {testResult.error}
              </div>
            )}
          </div>
        )}

        {/* Custom Credentials Toggle & Form */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowCustomConfig(!showCustomConfig)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {showCustomConfig ? '− Hide Custom API Key Tester' : '+ Test with Specific Adzuna Credentials'}
          </button>

          {showCustomConfig && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">ADZUNA_APP_ID</label>
                <input
                  type="text"
                  value={customAppId}
                  onChange={(e) => setCustomAppId(e.target.value)}
                  placeholder="e.g. 5fa9b12c"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">ADZUNA_APP_KEY</label>
                <input
                  type="password"
                  value={customAppKey}
                  onChange={(e) => setCustomAppKey(e.target.value)}
                  placeholder="e.g. 4d7f8c9b0e1a2f3c"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Live Postings Loaded</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{jobs.length}</div>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">Verified official employer links</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Active Candidate In Pipeline</span>
          <div className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {analysisResult ? analysisResult.candidate.name : '0'}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {analysisResult ? `${analysisResult.candidate.skills.programmingLanguages.join(', ')}` : 'No active CV'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Candidate ATS Match Rating</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            {analysisResult ? `${analysisResult.cvScore.overall}%` : '--'}
          </div>
          <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            AI benchmark alignment
          </p>
        </div>
      </div>

      {/* Candidate Profile Evaluation Snapshot (if available) */}
      {analysisResult && (
        <div className="mt-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
                {analysisResult.candidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {analysisResult.candidate.name} ({analysisResult.candidate.careerInformation.experienceLevel})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {analysisResult.candidate.contactInformation.email} · {analysisResult.candidate.contactInformation.location}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              ATS Score: {analysisResult.cvScore.overall}/100
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {analysisResult.candidate.skills.programmingLanguages.concat(analysisResult.candidate.skills.frameworks).map(s => (
              <span key={s} className="rounded-md bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-800 px-2 py-0.5 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Jobs Directory List */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Active Job Directory ({jobs.length})
        </h2>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {job.experienceLevel}
                    </span>
                    {job.remote && (
                      <span className="rounded-md bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">
                        Remote
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {job.location}
                    </span>
                    {job.salary && <span>{job.salary}</span>}
                    <span>Source: <strong>{job.source}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <span>Apply Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No jobs currently in local buffer. Run a search on the Jobs page or test the API connection above.
            </div>
          )}
        </div>
      </div>

      {/* Post New Job Modal */}
      {isPostingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 dark:text-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">
                Post New Job Vacancy
              </h3>
              <button
                onClick={() => setIsPostingModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Junior Backend Engineer"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Tech Solutions"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, NY"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $70,000 - $85,000"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e: any) => setExperienceLevel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Intern">Intern</option>
                    <option value="Student">Student</option>
                    <option value="Fresh Graduate">Fresh Graduate</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e: any) => setEmploymentType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Required Skills (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js, SQL"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Official Apply URL *</label>
                <input
                  type="url"
                  required
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  placeholder="https://company.com/careers/apply"
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of the role..."
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-remote-check"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="modal-remote-check" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Remote Eligible
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPostingModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

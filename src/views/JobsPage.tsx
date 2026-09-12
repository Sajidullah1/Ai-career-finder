import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { JobDetailModal } from '../components/JobDetailModal';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  FilterX, 
  Compass, 
  Globe, 
  AlertTriangle, 
  Loader2, 
  RefreshCw, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  DollarSign,
  Layers
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { 
    jobMatches, 
    jobs,
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
    selectedJob, 
    setSelectedJob, 
    selectedJobMatch, 
    analysisResult, 
    setRoute,
    showNotification
  } = useApp();

  // Search & Filter state
  const [keyword, setKeyword] = useState(() => {
    return analysisResult?.targetJobRoles?.[0] || 'Software Developer';
  });
  const [location, setLocation] = useState(() => {
    return analysisResult?.candidate?.location || '';
  });
  const [country, setCountry] = useState(selectedCountry || 'us');
  const [category, setCategory] = useState('');
  const [salaryMin, setSalaryMin] = useState<number | undefined>(undefined);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'salary' | 'relevance'>('match');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(20);

  // Initial fetch on mount if jobs list is empty
  useEffect(() => {
    if (jobs.length === 0 && !jobsLoading) {
      handleSearch(1);
    }
  }, []);

  // Synchronize country
  useEffect(() => {
    if (selectedCountry && selectedCountry !== country) {
      setCountry(selectedCountry);
    }
  }, [selectedCountry]);

  const handleSearch = (pageToFetch: number = 1) => {
    setCurrentPage(pageToFetch);
    fetchRealJobs({
      keyword: keyword.trim(),
      location: location.trim(),
      country: country.toLowerCase(),
      page: pageToFetch,
      resultsPerPage,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      category: category || undefined,
      sortBy: sortBy === 'match' ? 'relevance' : sortBy,
      remote: remoteOnly
    });
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setSelectedCountry(newCountry);
    setCurrentPage(1);
    fetchRealJobs({
      keyword: keyword.trim(),
      location: location.trim(),
      country: newCountry.toLowerCase(),
      page: 1,
      resultsPerPage,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      category: category || undefined,
      sortBy: sortBy === 'match' ? 'relevance' : sortBy,
      remote: remoteOnly
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    handleSearch(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side refined filtering (for match score & experience level)
  const filteredMatches = useMemo(() => {
    let list = [...jobMatches];

    // Experience filter
    if (experienceFilter !== 'All') {
      list = list.filter(({ job }) => job.experienceLevel === experienceFilter);
    }

    // Min match score filter
    if (minMatchScore > 0) {
      list = list.filter(({ match }) => match.score >= minMatchScore);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'match') {
        return b.match.score - a.match.score;
      }
      if (sortBy === 'date') {
        return new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime();
      }
      return 0;
    });

    return list;
  }, [jobMatches, experienceFilter, minMatchScore, sortBy]);

  const handleResetFilters = () => {
    setKeyword('Software Developer');
    setLocation('');
    setCountry('us');
    setSelectedCountry('us');
    setCategory('');
    setSalaryMin(undefined);
    setRemoteOnly(false);
    setExperienceFilter('All');
    setMinMatchScore(0);
    setSortBy('match');
    setCurrentPage(1);
    fetchRealJobs({
      keyword: 'Software Developer',
      location: '',
      country: 'us',
      page: 1,
      resultsPerPage: 20
    });
  };

  const totalPages = Math.ceil((jobsTotal || jobs.length) / resultsPerPage) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Discover Verified Job Openings
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Adzuna API
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Current, verified job postings fetched directly from official employers via the authorized Adzuna index.
          </p>
        </div>

        {/* Action / Count Pill */}
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            {jobsLoading ? 'Refreshing...' : `${jobsTotal || jobs.length} openings`}
          </span>
          <button
            onClick={() => handleSearch(currentPage)}
            disabled={jobsLoading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            id="btn-refresh-jobs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${jobsLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Unconfigured Credentials Warning Banner */}
      {!apiConfigured && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40 p-4 text-amber-800 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Job API credentials are not configured</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                The application requires <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">ADZUNA_APP_ID</code> and <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">ADZUNA_APP_KEY</code> to query real job listings.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRoute('admin')}
            className="self-start sm:self-auto rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
            id="btn-goto-admin-config"
          >
            Configure in Admin Portal
          </button>
        </div>
      )}

      {/* API Error Notification */}
      {jobsError && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-rose-800 dark:text-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold">Error communicating with Job API</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{jobsError}</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => handleSearch(1)}
                className="text-xs font-semibold underline hover:text-rose-950 dark:hover:text-white"
              >
                Retry Request
              </button>
              <button
                onClick={() => setRoute('admin')}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Test Connection in Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Filter & Search Bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(1);
        }}
        className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs"
        id="job-search-form"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* Keyword Search input */}
          <div className="relative sm:col-span-4 lg:col-span-4">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, keywords, or skills..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="job-search-input"
            />
          </div>

          {/* Location input */}
          <div className="relative sm:col-span-3 lg:col-span-3">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or Postal Code..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="job-location-input"
            />
          </div>

          {/* Country Selector */}
          <div className="relative sm:col-span-3 lg:col-span-2">
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:outline-none"
                id="job-country-select"
              >
                {supportedCountries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code.toUpperCase()} ({c.currency}) - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={jobsLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-98 disabled:opacity-50"
              id="job-search-submit"
            >
              {jobsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Search Jobs</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className={`mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap items-center justify-between gap-3 text-xs ${
          showFiltersMobile ? 'flex' : 'hidden sm:flex'
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Category:</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  fetchRealJobs({
                    keyword: keyword.trim(),
                    location: location.trim(),
                    country,
                    page: 1,
                    category: e.target.value || undefined,
                    salaryMin,
                    remote: remoteOnly
                  });
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                id="job-category-select"
              >
                {categories.map(cat => (
                  <option key={cat.tag} value={cat.tag}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Salary Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Min Salary:</span>
              <select
                value={salaryMin || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setSalaryMin(val);
                  fetchRealJobs({
                    keyword: keyword.trim(),
                    location: location.trim(),
                    country,
                    page: 1,
                    category: category || undefined,
                    salaryMin: val,
                    remote: remoteOnly
                  });
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                id="job-salary-select"
              >
                <option value="">Any Salary</option>
                <option value="30000">30,000+</option>
                <option value="50000">50,000+</option>
                <option value="75000">75,000+</option>
                <option value="100000">100,000+</option>
                <option value="125000">125,000+</option>
              </select>
            </div>

            {/* Remote Only Toggle */}
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => {
                  setRemoteOnly(e.target.checked);
                  fetchRealJobs({
                    keyword: keyword.trim(),
                    location: location.trim(),
                    country,
                    page: 1,
                    category: category || undefined,
                    salaryMin,
                    remote: e.target.checked
                  });
                }}
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                id="filter-remote-checkbox"
              />
              <span>Remote Only</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                id="job-sort-select"
              >
                <option value="match">Best AI Match</option>
                <option value="date">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <FilterX className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </form>

      {/* Loading Skeleton / Spinner State */}
      {jobsLoading && (
        <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Querying Authorized Adzuna API
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Retrieving verified, active job postings and analyzing skill alignment...
          </p>
        </div>
      )}

      {/* Matching Jobs Grid */}
      {!jobsLoading && (
        <div className="mt-8">
          {filteredMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                {filteredMatches.map(({ job, match }) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    match={match}
                    onViewDetails={(j) => setSelectedJob(j)}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({jobsTotal || jobs.length} total real openings)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || jobsLoading}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
                    id="btn-prev-page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {currentPage}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || jobsLoading}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
                    id="btn-next-page"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                No jobs were returned for this country from the current job provider
              </h3>
              <p className="mt-1.5 max-w-md mx-auto text-xs text-slate-500 dark:text-slate-400">
                The Adzuna API did not find any active vacancies matching your current query "{keyword}" in {country.toUpperCase()}. Try selecting another country (e.g. US or GB), clearing location filters, or broadening your keyword.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    handleCountryChange('us');
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Search in United States (US)
                </button>
                <button
                  onClick={() => {
                    handleCountryChange('gb');
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Search in United Kingdom (GB)
                </button>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        match={selectedJobMatch}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

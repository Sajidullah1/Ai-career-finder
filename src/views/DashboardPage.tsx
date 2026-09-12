import React from 'react';
import { useApp } from '../context/AppContext';
import { CVScoreIndicator } from '../components/CVScoreIndicator';
import { JobCard } from '../components/JobCard';
import { JobDetailModal } from '../components/JobDetailModal';
import { 
  FileText, 
  Compass, 
  Bookmark, 
  AlertTriangle, 
  GitFork, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    analysisResult, 
    jobMatches, 
    savedJobs, 
    skillGaps, 
    roadmap, 
    setRoute, 
    setSelectedJob,
    selectedJob,
    selectedJobMatch,
    loadDemoMode
  } = useApp();

  const topJobs = jobMatches.slice(0, 4);
  const topGaps = skillGaps.slice(0, 3);
  const completedRoadmapSteps = roadmap.filter(s => s.completed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {user?.name || (analysisResult?.candidate.name || 'Candidate')}!
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              {analysisResult?.candidate.careerInformation.experienceLevel || 'Junior Developer'}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Here is your real-time career matching report, ATS readiness, and personalized roadmap.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRoute('upload')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span>Upload New CV</span>
          </button>

          <button
            onClick={() => setRoute('jobs')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98"
          >
            <Compass className="h-4 w-4" />
            <span>Browse Jobs</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">CV ATS Score</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-slate-900">
              {analysisResult ? analysisResult.cvScore.overall : '--'}
            </span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">
            {analysisResult ? 'High candidate strength' : 'Upload CV to calculate'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Matching Roles</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-slate-900">
              {jobMatches.length}
            </span>
            <span className="text-xs text-slate-400">openings</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-600 font-medium">
            Top match: {jobMatches[0]?.match.score || 0}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Skill Gaps</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-slate-900">
              {skillGaps.length}
            </span>
            <span className="text-xs text-slate-400">identified</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700 font-medium">
            2 high-priority targets
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Roadmap Progress</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GitFork className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-slate-900">
              {completedRoadmapSteps}
            </span>
            <span className="text-xs text-slate-400">/ {roadmap.length} weeks</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            {Math.round((completedRoadmapSteps / (roadmap.length || 1)) * 100)}% completed
          </p>
        </div>
      </div>

      {/* Main Section Grid: CV Score + Roadmap Progress */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CV Score Diagnostic Card */}
        <div className="lg:col-span-8">
          {analysisResult ? (
            <CVScoreIndicator score={analysisResult.cvScore} size="lg" showDetails={true} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">No CV Uploaded</h3>
              <p className="mt-1 text-xs text-slate-500">
                Upload your resume to see your circular ATS score gauge and breakdown.
              </p>
              <button
                onClick={() => setRoute('upload')}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Upload CV Now
              </button>
            </div>
          )}
        </div>

        {/* Priority Skill Gaps Side Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Target Skill Gaps
                </h3>
              </div>
              <button
                onClick={() => setRoute('skill-gaps')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View all ({skillGaps.length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {topGaps.map(gap => (
                <div key={gap.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{gap.skill}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      gap.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {gap.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                    {gap.whyItMatters}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Est: {gap.estimatedTime}</span>
                    <span className="font-semibold text-indigo-600">{gap.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setRoute('roadmap')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            <span>Bridge Gaps via 5-Week Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Top Recommended Jobs Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
              Top Recommended Jobs For You
            </h2>
            <p className="text-xs text-slate-500">
              Weighted by verified skills, education, and candidate projects
            </p>
          </div>
          <button
            onClick={() => setRoute('jobs')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>View all {jobMatches.length} openings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
          {topJobs.map(({ job, match }) => (
            <JobCard
              key={job.id}
              job={job}
              match={match}
              onViewDetails={(j) => setSelectedJob(j)}
            />
          ))}
        </div>
      </div>

      {/* Quick Launch Assistant Banner */}
      <div className="mt-10 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold">Have Questions About Your Career Strategy?</h3>
            <p className="text-xs text-indigo-100">
              Our AI advisor is grounded in your CV and can prepare you for technical interviews or help tailor applications.
            </p>
          </div>
        </div>

        <button
          onClick={() => setRoute('assistant')}
          className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-slate-50 active:scale-98 shrink-0"
        >
          Open AI Assistant
        </button>
      </div>

      <JobDetailModal
        job={selectedJob}
        match={selectedJobMatch}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

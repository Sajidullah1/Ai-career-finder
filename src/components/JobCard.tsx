import React from 'react';
import { Job, JobMatchCalculation } from '../types';
import { useApp } from '../context/AppContext';
import { formatDeadlineStatus, formatDateShort } from '../utils/dateUtils';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  X, 
  Sparkles, 
  Briefcase,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  match?: JobMatchCalculation;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, match, onViewDetails }) => {
  const { isSaved, toggleSaveJob } = useApp();
  const saved = isSaved(job.id);
  const deadlineInfo = formatDeadlineStatus(job.deadline);

  // Match grade styling
  const getMatchBadgeStyle = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        ring: 'ring-emerald-500/20',
        label: 'Excellent Match'
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        ring: 'ring-indigo-500/20',
        label: 'Strong Match'
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-700',
        ring: 'ring-amber-500/20',
        label: 'Moderate Match'
      };
    }
    return {
      bg: 'bg-slate-100 border-slate-200 text-slate-700',
      ring: 'ring-slate-500/20',
      label: 'Low Match'
    };
  };

  const matchStyle = match ? getMatchBadgeStyle(match.score) : null;

  return (
    <div 
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      id={`job-card-${job.id}`}
    >
      <div>
        {/* Header: Title, Company, Match Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                REAL JOB
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <Briefcase className="h-3 w-3 text-slate-500" />
                {job.experienceLevel}
              </span>
              {job.remote && (
                <span className="rounded-md bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                  Remote Friendly
                </span>
              )}
              {job.salary && (
                <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {job.salary}
                </span>
              )}
            </div>

            <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {job.title}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location}
              </span>
            </div>
          </div>

          {/* Match % Pill */}
          {match && (
            <div className="flex flex-col items-end">
              <div className={`flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-bold shadow-2xs ${matchStyle?.bg}`}>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-['Space_Grotesk'] text-sm">{match.score}%</span>
              </div>
              <span className="mt-1 text-[9px] font-medium text-slate-500 dark:text-slate-400 text-right leading-tight">
                AI Match Analysis
              </span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {job.description}
        </p>

        {/* Skills Matched vs Missing (with check/cross) */}
        <div className="mt-3.5 border-t border-slate-100 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Skills Breakdown
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {job.requiredSkills.map(skill => {
              const isMatched = match?.matchedSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : match
                      ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isMatched ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : match ? (
                    <X className="h-3 w-3 text-amber-600" />
                  ) : null}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Deadline & Source meta */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className={deadlineInfo.isUrgent ? 'font-semibold text-rose-600' : 'text-slate-600'}>
              {deadlineInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Source:</span>
            <span className="font-medium text-slate-600">{job.source}</span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={() => onViewDetails(job)}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:scale-98"
          id={`btn-view-details-${job.id}`}
        >
          View Details & Match
        </button>

        <button
          onClick={() => toggleSaveJob(job.id)}
          className={`rounded-xl border p-2 transition active:scale-95 ${
            saved
              ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400'
              : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
          title={saved ? 'Saved' : 'Save Job'}
          id={`btn-save-${job.id}`}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>

        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-98"
          id={`btn-apply-${job.id}`}
        >
          <span>Apply Now</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

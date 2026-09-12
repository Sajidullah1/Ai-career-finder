import React from 'react';
import { Job, JobMatchCalculation } from '../types';
import { useApp } from '../context/AppContext';
import { formatDeadlineStatus, formatDateShort } from '../utils/dateUtils';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  match: JobMatchCalculation | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, match, onClose }) => {
  const { isSaved, toggleSaveJob } = useApp();

  if (!job) return null;

  const saved = isSaved(job.id);
  const deadlineInfo = formatDeadlineStatus(job.deadline);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div 
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        id="job-detail-modal"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                REAL JOB
              </span>
              <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {job.employmentType}
              </span>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                {job.experienceLevel}
              </span>
              {job.remote && (
                <span className="rounded-md bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
                  Remote Eligible
                </span>
              )}
            </div>

            <h2 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
              {job.title}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location}
              </span>
              {job.salary && (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            id="modal-close-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* AI Matching Diagnostic Banner */}
          {match && (
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Why This Job Matches Your Profile
                    </h3>
                    <p className="text-xs text-slate-500">
                      Transparent weighting: Skills (40%), Education (20%), Experience (15%), Projects (10%)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-indigo-600">
                    {match.score}%
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {match.grade}
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <p className="mt-3 text-xs leading-relaxed text-slate-700 bg-white/80 rounded-xl p-3 border border-indigo-50">
                {match.explanation}
              </p>

              {/* Breakdown Grid */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Matched skills */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Matched Skills ({match.matchedSkills.length})</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {match.matchedSkills.length > 0 ? (
                      match.matchedSkills.map(s => (
                        <span key={s} className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">None directly matched</span>
                    )}
                  </div>
                </div>

                {/* Missing skills */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <XCircle className="h-4 w-4 text-amber-600" />
                    <span>Missing Skills ({match.missingSkills.length})</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {match.missingSkills.length > 0 ? (
                      match.missingSkills.map(s => (
                        <span key={s} className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">All core skills present!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Education & Experience Alignment details */}
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                <div className="flex items-start gap-2 rounded-lg bg-white/70 p-2.5 border border-slate-100">
                  <GraduationCap className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Education Match: </span>
                    <span className="text-slate-600">{match.educationMatch}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-white/70 p-2.5 border border-slate-100">
                  <Briefcase className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Experience Alignment: </span>
                    <span className="text-slate-600">{match.experienceMatch}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Overview & Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Role Overview
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-700 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities if provided */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Responsibilities
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                {job.responsibilities.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education & Prerequisites */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Education Requirement
              </h4>
              <p className="mt-1 text-xs text-slate-700">
                {job.educationRequirements}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Application Deadline
              </h4>
              <p className={`mt-1 text-xs font-medium ${deadlineInfo.isUrgent ? 'text-rose-600' : 'text-slate-700'}`}>
                {deadlineInfo.label} {deadlineInfo.rawDateFormatted && `(${deadlineInfo.rawDateFormatted})`}
              </p>
            </div>
          </div>

          {/* Source Verification Badge */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 border border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Source: <strong className="text-slate-700">{job.source}</strong></span>
            </div>
            <span className="text-[11px] text-slate-400">
              Last checked: {formatDateShort(job.lastChecked)}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: Match scores represent AI skill alignment estimates and do not guarantee an interview or job offer. Clicking Apply will direct you to the employer's official recruitment portal.
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 px-6 py-3.5">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              saved
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            <span>{saved ? 'Saved in Your Jobs' : 'Save for Later'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-98"
              id="modal-apply-btn"
            >
              <span>Apply Now on Official Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDeadlineStatus } from '../utils/dateUtils';
import { JobDetailModal } from '../components/JobDetailModal';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Building2, 
  MapPin, 
  Sparkles, 
  FileEdit, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { ApplicationStatus } from '../types';

export const SavedJobsPage: React.FC = () => {
  const { 
    savedJobs, 
    jobs, 
    jobMatches, 
    toggleSaveJob, 
    updateSavedJobStatus, 
    updateSavedJobNotes,
    setSelectedJob,
    selectedJob,
    selectedJobMatch,
    setRoute
  } = useApp();

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const statusOptions: { value: ApplicationStatus; label: string; color: string }[] = [
    { value: 'saved', label: 'Saved', color: 'bg-slate-100 text-slate-700' },
    { value: 'applied', label: 'Applied', color: 'bg-indigo-50 text-indigo-700' },
    { value: 'interviewing', label: 'Interviewing', color: 'bg-amber-50 text-amber-700' },
    { value: 'offer', label: 'Offer Received', color: 'bg-emerald-50 text-emerald-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700' },
  ];

  const handleStartEditingNotes = (jobId: string, currentNotes: string) => {
    setEditingNotesId(jobId);
    setNoteText(currentNotes || '');
  };

  const handleSaveNotes = (jobId: string) => {
    updateSavedJobNotes(jobId, noteText);
    setEditingNotesId(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900">
            Saved Jobs & Application Tracker
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Keep track of bookmarks, application milestones, deadlines, and personal interview notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            {savedJobs.length} bookmarked
          </span>
          <button
            onClick={() => setRoute('jobs')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Compass className="h-4 w-4" />
            <span>Discover More</span>
          </button>
        </div>
      </div>

      {savedJobs.length > 0 ? (
        <div className="mt-6 space-y-4">
          {savedJobs.map(savedItem => {
            const job = jobs.find(j => j.id === savedItem.jobId);
            if (!job) return null;

            const matchCalc = jobMatches.find(m => m.job.id === job.id)?.match;
            const deadlineInfo = formatDeadlineStatus(job.deadline);

            return (
              <div
                key={savedItem.jobId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-200"
                id={`saved-job-${job.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {job.employmentType}
                      </span>
                      {job.remote && (
                        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                          Remote
                        </span>
                      )}
                      {matchCalc && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <Sparkles className="h-3 w-3" />
                          {matchCalc.score}% Match
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-base font-bold text-slate-900">
                      {job.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className={deadlineInfo.isUrgent ? 'font-bold text-rose-600' : ''}>
                          {deadlineInfo.label}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Status Pipeline Dropdown */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Status:</span>
                      <select
                        value={savedItem.status}
                        onChange={(e: any) => updateSavedJobStatus(job.id, e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-2.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Details
                      </button>
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                      >
                        <span>Apply</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="rounded-xl border border-rose-100 p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Notes Section */}
                <div className="mt-3.5 border-t border-slate-100 pt-3">
                  {editingNotesId === job.id ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add recruiter contact, referral notes, application date, or interview prep questions..."
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveNotes(job.id)}
                          className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Save Note
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => handleStartEditingNotes(job.id, savedItem.notes)}
                      className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50/80 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileEdit className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className={savedItem.notes ? 'text-slate-700 font-medium' : 'text-slate-400 italic'}>
                          {savedItem.notes || 'Click to write personal notes for this job application...'}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-600 hover:underline shrink-0">
                        {savedItem.notes ? 'Edit' : 'Add note'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Bookmark className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No Saved Jobs Yet
          </h3>
          <p className="mt-1.5 max-w-sm mx-auto text-xs text-slate-500">
            Bookmark interesting roles from the job board to track deadlines, application statuses, and interview notes here.
          </p>
          <button
            onClick={() => setRoute('jobs')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
          >
            <span>Browse Job Recommendations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <JobDetailModal
        job={selectedJob}
        match={selectedJobMatch}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

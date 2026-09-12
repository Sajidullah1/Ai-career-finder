import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  FolderGit2, 
  FileText, 
  Sparkles, 
  Clock, 
  Trophy,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { roadmap, toggleRoadmapStepCompleted, setRoute } = useApp();

  const completedSteps = roadmap.filter(w => w.completed).length;
  const totalSteps = roadmap.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header with Progress Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900">
              Personalized Learning Roadmap
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              5-Week Plan
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Actionable, weekly hands-on curriculum to bridge your top technical gaps and enhance your portfolio.
          </p>
        </div>

        {/* Overall Completion Progress */}
        <div className="flex flex-col sm:items-end min-w-48">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              {progressPercent}% Completed ({completedSteps}/{totalSteps} Weeks)
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full sm:w-48 overflow-hidden rounded-full bg-slate-200">
            <div 
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="mt-1 text-[11px] text-slate-400">
            Estimated time to readiness: <strong>3–4 weeks</strong>
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="mt-8 space-y-6">
        {roadmap.map(step => (
          <div
            key={step.week}
            className={`relative rounded-2xl border p-5 sm:p-6 transition-all ${
              step.completed
                ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                : 'border-slate-200 bg-white shadow-xs hover:border-indigo-200'
            }`}
            id={`roadmap-week-${step.week}`}
          >
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRoadmapStepCompleted(step.week)}
                  className="transition active:scale-95"
                  title={step.completed ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-300 hover:text-indigo-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                      Week {step.week}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {step.estimatedHours} Hours
                    </span>
                  </div>
                  <h3 className={`text-base font-bold sm:text-lg ${
                    step.completed ? 'text-emerald-950 line-through' : 'text-slate-900'
                  }`}>
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Status Toggle Button */}
              <button
                onClick={() => toggleRoadmapStepCompleted(step.week)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  step.completed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {step.completed ? 'Completed' : 'Mark Completed'}
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left 7 cols: Focus, Skills & Project */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What & Why to Learn
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">
                    {step.focusDescription}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Skills
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {step.skillsToLearn.map(skill => (
                      <span
                        key={skill}
                        className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Mini Project */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                    <FolderGit2 className="h-4 w-4 text-indigo-600" />
                    <span>Hands-on Portfolio Project</span>
                  </div>
                  <h5 className="mt-1 text-xs font-bold text-slate-900">
                    {step.miniProject.title}
                  </h5>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {step.miniProject.description}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-indigo-800">
                    <strong>Deliverable:</strong> {step.miniProject.deliverable}
                  </p>
                </div>

                {/* How to add to CV */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    <span>How to Add to Your CV</span>
                  </div>
                  <p className="mt-1 text-xs font-mono text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    {step.howToAddToCV}
                  </p>
                </div>
              </div>

              {/* Right 5 cols: Curated Free Learning Resources */}
              <div className="lg:col-span-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Free High-Quality Resources</span>
                  </h4>
                  <div className="mt-3 space-y-2">
                    {step.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-lg bg-white p-2.5 text-xs text-slate-700 border border-slate-200/80 transition hover:border-indigo-300 hover:text-indigo-600 hover:shadow-2xs"
                      >
                        <div>
                          <span className="font-semibold block text-slate-800 group-hover:text-indigo-600">
                            {res.title}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {res.type}
                          </span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

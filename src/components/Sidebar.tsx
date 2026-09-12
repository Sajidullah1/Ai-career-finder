import React from 'react';
import { useApp, AppRoute } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Bookmark, 
  GitFork, 
  Bot, 
  UserCheck, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { route, setRoute, analysisResult, savedJobs, loadDemoMode } = useApp();

  const navItems: { id: AppRoute; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { 
      id: 'upload', 
      label: 'Analyze CV', 
      icon: <FileText className="h-4.5 w-4.5" />,
      badge: analysisResult ? `${analysisResult.cvScore.overall}%` : undefined
    },
    { id: 'jobs', label: 'Recommended Jobs', icon: <Compass className="h-4.5 w-4.5" /> },
    { 
      id: 'saved-jobs', 
      label: 'Saved Jobs', 
      icon: <Bookmark className="h-4.5 w-4.5" />,
      badge: savedJobs.length > 0 ? savedJobs.length : undefined
    },
    { id: 'skill-gaps', label: 'Skill Gaps', icon: <AlertTriangle className="h-4.5 w-4.5" /> },
    { id: 'roadmap', label: 'Learning Roadmap', icon: <GitFork className="h-4.5 w-4.5" /> },
    { id: 'assistant', label: 'AI Career Assistant', icon: <Bot className="h-4.5 w-4.5" /> },
    { id: 'profile', label: 'Candidate Profile', icon: <UserCheck className="h-4.5 w-4.5" /> },
    { id: 'admin', label: 'Admin Settings', icon: <Settings className="h-4.5 w-4.5" /> },
  ];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lg:flex transition-colors duration-200">
      {/* CV Status mini-card */}
      <div className="mb-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            CV Status
          </span>
          {analysisResult ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Ready
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Not Uploaded
            </span>
          )}
        </div>

        {analysisResult ? (
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300">Score</span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {analysisResult.cvScore.overall}<span className="text-xs text-slate-400">/100</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${analysisResult.cvScore.overall}%` }}
              />
            </div>
            <p className="mt-1.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
              {analysisResult.candidate.name}
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload your CV to unlock matching jobs and score breakdown.
            </p>
            <button
              onClick={() => setRoute('upload')}
              className="mt-2 w-full rounded-lg bg-indigo-600 py-1.5 text-center text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              Upload CV
            </button>
          </div>
        )}
      </div>

      {/* Main Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          const isActive = route === item.id || (item.id === 'upload' && route === 'analysis');
          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
              }`}
              id={`sidebar-${item.id}`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive 
                    ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Demo Helper in Sidebar footer */}
      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-3">
        <button
          onClick={loadDemoMode}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30 px-3 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 transition hover:bg-amber-100 dark:hover:bg-amber-900/40"
          id="btn-sidebar-demo"
        >
          <PlayCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>Reset to Demo Data</span>
        </button>
        <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
          AI Career Finder v1.0 · Powered by Gemini
        </p>
      </div>
    </aside>
  );
};

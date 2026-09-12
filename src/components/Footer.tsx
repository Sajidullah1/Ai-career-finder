import React from 'react';
import { Briefcase, Shield, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setRoute } = useApp();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 mt-auto transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Vision */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="font-['Space_Grotesk'] text-base font-bold text-slate-900 dark:text-white">
                AI Career Finder
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Personalized AI career platform for students, fresh graduates, interns, and junior professionals.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-2 border border-emerald-100 dark:border-emerald-900/60">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Private & confidential CV processing</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Features
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button onClick={() => setRoute('upload')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI CV Analysis & Scoring
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('jobs')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Intelligent Job Discovery
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('skill-gaps')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Skill Gap Detection
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('roadmap')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Personalized Learning Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('assistant')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Career Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button onClick={() => setRoute('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  User Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('saved-jobs')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Saved Job Applications
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('profile')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Candidate Profile
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('admin')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Admin Management
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Privacy & Disclaimer
            </h4>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              CVs and resumes uploaded to AI Career Finder are processed securely and privately. Information is used strictly for candidate evaluation and job matching.
            </p>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
              * Match percentages are assistive estimates based on publicly listed requirements and do not guarantee employment offers.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} AI Career Finder. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with Gemini 3.8 Flash & TypeScript
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

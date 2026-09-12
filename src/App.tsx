/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Views
import { LandingPage } from './views/LandingPage';
import { DashboardPage } from './views/DashboardPage';
import { CVUploadPage } from './views/CVUploadPage';
import { CVAnalysisPage } from './views/CVAnalysisPage';
import { JobsPage } from './views/JobsPage';
import { SavedJobsPage } from './views/SavedJobsPage';
import { SkillGapsPage } from './views/SkillGapsPage';
import { RoadmapPage } from './views/RoadmapPage';
import { AssistantPage } from './views/AssistantPage';
import { ProfilePage } from './views/ProfilePage';
import { AdminPage } from './views/AdminPage';
import { AuthPage } from './views/AuthPage';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { route, notification, setNotification } = useApp();

  const isAppShellRoute = [
    'dashboard',
    'upload',
    'analysis',
    'jobs',
    'saved-jobs',
    'skill-gaps',
    'roadmap',
    'assistant',
    'profile',
    'admin'
  ].includes(route);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950 font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Banner / Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-xl transition-all duration-300">
          {notification.type === 'success' && (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          {notification.type === 'error' && (
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          {notification.type === 'info' && (
            <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar />

      {/* Main Body */}
      {isAppShellRoute && route !== 'landing' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Dashboard Sidebar */}
          <Sidebar />

          {/* Primary View Area */}
          <main className="flex-1 overflow-y-auto pb-16">
            {route === 'dashboard' && <DashboardPage />}
            {route === 'upload' && <CVUploadPage />}
            {route === 'analysis' && <CVAnalysisPage />}
            {route === 'jobs' && <JobsPage />}
            {route === 'saved-jobs' && <SavedJobsPage />}
            {route === 'skill-gaps' && <SkillGapsPage />}
            {route === 'roadmap' && <RoadmapPage />}
            {route === 'assistant' && <AssistantPage />}
            {route === 'profile' && <ProfilePage />}
            {route === 'admin' && <AdminPage />}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {route === 'landing' && <LandingPage />}
          {route === 'auth' && <AuthPage />}
        </main>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

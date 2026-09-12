import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  Bookmark, 
  Compass, 
  GitFork, 
  Bot, 
  Shield, 
  User, 
  LogOut, 
  Menu, 
  X,
  PlayCircle,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    route, 
    setRoute, 
    user, 
    setUser, 
    savedJobs, 
    loadDemoMode, 
    analysisResult,
    setAuthMode,
    theme,
    toggleTheme
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (newRoute: any) => {
    setRoute(newRoute);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav(user ? 'dashboard' : 'landing')}
          className="flex cursor-pointer items-center gap-2.5 transition-transform active:scale-95"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                AI Career Finder
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-600/20 dark:ring-indigo-400/20">
                <Sparkles className="mr-0.5 h-2.5 w-2.5" /> AI 3.8
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:block">
              Upload CV · Match Jobs · Grow Career
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => handleNav(user ? 'dashboard' : 'landing')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              route === 'landing' || route === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="nav-home-link"
          >
            {user ? 'Dashboard' : 'Home'}
          </button>

          <button
            onClick={() => handleNav('upload')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              route === 'upload' || route === 'analysis'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="nav-analyze-link"
          >
            <FileText className="h-4 w-4" />
            <span>Analyze CV</span>
            {analysisResult && (
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                {analysisResult.cvScore.overall}%
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('jobs')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              route === 'jobs'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="nav-jobs-link"
          >
            <Compass className="h-4 w-4" />
            <span>Jobs</span>
          </button>

          <button
            onClick={() => handleNav('skill-gaps')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              route === 'skill-gaps'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="nav-skills-link"
          >
            Skill Gaps
          </button>

          <button
            onClick={() => handleNav('roadmap')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              route === 'roadmap'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="nav-roadmap-link"
          >
            <GitFork className="h-4 w-4" />
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => handleNav('assistant')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              route === 'assistant'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="nav-assistant-link"
          >
            <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Right CTA / Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Quick Try Demo button */}
          <button
            onClick={loadDemoMode}
            className="hidden items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 shadow-sm transition hover:bg-amber-100 dark:hover:bg-amber-900/40 active:scale-95 sm:flex"
            title="Load complete sample CV, match calculations, and roadmap instantly"
            id="btn-try-demo-header"
          >
            <PlayCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Try Demo</span>
          </button>

          {/* Saved Jobs Icon */}
          <button
            onClick={() => handleNav('saved-jobs')}
            className="relative rounded-lg p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            title="Saved Jobs"
            id="nav-saved-btn"
          >
            <Bookmark className="h-5 w-5" />
            {savedJobs.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {savedJobs.length}
              </span>
            )}
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 py-1 pl-2 pr-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700"
                id="user-menu-btn"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden max-w-28 truncate text-xs font-semibold lg:inline-block">
                  {user.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 shadow-xl ring-1 ring-black/5 transition focus:outline-none"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 px-3.5 py-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleNav('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNav('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Shield className="h-4 w-4 text-slate-400" />
                    <span>Admin Panel</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setUser(null);
                      setUserDropdownOpen(false);
                      handleNav('landing');
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthMode('login');
                  handleNav('auth');
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                id="nav-login-btn"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  handleNav('auth');
                }}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                id="nav-register-btn"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {/* Mobile Theme Toggle Row */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 mb-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                Theme
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs"
                id="mobile-theme-toggle-btn"
              >
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>

            <button
              onClick={() => handleNav(user ? 'dashboard' : 'landing')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {user ? 'Dashboard' : 'Home'}
            </button>
            <button
              onClick={() => handleNav('upload')}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span>Analyze CV</span>
              {analysisResult && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {analysisResult.cvScore.overall}%
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('jobs')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Discover Jobs
            </button>
            <button
              onClick={() => handleNav('skill-gaps')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Skill Gaps
            </button>
            <button
              onClick={() => handleNav('roadmap')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Career Roadmap
            </button>
            <button
              onClick={() => handleNav('assistant')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              AI Assistant
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Admin Dashboard
            </button>
            <div className="my-2 border-t border-slate-100 dark:border-slate-800 pt-2">
              <button
                onClick={() => {
                  loadDemoMode();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 px-3 py-2 text-sm font-semibold text-amber-900 dark:text-amber-200"
              >
                <PlayCircle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <span>Try Demo Experience</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

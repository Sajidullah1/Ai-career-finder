import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  PlayCircle, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { authMode, setAuthMode, setUser, setRoute, loadDemoMode, showNotification } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Student' | 'Fresh Graduate' | 'Intern' | 'Junior Developer' | 'Recruiter / Admin'>('Junior Developer');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      showNotification(`Password reset link sent to ${email}`, 'success');
      setIsForgotPassword(false);
      return;
    }

    if (authMode === 'register') {
      setUser({
        id: `user-${Date.now()}`,
        name: name || 'New Candidate',
        email,
        targetJobTitle: `${role}`,
        workType: 'Hybrid',
        experienceLevel: role === 'Student' ? 'Student' : role === 'Fresh Graduate' ? 'Fresh Graduate' : 'Junior'
      });
      showNotification(`Welcome to AI Career Finder, ${name || 'Candidate'}!`, 'success');
    } else {
      setUser({
        id: 'user-demo-logged',
        name: email.split('@')[0] || 'Candidate',
        email: email || 'candidate@example.com',
        targetJobTitle: 'Junior Developer',
        workType: 'Remote',
        experienceLevel: 'Junior'
      });
      showNotification('Logged in successfully!', 'success');
    }
    setRoute('dashboard');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-['Space_Grotesk'] text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {isForgotPassword 
              ? 'Reset Your Password'
              : authMode === 'login' 
              ? 'Sign in to Your Account' 
              : 'Create Your Free Account'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            {isForgotPassword
              ? 'Enter your email address to receive password reset instructions'
              : authMode === 'login'
              ? 'Track saved applications, view ATS scores, and update career roadmaps'
              : 'Join thousands of students and junior professionals finding matching jobs'}
          </p>
        </div>

        {/* Demo Mode Quick Access Banner */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
            <PlayCircle className="h-4 w-4 text-amber-600" />
            <span>Hackathon & Fast Evaluation Access</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-800">
            No signup needed: Instant 1-click test mode loads sample CV, job matches, and 5-week roadmap.
          </p>
          <button
            onClick={loadDemoMode}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 active:scale-95 transition"
            id="btn-demo-auth-banner"
          >
            <span>Launch Instant Demo Mode</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && !isForgotPassword && (
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] font-medium text-indigo-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {authMode === 'register' && !isForgotPassword && (
              <div>
                <label className="text-xs font-semibold text-slate-700">Primary Career Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Fresh Graduate">Fresh Graduate</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior Developer">Junior Developer</option>
                  <option value="Recruiter / Admin">Recruiter / Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98 transition"
              id="auth-submit-btn"
            >
              {isForgotPassword
                ? 'Send Reset Link'
                : authMode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-4 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            {isForgotPassword ? (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Back to Sign In
              </button>
            ) : authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Globe, 
  Github, 
  Linkedin, 
  Save, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser, analysisResult, showNotification, setRoute } = useApp();

  const [name, setName] = useState(user?.name || analysisResult?.candidate.name || 'Alex Chen');
  const [email, setEmail] = useState(user?.email || analysisResult?.candidate.contactInformation.email || 'alex.chen.dev@example.com');
  const [phone, setPhone] = useState(analysisResult?.candidate.contactInformation.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState(analysisResult?.candidate.contactInformation.location || 'San Francisco, CA');
  const [targetTitle, setTargetTitle] = useState(user?.targetJobTitle || 'Junior Full-Stack Developer');
  const [workType, setWorkType] = useState(user?.workType || 'Hybrid');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Junior');
  const [targetSalary, setTargetSalary] = useState('$85,000 - $105,000');
  const [linkedin, setLinkedin] = useState(analysisResult?.candidate.contactInformation.linkedIn || 'https://linkedin.com/in/alexchen-dev');
  const [github, setGithub] = useState(analysisResult?.candidate.contactInformation.github || 'https://github.com/alexchen-fullstack');
  const [portfolio, setPortfolio] = useState(analysisResult?.candidate.contactInformation.portfolio || 'https://alexchen.dev');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: user?.id || 'demo-candidate-1',
      name,
      email,
      targetJobTitle: targetTitle,
      workType: workType as any,
      experienceLevel: experienceLevel as any,
    });
    showNotification('Candidate profile successfully updated!', 'success');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900">
          Candidate Profile & Preferences
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          These settings directly calibrate your AI job match scoring and personalized roadmap recommendations.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Personal Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-4 w-4 text-indigo-600" />
            <span>Personal & Contact Information</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Career & Match Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Briefcase className="h-4 w-4 text-indigo-600" />
            <span>Target Career Preferences</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Target Role Title</label>
              <input
                type="text"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                placeholder="e.g. Junior Frontend Engineer"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Fresh Graduate">Fresh Graduate</option>
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Work Location Preference</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Target Salary Expectation</label>
              <input
                type="text"
                value={targetSalary}
                onChange={(e) => setTargetSalary(e.target.value)}
                placeholder="e.g. $70,000 - $90,000"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="h-4 w-4 text-indigo-600" />
            <span>Social & Portfolio Links</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Linkedin className="h-3.5 w-3.5 text-blue-600" /> LinkedIn
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Github className="h-3.5 w-3.5 text-slate-900" /> GitHub
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-indigo-600" /> Portfolio Website
              </label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

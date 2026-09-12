import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Calendar, 
  Bot, 
  Shield, 
  Award, 
  Zap,
  PlayCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setRoute, loadDemoMode } = useApp();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Next-Gen Career Intelligence for Students & Graduates</span>
              </div>

              <h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find Jobs That <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 bg-clip-text text-transparent">
                  Match Your CV
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Upload your CV and let AI analyze your skills, improve your resume, identify skill gaps, and discover relevant job opportunities with transparent matching scores.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setRoute('upload')}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-lg active:scale-98"
                  id="hero-analyze-cta"
                >
                  <span>Analyze My CV</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setRoute('jobs')}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50 active:scale-98"
                  id="hero-explore-cta"
                >
                  <Compass className="h-4 w-4 text-slate-500" />
                  <span>Explore Jobs</span>
                </button>

                <button
                  onClick={loadDemoMode}
                  className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm font-semibold text-amber-900 shadow-xs transition hover:bg-amber-100 active:scale-98"
                  id="hero-demo-cta"
                >
                  <PlayCircle className="h-4 w-4 text-amber-700" />
                  <span>Try Demo (Instant Preview)</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  PDF & DOCX Support
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  No Sign-in Required for Demo
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Official Apply Links Only
                </span>
              </div>
            </div>

            {/* Right Interactive Visual Card Illustration */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-slate-900/5">
                {/* Floating badge */}
                <div className="absolute -top-3.5 right-6 flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>94% Job Match</span>
                </div>

                {/* Simulated candidate snippet */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-lg">
                    AC
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Alex Chen</h3>
                    <p className="text-xs text-slate-500">Junior Full-Stack Developer</p>
                  </div>
                </div>

                {/* Score preview */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">ATS Readiness Score</span>
                    <span className="font-['Space_Grotesk'] text-base font-extrabold text-indigo-600">84/100</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" />
                  </div>
                </div>

                {/* Match simulation */}
                <div className="mt-4 space-y-2.5">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Apex Cloud Solutions</span>
                      <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[11px] font-bold text-indigo-800">92% Match</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      React ✓ · TypeScript ✓ · Node.js ✓ · Docker ✗
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">NovaWave Media</span>
                      <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800">86% Match</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Tailwind CSS ✓ · React ✓ · UI/UX ✓
                    </p>
                  </div>
                </div>

                {/* Skill gap teaser */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50/80 px-3 py-2 text-xs font-medium text-amber-900 border border-amber-200/60">
                  <span>Identified 2 Skill Gaps: Docker, CI/CD</span>
                  <button 
                    onClick={() => setRoute('skill-gaps')}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    View Roadmap →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 4-Step Process
            </span>
            <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-extrabold text-slate-900">
              How AI Career Finder Works
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              From raw resume to personalized job recommendations and week-by-week growth roadmaps.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:bg-white hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
                01
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Upload CV</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Upload your PDF or DOCX resume. Our system parses sections, technologies, projects, and career history.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:bg-white hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
                02
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">AI Analyzes Profile</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Gemini extracts verified candidate skills, calculates your ATS score, and diagnoses strengths and weaknesses.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:bg-white hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
                03
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Discover Matching Jobs</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                See verified job vacancies matched against your profile with transparent percentage match explanations.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:bg-white hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
                04
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Improve Your Career</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Bridge skill gaps with a tailored weekly timeline, AI resume bullet improvements, and live career coaching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Core Capabilities
            </span>
            <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-extrabold text-slate-900">
              Everything You Need to Land Your Next Role
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">AI CV Analysis</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Extracts education, skills, projects, and work history with zero hallucinations. Scores ATS readiness from 0 to 100.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Smart Job Matching</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Calculates weighted compatibility scores (40% skills, 20% education, 15% experience, 10% projects) with clear reasoning.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Skill Gap Detection</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Identifies missing technical requirements categorized by High, Medium, and Low priority for your target roles.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">CV Improvement Engine</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Generates side-by-side Before and After resume bullet rewrites to maximize recruiter scanning impact with 1-click copy.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Personalized Roadmap</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                A 5-week actionable timeline containing practical hands-on project ideas to build and verify your new skills.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Deadline Tracking</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Real date calculations flagging "3 days remaining", "Deadline today", or "Deadline not provided" without fabricated dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI Career Finder? Comparison Table */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-['Space_Grotesk'] text-3xl font-extrabold text-slate-900">
              Why AI Career Finder?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Unlike generic job search boards, we connect your actual skills directly to verified jobs and guide your improvement.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-slate-700">Capability</th>
                  <th className="px-5 py-3.5 font-bold text-slate-400">Traditional Job Boards</th>
                  <th className="px-5 py-3.5 font-bold text-indigo-700 bg-indigo-50/50">AI Career Finder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-5 py-3 font-medium text-slate-900">CV Skill Extraction</td>
                  <td className="px-5 py-3 text-slate-500">Basic keyword search</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700 bg-indigo-50/30">Semantic Gemini AI extraction</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-slate-900">Match Percentage</td>
                  <td className="px-5 py-3 text-slate-500">Vague or black-box</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700 bg-indigo-50/30">Explainable 40/20/15/10 breakdown</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-slate-900">Skill Gap Diagnosis</td>
                  <td className="px-5 py-3 text-slate-400">Not available</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700 bg-indigo-50/30">High/Med/Low priority gaps + reasons</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-slate-900">Learning Roadmap</td>
                  <td className="px-5 py-3 text-slate-400">Not available</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700 bg-indigo-50/30">Interactive 5-week project timeline</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-slate-900">Resume Improvement</td>
                  <td className="px-5 py-3 text-slate-400">None</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700 bg-indigo-50/30">Side-by-side ATS bullet rewrites</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-slate-900">Application Integrity</td>
                  <td className="px-5 py-3 text-slate-500">Cluttered redirect networks</td>
                  <td className="px-5 py-3 font-semibold text-emerald-700 bg-indigo-50/30">Official employer careers links only</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Banner CTA */}
          <div className="mt-12 rounded-3xl bg-indigo-600 px-6 py-10 text-center text-white shadow-xl sm:p-12">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold sm:text-3xl">
              Ready to Accelerate Your Career Search?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-indigo-100">
              Upload your CV now and discover the jobs you qualify for today, plus the skills to learn tomorrow.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setRoute('upload')}
                className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-indigo-700 shadow-md transition hover:bg-slate-50 active:scale-98"
              >
                Upload & Analyze My CV
              </button>
              <button
                onClick={loadDemoMode}
                className="rounded-xl border border-indigo-400 bg-indigo-700/50 px-5 py-3 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-98"
              >
                Try With Demo Profile
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

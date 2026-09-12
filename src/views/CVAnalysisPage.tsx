import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CVScoreIndicator } from '../components/CVScoreIndicator';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Compass, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award,
  Layers,
  Wand2,
  Share2
} from 'lucide-react';

export const CVAnalysisPage: React.FC = () => {
  const { analysisResult, setRoute, showNotification } = useApp();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'improvements' | 'ats' | 'profile'>('overview');

  if (!analysisResult) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Layers className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">No CV Analysis Yet</h2>
        <p className="mt-2 text-xs text-slate-500">
          Upload your CV or try our sample profile to view the AI analysis, ATS score, and matching jobs.
        </p>
        <button
          onClick={() => setRoute('upload')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <span>Upload CV</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const { candidate, cvScore, strengths, weaknesses, formatAnalysis, improvements } = analysisResult;

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    showNotification('Improved text copied to clipboard!', 'success');
    setTimeout(() => {
      setCopiedSection(null);
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Top Banner: Candidate Info & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900">
              {candidate.name}
            </h1>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
              {candidate.careerInformation.experienceLevel}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Source: {analysisResult.sourceFileName || 'Uploaded Resume'} · Analyzed on {new Date(analysisResult.analyzedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setRoute('jobs')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-98"
            id="btn-analysis-find-jobs"
          >
            <Compass className="h-4 w-4" />
            <span>Find Jobs For Me</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setRoute('roadmap')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <BookOpen className="h-4 w-4 text-slate-500" />
            <span>Learning Roadmap</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs within Analysis */}
      <div className="mt-6 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Diagnosis & Strengths
        </button>
        <button
          onClick={() => setActiveTab('improvements')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'improvements'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>Improve My CV ({improvements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'ats'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ATS & Format Analysis
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Extracted Profile Data
        </button>
      </div>

      {/* Tab 1: Overview (Score + Strengths + Weaknesses) */}
      {activeTab === 'overview' && (
        <div className="mt-6 space-y-6">
          {/* CV Score Circular Gauge */}
          <CVScoreIndicator score={cvScore} size="lg" showDetails={true} />

          {/* Strengths & Weaknesses 2-Column Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Your Strengths ({strengths.length})
                </h3>
              </div>

              <div className="mt-4 space-y-3.5">
                {strengths.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-emerald-100/80 bg-emerald-50/30 p-3.5">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                    {item.evidence && (
                      <p className="mt-2 text-[11px] font-medium text-emerald-800 bg-emerald-100/50 rounded-md px-2 py-1">
                        <strong>Evidence:</strong> {item.evidence}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Areas That Need Improvement (Weaknesses) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Areas That Need Improvement ({weaknesses.length})
                </h3>
              </div>

              <div className="mt-4 space-y-3.5">
                {weaknesses.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-amber-100/80 bg-amber-50/30 p-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-900">
                        {item.problem}
                      </h4>
                      <span className="rounded-md bg-white border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        {item.section}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600">
                      <strong className="text-slate-700">Why it matters:</strong> {item.whyItMatters}
                    </p>

                    <div className="mt-2 text-xs font-medium text-indigo-900 bg-indigo-50/60 rounded-md p-2 border border-indigo-100">
                      <strong>How to fix:</strong> {item.howToImprove}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Improve My CV (Before vs After with 1-click Copy) */}
      {activeTab === 'improvements' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl bg-indigo-50/70 p-4 border border-indigo-100 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-indigo-900">
                Truthful ATS Optimization
              </h3>
              <p className="mt-0.5 text-xs text-indigo-800">
                The AI enhances impact wording, metrics, and standard ATS keywords while strictly preserving your authentic facts and experiences.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {improvements.map((imp, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Section: {imp.section}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {imp.reason}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Current content */}
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Original in CV
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700 font-mono">
                      {imp.currentContent}
                    </p>
                  </div>

                  {/* Suggested content */}
                  <div className="relative rounded-xl bg-emerald-50/40 p-3.5 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        AI Improved (ATS Optimized)
                      </span>
                      <button
                        onClick={() => handleCopyText(imp.suggestedContent, `imp-${idx}`)}
                        className="flex items-center gap-1 rounded-md bg-white border border-emerald-300 px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 active:scale-95"
                      >
                        {copiedSection === `imp-${idx}` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-800 font-medium">
                      {imp.suggestedContent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Format & ATS Analysis */}
      {activeTab === 'ats' && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">
            CV Format & Applicant Tracking System (ATS) Diagnostic
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Automated evaluation of section headings, readability, margins, contact presence, and keyword density.
          </p>

          <div className="mt-6 divide-y divide-slate-100">
            {formatAnalysis.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.area}</h4>
                  <p className="mt-0.5 text-xs text-slate-500">{item.feedback}</p>
                </div>

                <div>
                  {item.status === 'good' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Good
                    </span>
                  )}
                  {item.status === 'needs_improvement' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5" /> Needs Improvement
                    </span>
                  )}
                  {item.status === 'critical' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                      Critical
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Extracted Profile Data */}
      {activeTab === 'profile' && (
        <div className="mt-6 space-y-6">
          {/* Skills Categorized */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Extracted Technical & Professional Skills</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Languages</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {candidate.skills.programmingLanguages?.map(s => (
                    <span key={s} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Frameworks & Libraries</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {candidate.skills.frameworks?.map(s => (
                    <span key={s} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Databases</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {candidate.skills.databases?.map(s => (
                    <span key={s} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tools & DevOps</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {candidate.skills.tools?.map(s => (
                    <span key={s} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education & Projects */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                <span>Education</span>
              </h3>
              <div className="mt-3 space-y-3">
                {candidate.education.map((edu, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-3 text-xs">
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-slate-600">{edu.university}</p>
                    <p className="mt-1 text-slate-400">
                      Graduation: {edu.graduationYear} {edu.gradeOrGpa && `· GPA: ${edu.gradeOrGpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FolderGit2 className="h-4 w-4 text-indigo-600" />
                <span>Projects</span>
              </h3>
              <div className="mt-3 space-y-3">
                {candidate.projects.map((p, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-3 text-xs">
                    <h4 className="font-bold text-slate-900">{p.projectName}</h4>
                    <p className="text-slate-600 mt-0.5">{p.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.technologies.map(t => (
                        <span key={t} className="rounded-md bg-white border border-slate-200 px-1.5 py-0.2 text-[10px] text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

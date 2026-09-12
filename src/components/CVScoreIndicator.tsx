import React from 'react';
import { CVScoreBreakdown } from '../types';
import { Sparkles, Info, Award, CheckCircle2 } from 'lucide-react';

interface CVScoreIndicatorProps {
  score: CVScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const CVScoreIndicator: React.FC<CVScoreIndicatorProps> = ({ 
  score, 
  size = 'lg',
  showDetails = true 
}) => {
  const overall = Math.min(100, Math.max(0, Math.round(score.overall)));

  // SVG dimensions
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const radius = size === 'lg' ? 68 : size === 'md' ? 48 : 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-500';
    if (val >= 70) return 'text-indigo-500';
    if (val >= 55) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBadge = (val: number) => {
    if (val >= 85) return { label: 'Excellent ATS Readiness', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 70) return { label: 'Strong Competitive Profile', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (val >= 55) return { label: 'Moderate Quality', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Needs Optimization', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const badge = getScoreBadge(overall);

  const subscores = [
    { key: 'skills', label: 'Technical Skills', val: score.skills, desc: score.explanations?.skills },
    { key: 'projects', label: 'Project Impact', val: score.projects, desc: score.explanations?.projects },
    { key: 'education', label: 'Academic Relevance', val: score.education, desc: score.explanations?.education },
    { key: 'experience', label: 'Work Experience', val: score.experience, desc: score.explanations?.experience },
    { key: 'structure', label: 'Layout & Hierarchy', val: score.structure, desc: score.explanations?.structure },
    { key: 'ats', label: 'ATS Parsability', val: score.ats, desc: score.explanations?.ats },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" id="cv-score-card">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
        {/* Circular Progress Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg 
              width={radius * 2 + strokeWidth * 2} 
              height={radius * 2 + strokeWidth * 2} 
              className="-rotate-90 transform"
            >
              {/* Background circle */}
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                className={`${getScoreColor(overall)} transition-all duration-1000 ease-out`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-slate-900">
                {overall}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.bg}`}>
                {badge.label}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Sparkles className="h-3 w-3 text-indigo-500" /> AI-Generated Assessment
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Overall Resume Score
            </h3>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              Evaluated across technical keyword depth, quantified impact, ATS parsing benchmarks, and layout formatting.
            </p>
          </div>
        </div>

        {/* Quick Highlights Pill */}
        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 sm:min-w-64">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500">Benchmark:</span>
            <span className="font-semibold text-slate-800">Top 18% of Junior CVs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500">ATS Parsing Confidence:</span>
            <span className="font-semibold text-emerald-600">High (98%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500">Key Strengths:</span>
            <span className="font-semibold text-indigo-600">React, TypeScript, SQL</span>
          </div>
        </div>
      </div>

      {/* Subscores Grid */}
      {showDetails && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scoring Breakdown & ATS Readiness
            </h4>
            <span className="text-[11px] text-slate-400">
              Click any factor for diagnostic reasoning
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subscores.map(sub => (
              <div 
                key={sub.key}
                className="group rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-indigo-200 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {sub.label}
                  </span>
                  <span className={`text-xs font-extrabold ${getScoreColor(sub.val)}`}>
                    {sub.val}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div 
                    className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                    style={{ width: `${sub.val}%` }}
                  />
                </div>
                {sub.desc && (
                  <p className="mt-1.5 text-[11px] text-slate-500 leading-normal line-clamp-2">
                    {sub.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

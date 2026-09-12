import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Check, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Layers, 
  BookOpen, 
  Flame
} from 'lucide-react';

export const SkillGapsPage: React.FC = () => {
  const { skillGaps, addSkillToRoadmap, roadmap, setRoute, analysisResult } = useApp();

  const getPriorityBadge = (priority: string) => {
    if (priority === 'High') {
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'High Priority (Blocks Many Roles)'
      };
    }
    if (priority === 'Medium') {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Medium Priority (Frequently Preferred)'
      };
    }
    return {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Low Priority (Nice to Have)'
    };
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Beginner') return 'text-emerald-600 bg-emerald-50';
    if (diff === 'Intermediate') return 'text-indigo-600 bg-indigo-50';
    return 'text-purple-600 bg-purple-50';
  };

  // Check if a skill is already present in any week of the roadmap
  const isSkillInRoadmap = (skillName: string) => {
    return roadmap.some(w => 
      w.skillsToLearn.some(s => s.toLowerCase() === skillName.toLowerCase())
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-slate-900">
              Skill Gap Diagnosis
            </h1>
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
              {skillGaps.length} Gaps Detected
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Identified by comparing your CV against real requirements from active job openings.
          </p>
        </div>

        <button
          onClick={() => setRoute('roadmap')}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-98"
        >
          <BookOpen className="h-4 w-4" />
          <span>View Learning Roadmap</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Info Callout */}
      <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white p-4 text-xs text-indigo-950 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold">Prioritize High Impact Gaps</h3>
          <p className="mt-0.5 text-indigo-900">
            Acquiring the 2 high-priority skills below will increase your eligibility across 68% of the junior developer jobs in our directory. Click "Add to Roadmap" to track project tutorials.
          </p>
        </div>
      </div>

      {/* Skill Gaps List */}
      <div className="mt-6 space-y-4">
        {skillGaps.map(gap => {
          const priorityInfo = getPriorityBadge(gap.priority);
          const inRoadmap = isSkillInRoadmap(gap.skill);

          return (
            <div
              key={gap.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-200 hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${priorityInfo.badge}`}>
                      <span className={`h-2 w-2 rounded-full ${priorityInfo.dot}`} />
                      {priorityInfo.label}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {gap.category}
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${getDifficultyColor(gap.difficulty)}`}>
                      {gap.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-bold text-slate-900 flex items-center gap-2">
                    {gap.skill}
                    {gap.frequency && (
                      <span className="text-xs font-normal text-slate-500">
                        (Required by {gap.frequency} active postings)
                      </span>
                    )}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    <strong className="text-slate-700">Why it matters:</strong> {gap.whyItMatters}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Estimated time: <strong className="text-slate-700">{gap.estimatedTime}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                      Impact on matches: <strong className="text-emerald-600">+10% to +18%</strong>
                    </span>
                  </div>
                </div>

                {/* Add to Roadmap action */}
                <div className="sm:text-right shrink-0">
                  <button
                    onClick={() => addSkillToRoadmap(gap.skill)}
                    disabled={inRoadmap}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                      inRoadmap
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                    }`}
                  >
                    {inRoadmap ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>In Your Roadmap</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add to Roadmap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

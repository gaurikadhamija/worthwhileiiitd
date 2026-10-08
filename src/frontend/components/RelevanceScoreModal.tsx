import React from 'react';
import { X, Sparkles, Target, Compass, Briefcase, GraduationCap, MapPin, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { EventItem } from '../types/index.js';
import { useApp } from '../context/AppContext.js';

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

export const RelevanceScoreModal: React.FC<Props> = ({ event, onClose }) => {
  const { setIsGoalsModalOpen } = useApp();

  if (!event) return null;

  const rel = event.relevance;

  const factors = [
    { label: 'Interest & Goal Fit', weight: '25%', value: rel.goalFit, icon: Target, desc: 'Direct alignment with your selected semester priorities.' },
    { label: 'Technical & Domain Fit', weight: '15%', value: rel.interestFit, icon: Compass, desc: 'Matches your CS, AI & venture engineering interests.' },
    { label: 'Career Value', weight: '15%', value: rel.careerValue, icon: Briefcase, desc: 'Recruiter access, mock interview depth, and resume leverage.' },
    { label: 'Learning Value', weight: '15%', value: rel.learningValue, icon: GraduationCap, desc: 'Zero-boilerplate hands-on code and tangible takeaway repository.' },
    { label: 'Proximity & Convenience', weight: '10%', value: rel.convenience, icon: MapPin, desc: 'Walking distance from your primary campus residence / quad.' },
    { label: 'Community Feedback', weight: '10%', value: rel.communityScore, icon: Users, desc: 'Ratings from verified past attendees in your department.' },
    { label: 'Organizer Trust Rating', weight: '10%', value: rel.organizerTrust, icon: ShieldCheck, desc: 'Verified track record of starting on time and fulfilling claims.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF4EB] rounded-2xl border border-[#D8C5AE] shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5A3828] hover:bg-[#F4EBDD] transition-colors"
          aria-label="Close score breakdown"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#6B1E23] mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Explainable Relevance Engine</span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#2A1B16] leading-tight">
          Why this event scored {rel.totalScore}/100 for you
        </h2>
        <p className="text-sm text-[#5A3828] mt-1">
          {event.title}
        </p>

        {/* Narrative Box */}
        <div className="mt-5 p-4 rounded-xl bg-[#F4EBDD]/60 border border-[#E8DCC8]">
          <p className="text-sm text-[#2A1B16] leading-relaxed">
            {rel.explanation}
          </p>

          {rel.topMatchingFactors && rel.topMatchingFactors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E8DCC8]/70">
              <span className="text-xs font-semibold text-[#6B1E23] uppercase tracking-wider block mb-1.5">
                Top Deciding Factors:
              </span>
              <ul className="space-y-1 text-xs text-[#5A3828]">
                {rel.topMatchingFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#6B1E23] font-bold">✓</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Factor Breakdown Bars */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#2A1B16] uppercase tracking-wider">
            Weighted Score Breakdown
          </h3>

          <div className="space-y-3">
            {factors.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-3 rounded-lg border border-[#F4EBDD] bg-[#FFFDF8] hover:bg-[#F4EBDD]/30 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2 font-medium text-[#2A1B16]">
                      <Icon className="w-3.5 h-3.5 text-[#6B1E23]" />
                      <span>{item.label}</span>
                      <span className="text-[#5A3828]/60 text-[11px]">({item.weight})</span>
                    </div>
                    <span className="font-bold tabular-nums text-[#2C0F12]">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E8DCC8]/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2C0F12] to-[#6B1E23] rounded-full transition-all duration-700"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#5A3828]/80 mt-1">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Goals CTA */}
        <div className="mt-6 pt-5 border-t border-[#E8DCC8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5A3828]">
            Scores recalibrate automatically as you adjust your goals.
          </p>
          <button
            onClick={() => {
              onClose();
              setIsGoalsModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C0F12] text-[#FFFDF8] hover:bg-[#6B1E23] transition-colors"
          >
            <span>Update Semester Goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

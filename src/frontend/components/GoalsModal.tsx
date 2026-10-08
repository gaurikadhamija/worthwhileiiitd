import React, { useState } from 'react';
import { X, Check, Sparkles, Target, Compass, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

const GOAL_OPTIONS = [
  'Get an internship',
  'Build my resume',
  'Learn technical skills',
  'Meet people',
  'Build projects',
  'Win competitions',
  'Explore careers',
  'Explore creative interests',
  'Just have fun 😭'
];

const INTEREST_OPTIONS = [
  'Artificial Intelligence',
  'Full-Stack Development',
  'Venture Capital',
  'Cloud Architecture',
  'Robotics',
  'UI/UX Design',
  'Quantitative Finance',
  'Cybersecurity',
  'Product Management'
];

export const GoalsModal: React.FC = () => {
  const { isGoalsModalOpen, setIsGoalsModalOpen, profile, updateSemesterGoals } = useApp();

  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile?.goals || ['Get an internship', 'Learn technical skills', 'Build projects']
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.interests || ['Artificial Intelligence', 'Full-Stack Development', 'Venture Capital']
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isGoalsModalOpen) return null;

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSemesterGoals(
        selectedGoals,
        selectedInterests,
        profile?.career_interests || ['Software Engineer', 'AI Researcher']
      );
      setIsGoalsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FAF4EB] rounded-2xl border border-[#D8C5AE] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsGoalsModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5A3828] hover:bg-[#F4EBDD] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#6B1E23] mb-2">
          <Target className="w-4 h-4" />
          <span>Personalization Engine</span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#2A1B16] leading-tight">
          What are you trying to achieve this semester?
        </h2>
        <p className="text-sm text-[#5A3828] mt-1">
          WorthWhile scores every campus event against your personal priorities. Select all that matter right now.
        </p>

        {/* Goals Selection */}
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#2A1B16] block mb-2.5">
            Primary Semester Goals
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GOAL_OPTIONS.map(goal => {
              const active = selectedGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    active
                      ? 'border-[#6B1E23] bg-[#2C0F12] text-[#FFFDF8] shadow-sm'
                      : 'border-[#E8DCC8] bg-[#FFFDF8] text-[#2A1B16] hover:border-[#6B1E23]/40 hover:bg-[#F4EBDD]/40'
                  }`}
                >
                  <span>{goal}</span>
                  {active && <Check className="w-4 h-4 text-[#FFFDF8] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Selection */}
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#2A1B16] block mb-2.5">
            Technical & Domain Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(interest => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    active
                      ? 'border-[#6B1E23] bg-[#6B1E23] text-[#FFFDF8]'
                      : 'border-[#E8DCC8] bg-[#FFFDF8] text-[#5A3828] hover:border-[#6B1E23]/40 hover:bg-[#F4EBDD]/40'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Student Context */}
        <div className="mt-6 p-3 rounded-xl bg-[#F4EBDD]/70 border border-[#E8DCC8] text-xs text-[#5A3828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6B1E23]" />
            <span>Profile: <strong>{profile?.degree || 'B.S.'} in {profile?.major || 'Computer Science'}</strong> ({profile?.year_of_study || 'Junior'})</span>
          </div>
          <span className="text-[11px] text-[#6B1E23] font-semibold">{profile?.campus_location || 'North Quad'}</span>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-5 border-t border-[#E8DCC8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsGoalsModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-[#5A3828] hover:text-[#2A1B16] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving || selectedGoals.length === 0}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2C0F12] text-[#FFFDF8] text-xs font-semibold hover:bg-[#6B1E23] disabled:opacity-50 transition-colors shadow-sm"
          >
            {isSaving ? 'Recalibrating Scores...' : 'Save & Recalibrate Platform'}
          </button>
        </div>
      </div>
    </div>
  );
};

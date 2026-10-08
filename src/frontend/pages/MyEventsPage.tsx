import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calendar, Clock, Bookmark, CheckCircle2, Star, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { EventItem } from '../types/index.js';
import { EventCard } from '../components/EventCard.js';

export const MyEventsPage: React.FC = () => {
  const { navigateTo, setIsGoalsModalOpen, setReviewModalEvent } = useApp();

  const [activeTab, setActiveTab] = useState<'portfolio' | 'saved' | 'upcoming' | 'attended'>('portfolio');
  const [activity, setActivity] = useState<any | null>(null);
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [actData, savedData] = await Promise.all([
          api.getUserActivity(),
          api.getSavedEvents()
        ]);
        setActivity(actData);
        setSavedEvents(savedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = activity?.stats || {
    eventsAttended: 8,
    skillsExplored: 6,
    certificatesEarned: 3,
    networkingEvents: 4,
    reviewsContributed: 2,
    verifiedHoursLogged: 16.5
  };

  return (
    <div className="min-dynamic-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8DCC8] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B1E23]/10 text-[#6B1E23] text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student Co-Curricular Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1B16]">
              My Events & Portfolio
            </h1>
            <p className="text-sm text-[#5A3828] mt-1">
              Your verified record of campus participation, technical skill gain, and credentials.
            </p>
          </div>

          <button
            onClick={() => setIsGoalsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#2C0F12] text-[#FFFDF8] hover:bg-[#6B1E23] transition-colors self-start sm:self-auto"
          >
            Edit Semester Goals
          </button>
        </div>

        {/* ----------------- ACTIVITY PORTFOLIO SCORECARD ----------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] text-center shadow-xs">
            <span className="text-2xl font-serif font-bold text-[#2C0F12] block">
              {stats.eventsAttended}
            </span>
            <span className="text-[11px] font-medium text-[#5A3828] uppercase tracking-wider">
              Sessions Attended
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#D8C5AE] text-center shadow-sm">
            <span className="text-2xl font-serif font-bold text-[#6B1E23] block">
              {stats.skillsExplored}
            </span>
            <span className="text-[11px] font-medium text-[#5A3828] uppercase tracking-wider">
              Skills Explored
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#D8C5AE] text-center shadow-sm">
            <span className="text-2xl font-serif font-bold text-[#1E4D38] block">
              {stats.certificatesEarned}
            </span>
            <span className="text-[11px] font-medium text-[#5A3828] uppercase tracking-wider">
              Certificates
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#D8C5AE] text-center shadow-sm">
            <span className="text-2xl font-serif font-bold text-[#241510] block">
              {stats.networkingEvents}
            </span>
            <span className="text-[11px] font-medium text-[#5A3828] uppercase tracking-wider">
              Mixers & Fairs
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#D8C5AE] text-center shadow-sm">
            <span className="text-2xl font-serif font-bold text-[#854D0E] block">
              {stats.reviewsContributed}
            </span>
            <span className="text-[11px] font-medium text-[#5A3828] uppercase tracking-wider">
              Reviews Contributed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#D8C5AE] text-center shadow-sm">
            <span className="text-2xl font-serif font-bold text-[#241510] block">
              {stats.verifiedHoursLogged}h
            </span>
            <span className="text-[11px] font-medium text-[#5A3828] uppercase tracking-wider">
              Verified Hours
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-[#D8C5AE] pb-1 overflow-x-auto">
          {[
            { id: 'portfolio', label: 'Activity Portfolio' },
            { id: 'saved', label: `Saved (${savedEvents.length})` },
            { id: 'upcoming', label: `Upcoming Registrations (${activity?.upcomingEvents?.length || 1})` },
            { id: 'attended', label: `Attended History (${activity?.attendedEvents?.length || 1})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-1 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#6B1E23] text-[#6B1E23] bg-[#FAF4EB] rounded-t-xl'
                  : 'border-transparent text-[#5A3828] hover:text-[#241510]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Activity Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            {/* Skills Explored Matrix */}
            <div className="bg-[#FAF4EB] border border-[#D8C5AE] rounded-2xl p-6 shadow-md">
              <h3 className="text-base font-serif font-bold text-[#2A1B16] mb-3">
                Verified Skill Takeaways Logged
              </h3>
              <p className="text-xs text-[#5A3828] mb-4">
                These technical competencies were validated through workshop attendance records.
              </p>
              <div className="flex flex-wrap gap-2">
                {activity?.skillsExploredList?.map((skill: string) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4EBDD] border border-[#E8DCC8] text-xs font-medium text-[#2A1B16]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick prompt for pending review */}
            <div className="bg-[#6B1E23]/10 border border-[#6B1E23]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B1E23]">
                  Review Pending
                </span>
                <h4 className="font-serif font-bold text-lg text-[#2A1B16] mt-0.5">
                  Founders & Angel Pitch Mixer
                </h4>
                <p className="text-xs text-[#5A3828] mt-1">
                  You checked in on Oct 1. Help future students verify whether angel investors were accessible.
                </p>
              </div>
              <button
                onClick={() => navigateTo('event-details', 'evt_startup_pitch_mixer')}
                className="px-5 py-2.5 rounded-xl bg-[#2C0F12] text-[#FFFDF8] text-xs font-semibold hover:bg-[#6B1E23] transition-colors whitespace-nowrap"
              >
                Submit 30-Sec Review
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Bookmarks */}
        {activeTab === 'saved' && (
          <div>
            {savedEvents.length === 0 ? (
              <div className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-12 text-center text-xs text-[#5A3828]">
                You haven't saved any events yet. Click the bookmark icon on any card to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {savedEvents.map(ev => (
                  <EventCard key={`saved_${ev.id}`} event={ev} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Upcoming Registrations */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <div className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#6B1E23] uppercase tracking-wider">
                    Confirmed Registration
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#2A1B16] mt-1">
                    Building Production LLM Agents with Gemini & LangGraph
                  </h3>
                  <p className="text-xs text-[#5A3828] mt-1">
                    Tomorrow at 3:15 PM · Alan Turing Auditorium (Gates CS Building)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-md bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs font-semibold">
                  RSVP Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Attended History */}
        {activeTab === 'attended' && (
          <div className="space-y-4">
            <div className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5A3828] uppercase tracking-wider">
                    Attended & Checked In
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#2A1B16] mt-1">
                    Founders & Angel Pitch Mixer
                  </h3>
                  <p className="text-xs text-[#5A3828] mt-1">
                    The Foundry Incubator · Verified check-in by ACM QR scanner
                  </p>
                </div>
                <span className="px-3 py-1 rounded-md bg-[#F4EBDD] text-[#5A3828] text-xs font-semibold">
                  Completed
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, AlertTriangle, TrendingUp, Star, ShieldCheck,
  Plus, Calendar, MapPin, X, ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';

export const OrganizerDashboardPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating a new event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Workshops');
  const [newEventTagline, setNewEventTagline] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState(100);
  const [newEventCert, setNewEventCert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getOrganizerDashboard('org_acm');
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createEvent({
        title: newEventTitle,
        category: newEventCategory,
        tagline: newEventTagline,
        max_capacity: newEventCapacity,
        certificate_offered: newEventCert,
        organizer_id: 'org_acm',
        venue_id: 'ven_turing_aud',
        start_time: new Date(Date.now() + 86400000).toISOString(),
        end_time: new Date(Date.now() + 93600000).toISOString(),
        cost_cents: 0,
        is_free: true,
        cover_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        networking_potential: 'High',
        career_value_rating: 90,
        learning_value_rating: 92,
        tags: ['New Event', 'Hands-on', 'Tech'],
        skills_taught: ['AI APIs', 'Autonomous Agents']
      });

      setIsCreateModalOpen(false);
      setNewEventTitle('');
      setNewEventTagline('');
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-dynamic-h-screen bg-transparent py-16 px-4">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#D8C5AE]/50 rounded" />
          <div className="grid grid-cols-4 gap-4 h-32 bg-[#D8C5AE]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  const cards = dashboardData?.summaryCards || {};
  const org = dashboardData?.organizer || {};

  return (
    <div className="min-dynamic-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8DCC8] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B1E23]/10 text-[#6B1E23] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Organizer Verified Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1B16]">
              {org.name || 'ACM Student Chapter'}
            </h1>
            <p className="text-sm text-[#5A3828] mt-1">
              Trust Score: <strong className="text-[#6B1E23]">{org.trust_score}%</strong> · Punctuality Rating: <strong>{org.avg_punctuality_rating} / 5.0</strong>
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2C0F12] text-[#FFFDF8] text-xs font-semibold hover:bg-[#6B1E23] transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>
        </div>

        {/* ----------------- TOP METRIC CARDS ----------------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] shadow-xs">
            <span className="text-[11px] font-semibold text-[#5A3828] uppercase tracking-wider block mb-1">
              Total RSVPs
            </span>
            <div className="text-2xl font-serif font-bold text-[#2A1B16]">
              {cards.totalRegistrations}
            </div>
            <span className="text-[11px] text-[#2D6A4F] font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>{cards.attendanceRatePct}% actual turnout</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] shadow-xs">
            <span className="text-[11px] font-semibold text-[#5A3828] uppercase tracking-wider block mb-1">
              Student Rating
            </span>
            <div className="text-2xl font-serif font-bold text-[#6B1E23]">
              ★ {cards.averageRating}
            </div>
            <span className="text-[11px] text-[#5A3828] mt-1 block">
              Content: {cards.contentScore} · Net: {cards.networkingScore}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] shadow-xs">
            <span className="text-[11px] font-semibold text-[#5A3828] uppercase tracking-wider block mb-1">
              Claim Truth Health
            </span>
            <div className="text-2xl font-serif font-bold text-[#2D6A4F]">
              {cards.claimVerificationHealthPct}%
            </div>
            <span className="text-[11px] text-[#2D6A4F] font-semibold mt-1 block">
              Verified by attendees
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] shadow-xs">
            <span className="text-[11px] font-semibold text-[#5A3828] uppercase tracking-wider block mb-1">
              Active Catalog
            </span>
            <div className="text-2xl font-serif font-bold text-[#2A1B16]">
              {cards.activeEventsCount} Sessions
            </div>
            <span className="text-[11px] text-[#5A3828] mt-1 block">
              Turing Hall & Foundry Hub
            </span>
          </div>
        </div>

        {/* ----------------- TWO COLUMNS: STUDENTS LOVED vs DISLIKED ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Students Loved */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D6A4F] flex items-center gap-1.5 mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Students Loved Most</span>
            </h3>

            <div className="space-y-3">
              {dashboardData?.studentsLoved?.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-[#2D6A4F]/5 border border-[#2D6A4F]/20 text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#2A1B16]">
                    <span>{item.topic}</span>
                    <span className="text-[#2D6A4F]">{item.votes} votes</span>
                  </div>
                  <p className="text-[11px] text-[#5A3828] italic mt-1">
                    "{item.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Students Disliked / Friction Points */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#B9770E] flex items-center gap-1.5 mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Student Friction & Logistical Feedback</span>
            </h3>

            <div className="space-y-3">
              {dashboardData?.studentsDisliked?.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-[#B9770E]/5 border border-[#B9770E]/20 text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#2A1B16]">
                    <span>{item.topic}</span>
                    <span className="text-[10px] uppercase font-bold text-[#B9770E] bg-[#B9770E]/10 px-1.5 py-0.5 rounded">
                      {item.severity} priority
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A3828] mt-1">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ----------------- CLAIMS WITH WEAK EVIDENCE ALERT ----------------- */}
        {dashboardData?.weakEvidenceClaims && dashboardData.weakEvidenceClaims.length > 0 && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFDF8] border border-[#9A1B28]/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A1B28] mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Claims With Weak Student Evidence</span>
            </div>
            <p className="text-xs text-[#5A3828] mb-4">
              Our audit system flagged these promotional statements because attendee survey confirmation fell below 80%.
            </p>

            <div className="space-y-3">
              {dashboardData.weakEvidenceClaims.map((wc: any) => (
                <div key={wc.id} className="p-3.5 rounded-xl bg-[#9A1B28]/5 border border-[#9A1B28]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-[#2A1B16] block">
                      "{wc.claimText}"
                    </span>
                    <span className="text-[11px] text-[#5A3828]">
                      On: <strong>{wc.eventTitle}</strong> · Evidence: {wc.score}% ({wc.sampleSize} students surveyed)
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-[#9A1B28] bg-white px-3 py-1 rounded-md border border-[#9A1B28]/30 shrink-0">
                    {wc.recommendation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- PUBLISHED EVENTS TABLE ----------------- */}
        <div className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#2A1B16] mb-4">
            Managed Sessions & Live Attendance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCC8] text-[#5A3828]">
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Event Title</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">RSVPs</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Attended</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Capacity</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EBDD]">
                {dashboardData?.recentEvents?.map((ev: any) => (
                  <tr key={ev.id} className="hover:bg-[#F4EBDD]/20">
                    <td className="py-3 font-medium text-[#2A1B16] max-w-xs truncate">
                      {ev.title}
                    </td>
                    <td className="py-3 text-[#5A3828]">{ev.category}</td>
                    <td className="py-3 font-semibold text-[#2A1B16]">{ev.registered}</td>
                    <td className="py-3 text-[#2D6A4F] font-semibold">{ev.attended}</td>
                    <td className="py-3 text-[#5A3828]">{ev.capacity}</td>
                    <td className="py-3">
                      <button
                        onClick={() => navigateTo('event-details', ev.id)}
                        className="text-[#6B1E23] hover:underline font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE EVENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#FFFDF8] rounded-2xl border border-[#E8DCC8] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#5A3828] hover:bg-[#F4EBDD]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-serif font-bold text-[#2A1B16]">
              Publish Campus Event
            </h2>
            <p className="text-xs text-[#5A3828] mt-1">
              Events are scored through our relevance engine and verified against attendee audits.
            </p>

            <form onSubmit={handleCreateEvent} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#2A1B16] block mb-1 uppercase tracking-wider text-[11px]">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus in Raft: Live Lab"
                  className="w-full rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/40 p-3 text-xs focus:outline-none focus:border-[#6B1E23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#2A1B16] block mb-1 uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={e => setNewEventCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/40 p-3 text-xs focus:outline-none focus:border-[#6B1E23]"
                  >
                    <option value="Workshops">Workshops</option>
                    <option value="Career Events">Career Events</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Networking">Networking</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#2A1B16] block mb-1 uppercase tracking-wider text-[11px]">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newEventCapacity}
                    onChange={e => setNewEventCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/40 p-3 text-xs focus:outline-none focus:border-[#6B1E23]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#2A1B16] block mb-1 uppercase tracking-wider text-[11px]">
                  Tagline & Focus
                </label>
                <input
                  type="text"
                  required
                  value={newEventTagline}
                  onChange={e => setNewEventTagline(e.target.value)}
                  placeholder="e.g. Hands-on coding session in Turing Auditorium"
                  className="w-full rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/40 p-3 text-xs focus:outline-none focus:border-[#6B1E23]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="certCheck"
                  checked={newEventCert}
                  onChange={e => setNewEventCert(e.target.checked)}
                  className="rounded text-[#6B1E23] focus:ring-[#6B1E23]"
                />
                <label htmlFor="certCheck" className="text-xs text-[#2A1B16] font-medium">
                  Official Completion Certificate Provided (Will be audited by students)
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DCC8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#5A3828]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2C0F12] text-white text-xs font-semibold hover:bg-[#6B1E23] transition-colors"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to Campus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

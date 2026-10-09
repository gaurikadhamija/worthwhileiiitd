import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, AlertTriangle, CheckCircle, Trophy, ArrowRight, X, Plus } from 'lucide-react';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { RelevanceScoreRing } from '../components/RelevanceScoreRing.js';
import { getCategoryTheme } from '../utils/categoryColors.js';

export const ComparePage: React.FC = () => {
  const { compareEventIds, removeFromCompare, navigateTo } = useApp();

  const [priority, setPriority] = useState<'career' | 'learning' | 'networking' | 'convenience' | 'fun'>('career');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComparison = async () => {
      if (compareEventIds.length === 0) {
        setData(null);
        return;
      }
      setLoading(true);
      try {
        const res = await api.compareEvents(compareEventIds, priority);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [compareEventIds, priority]);

  if (compareEventIds.length === 0) {
    return (
      <div className="min-dynamic-h-screen bg-transparent py-16 px-4 text-center">
        <div className="mx-auto max-w-md bg-[#FBF3E4] border border-[#EADCC4] rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-extrabold text-[#1E1410]">
            No Events in Compare Tray
          </h2>
          <p className="text-sm text-[#6B5A4E] mt-2 leading-relaxed">
            Browse the catalog and click "Compare" on any 2 to 4 campus events to evaluate conflicting schedules, skill deliverables, and trade-offs side by side.
          </p>
          <button
            onClick={() => navigateTo('discover')}
            className="mt-6 px-8 py-3.5 rounded-full bg-[#3E2723] hover:bg-[#A9805E] text-[#FBF3E4] text-xs font-bold transition-all shadow-md"
          >
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  const events = data?.events || [];
  const conflicts = data?.scheduleConflicts || [];
  const recommendedChoice = data?.recommendedChoice;

  return (
    <div className="min-dynamic-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EADCC4] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EADCC4] text-[#3E2723] text-xs font-bold uppercase tracking-wider mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#A9805E]" />
              <span>Multi-Factor Trade-off Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1410] tracking-tight">
              Side-by-Side Comparison
            </h1>
            <p className="text-sm text-[#6B5A4E] mt-1 font-medium">
              Evaluating {events.length} events against your semester priorities and schedule availability.
            </p>
          </div>

          <button
            onClick={() => navigateTo('discover')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#EADCC4] bg-[#FBF3E4] hover:bg-[#EADCC4] text-xs font-bold text-[#1E1410] transition-colors self-start md:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#A9805E]" />
            <span>Add Another Event</span>
          </button>
        </div>

        {/* Schedule Conflict Banner */}
        {conflicts.length > 0 && (
          <div className="mb-8 p-4 rounded-3xl bg-[#9A1B28]/10 border border-[#9A1B28]/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#9A1B28] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#9A1B28]">
                Schedule Conflict Detected
              </h4>
              {conflicts.map((c: any, i: number) => (
                <p key={i} className="text-xs text-[#1E1410] mt-0.5">
                  <strong>{c.eventATitle}</strong> and <strong>{c.eventBTitle}</strong> overlap by <strong>{c.overlapMinutes} minutes</strong>. You cannot attend both in full.
                </p>
              ))}
            </div>
          </div>
        )}

        {/* "Which Should I Choose?" Decision Card */}
        {recommendedChoice && (
          <div className="mb-8 rounded-3xl bg-[#FBF3E4] border border-[#EADCC4] p-6 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#3E2723] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Trophy className="w-5 h-5 text-[#C8963E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A9805E]">
                      Recommended Choice
                    </span>
                    <span className="text-[10px] bg-[#EADCC4] text-[#3E2723] px-2.5 py-0.5 rounded-full font-bold">
                      {recommendedChoice.winMargin}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1E1410] mt-0.5 font-sans">
                    {recommendedChoice.eventTitle}
                  </h3>
                  <p className="text-xs text-[#6B5A4E] mt-1 max-w-2xl leading-relaxed">
                    {recommendedChoice.reason}
                  </p>
                </div>
              </div>

              {/* Priority Selector Tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-xs font-bold text-[#6B5A4E]">My Priority:</span>
                <div className="flex flex-wrap items-center gap-1 bg-[#F3E9D8] p-1 rounded-full border border-[#EADCC4]">
                  {(['career', 'learning', 'networking', 'convenience', 'fun'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full capitalize transition-colors ${
                        priority === p
                          ? 'bg-[#3E2723] text-[#FBF3E4] shadow-xs'
                          : 'text-[#6B5A4E] hover:text-[#1E1410]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side Specs Matrix Table (Horizontally scrollable on mobile) */}
        <div className="bg-[#FBF3E4] border border-[#EADCC4] rounded-3xl shadow-md overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EADCC4] bg-[#EADCC4]/40">
                <th className="p-4 sm:p-5 font-bold text-[#6B5A4E] uppercase tracking-wider text-[11px] min-w-[160px]">
                  Comparison Metric
                </th>
                {events.map((ev: any) => {
                  const catTheme = getCategoryTheme(ev.category);
                  return (
                    <th key={ev.id} className="p-4 sm:p-5 min-w-[260px] align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${catTheme.pillBg} ${catTheme.pillText} border ${catTheme.pillBorder}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catTheme.dotColor }} />
                            <span>{ev.category}</span>
                          </span>
                          <h4 className="font-bold text-base text-[#1E1410] mt-1 line-clamp-2 font-sans">
                            {ev.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCompare(ev.id)}
                          className="p-1 rounded-full text-[#6B5A4E] hover:bg-[#EADCC4] transition-colors"
                          title="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADCC4]">
              {/* Relevance Score */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Relevance Score</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <RelevanceScoreRing score={ev.relevance.totalScore} size="sm" />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Date & Time */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Schedule & Time</td>
                {events.map((ev: any) => {
                  const s = new Date(ev.start_time);
                  return (
                    <td key={ev.id} className="p-4 sm:p-5 text-[#6B5A4E]">
                      <div className="font-bold text-[#1E1410]">
                        {s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div>
                        {s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Location & Walking Distance */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Venue & Zone</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5 text-[#6B5A4E]">
                    <div className="font-bold text-[#1E1410]">{ev.venue?.name}</div>
                    <div className="text-[11px] text-[#6B5A4E]">{ev.venue?.campus_zone}</div>
                  </td>
                ))}
              </tr>

              {/* Cost */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Admission Cost</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5 font-bold text-[#1E1410]">
                    {ev.is_free ? 'Free' : `$${(ev.cost_cents/100).toFixed(2)}`}
                  </td>
                ))}
              </tr>

              {/* Certificate */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Verified Certificate</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5">
                    {ev.certificate_offered ? (
                      <span className="text-[#1E4D38] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Included</span>
                      </span>
                    ) : (
                      <span className="text-[#6B5A4E]/60">None</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Career Value */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Career Value Rating</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5 font-bold tabular-nums text-[#3E2723]">
                    {ev.career_value_rating} / 100
                  </td>
                ))}
              </tr>

              {/* Learning Value */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Learning Value Rating</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5 font-bold tabular-nums text-[#3E2723]">
                    {ev.learning_value_rating} / 100
                  </td>
                ))}
              </tr>

              {/* Networking Potential */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Networking Level</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5 font-bold text-[#A9805E]">
                    {ev.networking_potential}
                  </td>
                ))}
              </tr>

              {/* Organizer Trust */}
              <tr className="hover:bg-[#EADCC4]/20">
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Organizer Trust</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5 text-[#6B5A4E]">
                    <span className="font-bold text-[#1E1410]">
                      {ev.organizer?.name}
                    </span>
                    <span className="ml-1 text-[11px] text-[#A9805E] font-bold">
                      ({Math.round(ev.organizer?.trust_score || 88)}%)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Actions row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#1E1410]">Action</td>
                {events.map((ev: any) => (
                  <td key={ev.id} className="p-4 sm:p-5">
                    <button
                      onClick={() => navigateTo('event-details', ev.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#3E2723] text-[#FBF3E4] text-xs font-bold hover:bg-[#A9805E] transition-all shadow-sm"
                    >
                      <span>Select Event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Award, Users, ShieldCheck, Bookmark,
  CheckCircle2, AlertTriangle, ArrowLeft, Share2, Sparkles, Brain, Briefcase, FolderGit2, Navigation
} from 'lucide-react';
import { EventItem } from '../types/index.js';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { RelevanceScoreRing } from '../components/RelevanceScoreRing.js';
import { ClaimVerificationBadge } from '../components/ClaimVerificationBadge.js';
import { DelhiGoogleMap } from '../components/DelhiGoogleMap.js';
import { getCategoryTheme } from '../utils/categoryColors.js';

interface Props {
  eventId: string;
}

export const EventDetailsPage: React.FC<Props> = ({ eventId }) => {
  const {
    navigateTo,
    savedEventIds,
    toggleSave,
    registeredEventIds,
    registerForEvent,
    setScoreModalEvent,
    setReviewModalEvent
  } = useApp();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await api.getEventById(eventId);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-dynamic-h-screen bg-transparent py-16 px-4">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-8 w-40 bg-[#D8C5AE]/50 rounded" />
          <div className="h-72 bg-[#D8C5AE]/30 rounded-2xl" />
          <div className="h-24 bg-[#D8C5AE]/30 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-dynamic-h-screen bg-transparent py-16 px-4 text-center">
        <div className="mx-auto max-w-md bg-[#FAF4EB] border border-[#D8C5AE] rounded-2xl p-8 shadow-xl">
          <h2 className="font-serif text-2xl font-bold text-[#2A1B16]">Event Not Found</h2>
          <p className="text-xs text-[#5A3828] mt-2">{error || 'This session might have expired.'}</p>
          <button
            onClick={() => navigateTo('discover')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#2C0F12] text-[#FFFDF8] text-xs font-semibold"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const isSaved = savedEventIds.has(event.id);
  const isRegistered = registeredEventIds.has(event.id) || justRegistered;

  const startDate = new Date(event.start_time);
  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await registerForEvent(event.id);
      setJustRegistered(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  const insights = event.community_insights;
  const analytics = event.analytics;

  return (
    <div className="min-dynamic-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('discover')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A3828] hover:text-[#2A1B16] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discover</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSave(event.id)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-[#6B1E23] text-white border-[#6B1E23]'
                  : 'bg-[#FFFDF8] text-[#2A1B16] border-[#E8DCC8] hover:bg-[#F4EBDD]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-[#FAF4EB] border border-[#D8C5AE] rounded-3xl overflow-hidden shadow-lg mb-10">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#2C0F12]">
            <img
              src={event.cover_image}
              alt={event.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className={`absolute top-4 left-4 ${getCategoryTheme(event.category).imageTagBg} backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-white/20 flex items-center gap-1.5`}>
              <span className="w-2 h-2 rounded-full bg-white inline-block" />
              <span>{event.category}</span>
            </div>

            {/* Relevance Score Pill on Banner */}
            <div
              onClick={() => setScoreModalEvent(event)}
              className="absolute top-4 right-4 bg-[#FFFDF8]/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-[#E8DCC8] flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <RelevanceScoreRing score={event.relevance.totalScore} size="md" showLabel={false} />
              <div className="text-left">
                <span className="text-xs font-bold text-[#6B1E23] uppercase tracking-wider block">
                  {event.relevance.totalScore}/100 Match
                </span>
                <span className="text-[10px] text-[#5A3828] underline font-medium">
                  Why this score?
                </span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#FFFDF8] leading-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#E8DCC8] mt-2 max-w-2xl line-clamp-2">
                {event.tagline}
              </p>
            </div>
          </div>

          {/* Quick Info Strip */}
          <div className="p-6 bg-[#FFFDF8] border-b border-[#F4EBDD] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#5A3828] block text-[11px] uppercase tracking-wider font-semibold">Date & Time</span>
              <div className="font-semibold text-[#2A1B16] mt-0.5">{dateStr}</div>
              <div className="text-[#5A3828]">{timeStr}</div>
            </div>
            <div>
              <span className="text-[#5A3828] block text-[11px] uppercase tracking-wider font-semibold">Venue</span>
              <div className="font-semibold text-[#2A1B16] mt-0.5">{event.venue?.name}</div>
              <div className="text-[#5A3828]">{event.venue?.building} · {event.venue?.room}</div>
            </div>
            <div>
              <span className="text-[#5A3828] block text-[11px] uppercase tracking-wider font-semibold">Organizer</span>
              <div className="font-semibold text-[#2A1B16] mt-0.5">{event.organizer?.name}</div>
              <div className="text-[#6B1E23] font-bold">{Math.round(event.organizer?.trust_score || 88)}% Trust Rating</div>
            </div>
            <div>
              <span className="text-[#5A3828] block text-[11px] uppercase tracking-wider font-semibold">Cost & Certificate</span>
              <div className="font-semibold text-[#2A1B16] mt-0.5">{event.is_free ? 'Free Event' : `$${(event.cost_cents/100).toFixed(2)}`}</div>
              <div className="text-[#2D6A4F] font-semibold">{event.certificate_offered ? '✓ Certificate Offered' : 'No Certificate'}</div>
            </div>
          </div>

          {/* Registration / Attendance CTA Action Row */}
          <div className="p-6 bg-[#F4EBDD]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5A3828]">
              {analytics && (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                  <span>
                    <strong className="text-[#2A1B16]">{analytics.seats_registered}</strong> / {analytics.seats_total} seats registered ({Math.round((analytics.seats_registered/analytics.seats_total)*100)}% filled)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setReviewModalEvent(event)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FFFDF8] hover:bg-[#F4EBDD] text-xs font-semibold text-[#2A1B16] transition-colors"
              >
                Leave 30-Sec Review
              </button>

              <button
                onClick={handleRegister}
                disabled={isRegistering || isRegistered}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isRegistered
                    ? 'bg-[#2D6A4F] text-white cursor-default'
                    : 'bg-[#2C0F12] text-white hover:bg-[#6B1E23]'
                }`}
              >
                {isRegistered ? '✓ You Are Registered' : isRegistering ? 'Registering...' : 'Register for Session'}
              </button>
            </div>
          </div>
        </div>

        {/* ----------------- WHAT WILL I GET OUT OF THIS? ----------------- */}
        <section className="mb-12">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B1E23] block">
              Tangible ROI Deliverables
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2A1B16]">
              What will I get out of this?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Skills */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
              <div className="flex items-center gap-2 text-[#6B1E23] text-xs font-bold uppercase tracking-wider mb-2">
                <Brain className="w-4 h-4" />
                <span>🧠 Practical Skills</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#2A1B16]">
                {event.skills_taught?.map((s, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B1E23]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
              <div className="flex items-center gap-2 text-[#6B1E23] text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                <span>💼 Career Leverage</span>
              </div>
              <p className="text-xs text-[#2A1B16] leading-relaxed">
                Direct recruiter visibility and alumni referrals. Rated {event.career_value_rating}/100 career leverage.
              </p>
              <span className="inline-block mt-2 text-[11px] font-semibold text-[#6B1E23] bg-[#6B1E23]/10 px-2 py-0.5 rounded">
                Interview fast-track opportunity
              </span>
            </div>

            {/* Credential */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
              <div className="flex items-center gap-2 text-[#6B1E23] text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>📜 Credential</span>
              </div>
              <p className="text-xs text-[#2A1B16] leading-relaxed">
                {event.certificate_offered
                  ? 'Official cryptographically signed completion certificate sent to your campus email.'
                  : 'No certificate offered for this session; focused entirely on open dialogue & notes.'}
              </p>
            </div>

            {/* Networking */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
              <div className="flex items-center gap-2 text-[#6B1E23] text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-4 h-4" />
                <span>🤝 Peer Networking</span>
              </div>
              <p className="text-xs text-[#2A1B16] leading-relaxed">
                {event.networking_potential} potential · Expected {event.max_capacity} attendees across CS, Design & Venture.
              </p>
            </div>

            {/* Portfolio Artifact */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8]">
              <div className="flex items-center gap-2 text-[#6B1E23] text-xs font-bold uppercase tracking-wider mb-2">
                <FolderGit2 className="w-4 h-4" />
                <span>📁 Portfolio Artifact</span>
              </div>
              <p className="text-xs text-[#2A1B16] leading-relaxed">
                Walk away with runnable code or finished presentation ready to commit to your GitHub portfolio.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------- ORGANIZER SAYS vs STUDENTS REPORT ----------------- */}
        <section className="mb-12">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B1E23] block">
              Truth in Advertising Protocol
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2A1B16]">
              Organizer Claims vs. Verified Student Evidence
            </h2>
            <p className="text-xs text-[#5A3828] mt-1">
              We cross-check organizer marketing claims against post-event audits from verified attendees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Col 1: Organizer Claims with Verification Status */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A3828] pb-2 border-b border-[#E8DCC8]">
                Audited Claims & Evidence ({event.claims?.length || 0})
              </h3>

              {event.claims && event.claims.length > 0 ? (
                event.claims.map(claim => (
                  <ClaimVerificationBadge key={claim.id} claim={claim} />
                ))
              ) : (
                <div className="p-6 bg-[#FFFDF8] border border-[#E8DCC8] rounded-xl text-xs text-[#5A3828]">
                  Standard campus event with verified organizer registration.
                </div>
              )}
            </div>

            {/* Col 2: Behavioral Signals (Historical & Live) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A3828] pb-2 border-b border-[#E8DCC8]">
                Punctuality & Behavioral Signals
              </h3>

              {analytics && (
                <div className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-5 space-y-4 text-xs text-[#2A1B16]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4EBDD]">
                    <span className="text-[#5A3828]">Check-in queue peak</span>
                    <strong className="font-semibold text-[#6B1E23]">
                      {analytics.peak_queue_time || '10 min before start'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#F4EBDD]">
                    <span className="text-[#5A3828]">Historical start delay</span>
                    <strong className="font-semibold text-[#2A1B16]">
                      {analytics.delay_minutes_avg <= 5
                        ? 'Starts strictly on time'
                        : `Usually starts ~${analytics.delay_minutes_avg} mins late`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#F4EBDD]">
                    <span className="text-[#5A3828]">Attendance turnout rate</span>
                    <strong className="font-semibold text-[#2D6A4F]">
                      {analytics.attendance_rate_pct}% of RSVPs attend live
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#5A3828]">Data source verification</span>
                    <span className="text-[10px] font-bold bg-[#E8DCC8]/60 px-2 py-0.5 rounded text-[#2A1B16] uppercase">
                      {analytics.signal_type} Campus Analytics
                    </span>
                  </div>
                </div>
              )}

              {/* Community Insights Summary Box */}
              {insights && (
                <div className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-5 text-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B1E23] mb-2">
                    What Students Say Most
                  </h4>
                  <div className="space-y-2">
                    {insights.summaryStatements.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[#2A1B16]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </div>
                    ))}
                    {insights.summaryStatements.caveats.map((cav, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[#B9770E]">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{cav}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ----------------- VENUE LOCATION & GOOGLE MAP ----------------- */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2 border-b border-[#E8DCC8] gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6B1E23] block">
                Campus Venue & Navigation
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#2A1B16]">
                {event.venue?.name}
              </h2>
              <p className="text-xs text-[#5A3828] mt-0.5">
                {event.venue?.building} · {event.venue?.room} ({event.venue?.address})
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${event.venue?.latitude},${event.venue?.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2C0F12] hover:bg-[#6B1E23] text-[#FFFDF8] font-semibold text-xs transition-colors self-start sm:self-auto"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#E8DCC8] shadow-sm">
            <DelhiGoogleMap
              events={[event]}
              selectedEventId={event.id}
              selectedLocation={{
                lat: event.venue?.latitude || 28.545,
                lng: event.venue?.longitude || 77.1926,
                name: event.venue?.name,
                address: event.venue?.address
              }}
              height="340px"
              zoom={14}
              showSearch={false}
            />
          </div>
        </section>

        {/* ----------------- VERIFIED REVIEWS FEED ----------------- */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8DCC8]">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2A1B16]">
                Verified Attendee Reviews ({event.reviews?.length || 0})
              </h2>
            </div>
            <button
              onClick={() => setReviewModalEvent(event)}
              className="text-xs font-semibold text-[#6B1E23] hover:underline"
            >
              + Submit 30-Second Review
            </button>
          </div>

          <div className="space-y-4">
            {event.reviews && event.reviews.length > 0 ? (
              event.reviews.map(rev => (
                <div key={rev.id} className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-5 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2A1B16]">{rev.user_name}</span>
                      <span className="text-[#5A3828]">·</span>
                      <span className="text-[#5A3828]">{rev.user_degree}</span>
                      {rev.is_verified_attendee && (
                        <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-1.5 py-0.2 rounded">
                          ✓ Verified Attendee
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-[#6B1E23] tabular-nums">
                      ★ {rev.rating_overall.toFixed(1)} / 5.0
                    </span>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-[#2A1B16] mt-2 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  )}

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {rev.tags.map(t => (
                        <span key={t} className="text-[10px] bg-[#F4EBDD] text-[#5A3828] px-2 py-0.5 rounded font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#5A3828] py-4">No student reviews submitted yet. Be the first!</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

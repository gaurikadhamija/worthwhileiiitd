import React, { useState, useEffect } from 'react';
import { Search, Sparkles, SlidersHorizontal, Award, Users, DollarSign, Filter, RefreshCw, Clock } from 'lucide-react';
import { EventItem, EventCategory } from '../types/index.js';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { HeroWine } from '../components/HeroWine.js';
import { EventCard } from '../components/EventCard.js';
import { RelevanceScoreRing } from '../components/RelevanceScoreRing.js';
import { getCategoryTheme } from '../utils/categoryColors.js';

const CATEGORIES: EventCategory[] = [
  'All',
  'Workshops',
  'Hackathons',
  'Career Events',
  'Networking',
  'Cultural',
  'Competitions'
];

export const DiscoverPage: React.FC = () => {
  const { profile, setIsGoalsModalOpen, navigateTo } = useApp();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [recommended, setRecommended] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [certOnly, setCertOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'time' | 'career'>('relevance');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allEvents, recEvents] = await Promise.all([
        api.getEvents({
          category: selectedCategory,
          search: searchQuery.trim() || undefined,
          is_free: freeOnly ? true : undefined,
          certificate_only: certOnly ? true : undefined,
        }),
        api.getRecommendedEvents()
      ]);

      setEvents(allEvents);
      setRecommended(recEvents.slice(0, 3));
    } catch (err: any) {
      setError(err.message || 'Failed to load campus events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, freeOnly, certOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  // Sort client-side for immediate responsive sorting
  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'relevance') {
      return b.relevance.totalScore - a.relevance.totalScore;
    }
    if (sortBy === 'career') {
      return b.career_value_rating - a.career_value_rating;
    }
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  return (
    <div className="min-dynamic-h-screen bg-transparent">
      {/* 1. FULL-WIDTH HERO SECTION (With Bold Geometric Sans & Moving Background) */}
      <HeroWine />

      {/* 2. SPLIT SECTION BELOW THE HERO (Text & Button on Left, Large Rounded Image on Right) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-[#EADCC4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text and Pill CTA Button */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EADCC4] text-[#3E2723] text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#A9805E]" />
              <span>Smart Schedule Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E1410] tracking-tight leading-[1.12]">
              Have a 2-hour free window between lectures?
            </h2>

            <p className="text-base sm:text-lg text-[#6B5A4E] leading-relaxed">
              Never let idle campus time go to waste. Tell WorthWhile when your free block starts, and our campus intelligence instantly filters walk times, evaluates hands-on learning quality, and highlights events matching your semester goals.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo('freetime')}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#3E2723] hover:bg-[#A9805E] text-[#FBF3E4] font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Find Free Window Events</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGoalsModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#FBF3E4] hover:bg-[#EADCC4] text-[#3E2723] font-bold text-sm border border-[#EADCC4] transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#A9805E]" />
                <span>Adjust Semester Goals</span>
              </button>
            </div>
          </div>

          {/* Right Column: Large Rounded Image with Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-[#FBF3E4] bg-[#EADCC4] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating at campus tech workshop"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/60 via-transparent to-transparent" />

              {/* Floating verified badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FBF3E4]/95 backdrop-blur-md border border-[#EADCC4] shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center text-[#FBF3E4] font-bold text-sm">
                    94%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1E1410] block">
                      Targeted Learning Fit
                    </span>
                    <span className="text-[11px] text-[#6B5A4E]">
                      Ranked by skills: AI, System Design & Pitching
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#A9805E]">
                  Verified Feed
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ROW OF 4 EQUAL-WIDTH CARDS (Image on Top, Title, Short Description, Pill Button Below) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EADCC4] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#A9805E] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1410] tracking-tight">
              Top Rated Opportunities
            </h2>
            <p className="text-sm text-[#6B5A4E] mt-1 font-medium">
              Top 4 opportunities rated highest for your active semester goals ({profile?.goals?.slice(0, 2).join(', ') || 'technical depth & internships'}).
            </p>
          </div>

          <button
            onClick={() => setIsGoalsModalOpen(true)}
            className="text-xs font-bold text-[#A9805E] hover:text-[#3E2723] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>Change My Goals</span>
            <span>→</span>
          </button>
        </div>

        {/* 4 Equal-Width Cards Grid (Responsive: 1 col on mobile, 2 col on tablet, 4 col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(recommended.length >= 4 ? recommended.slice(0, 4) : sortedEvents.slice(0, 4)).map(ev => (
            <EventCard key={`row4_${ev.id}`} event={ev} />
          ))}
        </div>
      </section>

      {/* 4. FULL-WIDTH HIGHLIGHT BANNER SECTION (Text on Left, Image on Right in Warm Mid Caramel #A9805E) */}
      <section className="w-full bg-[#A9805E] text-[#FBF3E4] my-12 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Text & Rounded Pill Button */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E2723] text-[#FBF3E4] text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#C8963E]" />
                <span>Peer-Audited Quality</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FBF3E4] tracking-tight leading-[1.12]">
                Evidence-First Campus Discovery. Stop Wasting Time on Fluff.
              </h2>

              <p className="text-base sm:text-lg text-[#FBF3E4]/90 max-w-xl leading-relaxed">
                Over 1,200 verified students review organizers, certificates, mentors, and equipment turnouts. Check the interactive Campus Heatmap to see where high-impact workshops happen across Delhi and beyond.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('heatmap')}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#3E2723] hover:bg-[#2A1713] text-[#FBF3E4] font-bold text-sm sm:text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Explore Campus Heatmap</span>
                  <span>→</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('compare')}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#FBF3E4] hover:bg-[#EADCC4] text-[#3E2723] font-bold text-sm shadow-md transition-all"
                >
                  <Users className="w-4 h-4 text-[#A9805E]" />
                  <span>Compare Side-by-Side</span>
                </button>
              </div>
            </div>

            {/* Right Column: Rounded Image */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-[#FBF3E4]/30 bg-[#3E2723] aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Student engineering team collaborating"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C8963E] block">
                    Delhi University & IIT Tech Hubs
                  </span>
                  <span className="text-sm font-bold text-[#FBF3E4] block mt-0.5">
                    Live Verified Venue Coordinates & Turnout Data
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MAIN EVENT CATALOG & SEARCH FILTERS (Reference Structure) */}
      <div id="discover-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#EADCC4] gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#A9805E] block mb-1">
                Full Campus Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1410] tracking-tight">
                All Campus Events
              </h2>
              <p className="text-sm text-[#6B5A4E] mt-1 font-medium">
                Personalized opportunities evaluated on content density, mentor credibility, and peer evidence.
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E1410]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#FBF3E4] border border-[#EADCC4] rounded-full px-3.5 py-2 text-xs text-[#1E1410] font-bold focus:outline-none focus:border-[#A9805E]"
              >
                <option value="relevance">Highest Relevance</option>
                <option value="time">Earliest Time</option>
                <option value="career">Career Value</option>
              </select>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#FBF3E4] border border-[#EADCC4] rounded-3xl p-5 sm:p-6 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9805E]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, skill (e.g. Gemini, Rust, Design), or club..."
                  className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-full border border-[#EADCC4] bg-[#F3E9D8]/60 text-[#1E1410] placeholder:text-[#6B5A4E]/70 focus:outline-none focus:border-[#3E2723]"
                />
              </form>

              {/* Quick toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                    freeOnly
                      ? 'bg-[#3E2723] text-[#FBF3E4] border-[#3E2723]'
                      : 'border-[#EADCC4] bg-[#F3E9D8] text-[#1E1410] hover:border-[#3E2723]'
                  }`}
                >
                  Free Only
                </button>

                <button
                  type="button"
                  onClick={() => setCertOnly(!certOnly)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                    certOnly
                      ? 'bg-[#3E2723] text-[#FBF3E4] border-[#3E2723]'
                      : 'border-[#EADCC4] bg-[#F3E9D8] text-[#1E1410] hover:border-[#3E2723]'
                  }`}
                >
                  Certificate
                </button>

                <button
                  type="button"
                  onClick={() => fetchEvents()}
                  className="p-2.5 rounded-full border border-[#EADCC4] text-[#1E1410] hover:bg-[#EADCC4] transition-colors"
                  title="Refresh catalog"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills (Functional Buttons with Distinct Color Coding) */}
            <div className="mt-4 pt-4 border-t border-[#EADCC4] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat;
                const theme = getCategoryTheme(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all border ${
                      active
                        ? cat === 'All'
                          ? 'bg-[#3E2723] text-[#FBF3E4] border-[#3E2723] shadow-md scale-105'
                          : `${theme.badgeBg} text-[#FFFDF8] border-transparent shadow-md scale-105`
                        : `bg-[#F3E9D8] border-[#EADCC4] text-[#1E1410] hover:border-[#3E2723]`
                    }`}
                  >
                    {cat !== 'All' && (
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                        style={{ backgroundColor: active ? '#FFFDF8' : theme.dotColor }}
                      />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading, Error or Grid State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 rounded-3xl bg-[#FBF3E4] border border-[#EADCC4] p-5 animate-pulse">
                  <div className="h-44 bg-[#EADCC4]/60 rounded-2xl mb-4" />
                  <div className="h-4 w-1/3 bg-[#EADCC4]/60 rounded mb-2" />
                  <div className="h-6 w-3/4 bg-[#EADCC4]/60 rounded mb-2" />
                  <div className="h-4 w-full bg-[#EADCC4]/40 rounded mb-4" />
                  <div className="h-8 bg-[#EADCC4]/40 rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center bg-[#FBF3E4] rounded-3xl border border-[#EADCC4] p-8">
              <p className="text-sm font-bold text-[#A9805E]">Unable to load recommendations.</p>
              <p className="text-xs text-[#6B5A4E] mt-1">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-6 py-2.5 text-xs font-bold rounded-full bg-[#3E2723] text-[#FBF3E4]"
              >
                Retry
              </button>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="py-20 text-center bg-[#FBF3E4] rounded-3xl border border-[#EADCC4] p-8">
              <h3 className="text-xl font-bold text-[#1E1410]">
                No events match your current filters.
              </h3>
              <p className="text-xs text-[#6B5A4E] mt-1 max-w-md mx-auto">
                Try clearing your search terms or expanding to all categories to see available campus opportunities.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setFreeOnly(false);
                  setCertOnly(false);
                }}
                className="mt-4 px-6 py-2.5 text-xs font-bold rounded-full bg-[#3E2723] text-[#FBF3E4]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {sortedEvents.map(ev => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

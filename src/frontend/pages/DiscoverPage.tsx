import React, { useState, useEffect } from 'react';
import { Search, Sparkles, SlidersHorizontal, Award, Users, DollarSign, Filter, RefreshCw } from 'lucide-react';
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
      {/* 1. HERO WINE (Animated Velvet / Liquid Wine Aesthetic) */}
      <HeroWine />

      {/* 2. TRANSITION INTO WARM CREAM & COFFEE EDITORIAL AESTHETIC (Reference 1) */}
      <div id="discover-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        
        {/* "Picked for you" Section (Top 3 Highest Relevance Matches) */}
        {recommended.length > 0 && !searchQuery && selectedCategory === 'All' && (
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#D8C5AE] gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#6B1E23] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Personalized Recommendations</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A0D08]">
                  Picked for you
                </h2>
                <p className="text-sm text-[#331C13] mt-1 font-medium">
                  Prioritized by your semester goals ({profile?.goals?.slice(0, 2).join(', ') || 'technical depth & internships'}).
                </p>
              </div>

              <button
                onClick={() => setIsGoalsModalOpen(true)}
                className="text-xs font-bold text-[#6B1E23] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Change Goals</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recommended.map(ev => (
                <EventCard key={`rec_${ev.id}`} event={ev} />
              ))}
            </div>
          </section>
        )}

        {/* Section: "Events worth your time" */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#D8C5AE] gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#6B1E23] block mb-1">
                Full Campus Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A0D08]">
                Events worth your time
              </h2>
              <p className="text-sm text-[#331C13] mt-1 font-medium">
                Personalized opportunities evaluated on content density, mentor credibility, and peer evidence.
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A0D08]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#FFFDF8] border border-[#D8C5AE] rounded-lg px-2.5 py-1.5 text-xs text-[#1A0D08] font-medium focus:outline-none focus:border-[#6B1E23]"
              >
                <option value="relevance">Highest Relevance</option>
                <option value="time">Earliest Time</option>
                <option value="career">Career Value</option>
              </select>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#FFFDF9] border border-[#D8C5AE] rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3828]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, skill (e.g. Gemini, Rust, Design), or club..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#D8C5AE] bg-[#F4EBDD]/40 text-[#1A0D08] placeholder:text-[#5A3828]/70 focus:outline-none focus:border-[#6B1E23]"
                />
              </form>

              {/* Quick toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFreeOnly(!freeOnly)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    freeOnly
                      ? 'bg-[#2C0F12] text-[#FFFDF8] border-[#2C0F12]'
                      : 'border-[#D8C5AE] bg-[#FFFDF8] text-[#331C13] hover:border-[#6B1E23]'
                  }`}
                >
                  Free Only
                </button>

                <button
                  type="button"
                  onClick={() => setCertOnly(!certOnly)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    certOnly
                      ? 'bg-[#2C0F12] text-[#FFFDF8] border-[#2C0F12]'
                      : 'border-[#D8C5AE] bg-[#FFFDF8] text-[#331C13] hover:border-[#6B1E23]'
                  }`}
                >
                  Certificate
                </button>

                <button
                  type="button"
                  onClick={() => fetchEvents()}
                  className="p-2 rounded-lg border border-[#D8C5AE] text-[#331C13] hover:bg-[#F4EBDD] transition-colors"
                  title="Refresh catalog"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills (Functional Buttons with Category Color Coding) */}
            <div className="mt-4 pt-4 border-t border-[#D8C5AE]/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat;
                const theme = getCategoryTheme(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                      active
                        ? cat === 'All'
                          ? 'bg-[#241510] text-[#FFFDF8] border-[#241510] shadow-md scale-105'
                          : `${theme.badgeBg} text-[#FFFDF8] border-transparent shadow-md scale-105`
                        : `bg-[#FFFDF9] border-[#D8C5AE] text-[#331C13] hover:border-[#6B1E23] hover:text-[#1A0D08]`
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
                <div key={i} className="h-96 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] p-5 animate-pulse">
                  <div className="h-44 bg-[#E8DCC8]/60 rounded-xl mb-4" />
                  <div className="h-4 w-1/3 bg-[#E8DCC8]/60 rounded mb-2" />
                  <div className="h-6 w-3/4 bg-[#E8DCC8]/60 rounded mb-2" />
                  <div className="h-4 w-full bg-[#E8DCC8]/40 rounded mb-4" />
                  <div className="h-8 bg-[#E8DCC8]/40 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center bg-[#FFFDF8] rounded-2xl border border-[#E8DCC8] p-8">
              <p className="text-sm font-semibold text-[#6B1E23]">Unable to load recommendations.</p>
              <p className="text-xs text-[#5A3828] mt-1">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C0F12] text-[#FFFDF8]"
              >
                Retry
              </button>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="py-20 text-center bg-[#FFFDF8] rounded-2xl border border-[#E8DCC8] p-8">
              <h3 className="font-serif text-xl font-bold text-[#2A1B16]">
                No events match your current filters.
              </h3>
              <p className="text-xs text-[#5A3828] mt-1 max-w-md mx-auto">
                Try clearing your search terms or expanding to all categories to see available campus opportunities.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setFreeOnly(false);
                  setCertOnly(false);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C0F12] text-[#FFFDF8]"
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

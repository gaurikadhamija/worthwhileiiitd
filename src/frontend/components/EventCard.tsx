import React from 'react';
import { Bookmark, Clock, MapPin, Award, Users, Check, Plus, ExternalLink } from 'lucide-react';
import { EventItem } from '../types/index.js';
import { RelevanceScoreRing } from './RelevanceScoreRing.js';
import { useApp } from '../context/AppContext.js';
import { getCategoryTheme } from '../utils/categoryColors.js';

interface Props {
  event: EventItem;
  onSelect?: () => void;
}

export const EventCard: React.FC<Props> = ({ event, onSelect }) => {
  const {
    savedEventIds,
    toggleSave,
    compareEventIds,
    addToCompare,
    removeFromCompare,
    setScoreModalEvent,
    navigateTo
  } = useApp();

  const isSaved = savedEventIds.has(event.id);
  const isCompared = compareEventIds.includes(event.id);
  const catTheme = getCategoryTheme(event.category);

  const startDate = new Date(event.start_time);
  const dateFormatted = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const timeFormatted = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      navigateTo('event-details', event.id);
    }
  };

  return (
    <div className={`group relative flex flex-col justify-between rounded-3xl border border-[#EADCC4] ${catTheme.cardBorderAccent} bg-[#FBF3E4] p-5 transition-all duration-300 hover:shadow-xl hover:border-[#A9805E] hover:-translate-y-1.5 shadow-sm`}>
      <div>
        {/* Top Image & Relevance Ring Banner */}
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-[#EADCC4]">
          <img
            src={event.cover_image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating Score Badge on Image */}
          <div className="absolute top-3 right-3 bg-[#FBF3E4]/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-[#EADCC4] flex items-center gap-2">
            <RelevanceScoreRing
              score={event.relevance.totalScore}
              size="sm"
              showLabel={false}
              onClick={() => setScoreModalEvent(event)}
            />
            <div className="text-left">
              <span className="text-[10px] font-bold text-[#3E2723] uppercase tracking-wider block">
                {event.relevance.totalScore}%
              </span>
              <span className="text-[9px] text-[#6B5A4E] font-semibold leading-none">
                Fit Score
              </span>
            </div>
          </div>

          {/* Quick Bookmark Save Button */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleSave(event.id);
            }}
            className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md shadow-md transition-colors ${
              isSaved
                ? 'bg-[#3E2723] text-[#FBF3E4]'
                : 'bg-[#FBF3E4]/95 text-[#1E1410] hover:bg-[#FBF3E4]'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Image Overlay Badges with Category Color Coding */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${catTheme.imageTagBg} text-[#FFFDF8] font-bold tracking-wide uppercase text-[10px] shadow-md border border-white/30`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              <span>{event.category}</span>
            </span>
            <span className="font-bold bg-[#3E2723]/90 text-[#FBF3E4] border border-[#A9805E]/50 px-3 py-1 rounded-full backdrop-blur-md shadow-md text-[10px]">
              {event.is_free ? 'Free Event' : `$${(event.cost_cents / 100).toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Date & Location */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B5A4E] mb-2 font-medium">
          <div className="flex items-center gap-1 text-[#1E1410] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#A9805E]" />
            <span>{dateFormatted}</span>
            <span>·</span>
            <span>{timeFormatted}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 truncate max-w-[170px] text-[#6B5A4E] font-medium" title={event.venue?.name}>
            <MapPin className="w-3.5 h-3.5 text-[#A9805E] shrink-0" />
            <span className="truncate">{event.venue?.building || 'Campus Venue'}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleCardClick}
          className="text-lg font-bold text-[#1E1410] group-hover:text-[#A9805E] transition-colors cursor-pointer line-clamp-2 leading-snug font-sans"
        >
          {event.title}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-[#6B5A4E] mt-1.5 line-clamp-2 leading-relaxed">
          {event.tagline}
        </p>

        {/* Key Signals Bar: Organizer Trust & Verified Claims */}
        <div className="mt-4 pt-3 border-t border-[#EADCC4] flex items-center justify-between text-xs text-[#6B5A4E]">
          <div className="flex items-center gap-1.5" title={`Organizer Trust Rating: ${event.organizer?.trust_score ?? 88}%`}>
            <span className="text-[11px] text-[#6B5A4E]">By</span>
            <span className="font-semibold text-[#1E1410] truncate max-w-[130px]">
              {event.organizer?.name || 'Campus Organizer'}
            </span>
            <span className="text-[10px] font-bold text-[#3E2723] bg-[#EADCC4] px-2 py-0.5 rounded-full">
              {Math.round(event.organizer?.trust_score || 88)}% Trust
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#1B4D3E] font-bold">
            {event.certificate_offered && (
              <span className="flex items-center gap-0.5 text-[#1B4D3E]" title="Verified certificate provided">
                <Award className="w-3.5 h-3.5" />
                <span>Cert</span>
              </span>
            )}
            <span className="text-[#6B5A4E]/50">·</span>
            <span className="flex items-center gap-0.5 text-[#6B5A4E] font-medium" title={`${event.networking_potential} networking turnout`}>
              <Users className="w-3.5 h-3.5 text-[#A9805E]" />
              <span>{event.networking_potential} Net</span>
            </span>
          </div>
        </div>

        {/* Explain Score Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setScoreModalEvent(event);
            }}
            className="text-[11px] font-bold text-[#A9805E] hover:text-[#3E2723] flex items-center gap-1 transition-colors"
          >
            <span>Why this score? ({event.relevance.totalScore}/100)</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>

      {/* Action Footer: Fully rounded pill buttons */}
      <div className="mt-5 pt-3 border-t border-[#EADCC4] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            if (isCompared) {
              removeFromCompare(event.id);
            } else {
              addToCompare(event.id);
            }
          }}
          className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border transition-all ${
            isCompared
              ? 'bg-[#3E2723] text-[#FBF3E4] border-[#3E2723]'
              : 'border-[#EADCC4] bg-[#F3E9D8] text-[#1E1410] hover:border-[#A9805E] hover:bg-[#EADCC4]'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#FBF3E4]" />
              <span className="font-semibold">In Compare</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span className="font-medium">Compare</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCardClick}
          className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-[#3E2723] text-[#FBF3E4] hover:bg-[#A9805E] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

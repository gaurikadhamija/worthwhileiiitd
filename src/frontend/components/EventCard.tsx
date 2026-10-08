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
    <div className={`group relative flex flex-col justify-between rounded-2xl border border-[#D8C5AE] ${catTheme.cardBorderAccent} bg-[#FFFDF9] p-5 transition-all duration-300 hover:shadow-2xl hover:border-[#6B1E23]/60 hover:-translate-y-1 shadow-[0_8px_30px_rgba(36,21,16,0.10)]`}>
      <div>
        {/* Top Image & Relevance Ring Banner */}
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-[#E8DCC8]">
          <img
            src={event.cover_image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating Score Badge on Image */}
          <div className="absolute top-3 right-3 bg-[#FFFDF8]/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-[#E8DCC8]/80 flex items-center gap-2">
            <RelevanceScoreRing
              score={event.relevance.totalScore}
              size="sm"
              showLabel={false}
              onClick={() => setScoreModalEvent(event)}
            />
            <div className="text-left">
              <span className="text-[10px] font-bold text-[#6B1E23] uppercase tracking-wider block">
                {event.relevance.totalScore}%
              </span>
              <span className="text-[9px] text-[#331C13] font-semibold leading-none">
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
            className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md shadow-md transition-colors ${
              isSaved
                ? 'bg-[#6B1E23] text-[#FFFDF8]'
                : 'bg-[#FFFDF8]/95 text-[#2A1B16] hover:bg-[#FFFDF8]'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Image Overlay Badges with Category Color Coding */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${catTheme.imageTagBg} text-[#FFFDF8] font-bold tracking-wide uppercase text-[10px] shadow-md border border-white/30`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              <span>{event.category}</span>
            </span>
            <span className="font-semibold bg-[#241510]/90 text-[#FAF4EB] border border-[#A67C5B]/50 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md text-[10px]">
              {event.is_free ? 'Free Event' : `$${(event.cost_cents / 100).toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#331C13] mb-2 font-medium">
          <div className="flex items-center gap-1 text-[#1A0D08] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#6B1E23]" />
            <span>{dateFormatted}</span>
            <span>·</span>
            <span>{timeFormatted}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 truncate max-w-[170px] text-[#331C13] font-medium" title={event.venue?.name}>
            <MapPin className="w-3.5 h-3.5 text-[#6B1E23] shrink-0" />
            <span className="truncate">{event.venue?.building || 'Campus Venue'}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleCardClick}
          className="text-lg font-serif font-bold text-[#1A0D08] group-hover:text-[#6B1E23] transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {event.title}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-[#331C13] mt-1.5 line-clamp-2 leading-relaxed">
          {event.tagline}
        </p>

        {/* Key Signals Bar: Organizer Trust & Verified Claims */}
        <div className="mt-4 pt-3 border-t border-[#D8C5AE]/70 flex items-center justify-between text-xs text-[#331C13]">
          <div className="flex items-center gap-1.5" title={`Organizer Trust Rating: ${event.organizer?.trust_score ?? 88}%`}>
            <span className="text-[11px] text-[#5A3828]">By</span>
            <span className="font-semibold text-[#1A0D08] truncate max-w-[130px]">
              {event.organizer?.name || 'Campus Organizer'}
            </span>
            <span className="text-[10px] font-bold text-[#6B1E23] bg-[#6B1E23]/15 px-1.5 py-0.5 rounded border border-[#6B1E23]/25">
              {Math.round(event.organizer?.trust_score || 88)}% Trust
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#1E4D38] font-bold">
            {event.certificate_offered && (
              <span className="flex items-center gap-0.5 text-[#1E4D38]" title="Verified certificate provided">
                <Award className="w-3.5 h-3.5" />
                <span>Cert</span>
              </span>
            )}
            <span className="text-[#5A3828]/50">·</span>
            <span className="flex items-center gap-0.5 text-[#5A3828] font-medium" title={`${event.networking_potential} networking turnout`}>
              <Users className="w-3.5 h-3.5 text-[#6B1E23]" />
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
            className="text-[11px] font-semibold text-[#6B1E23] hover:underline flex items-center gap-1"
          >
            <span>Why this score? ({event.relevance.totalScore}/100)</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-[#F4EBDD] flex items-center justify-between gap-2">
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
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
            isCompared
              ? 'bg-[#2C0F12] text-[#FFFDF8] border-[#2C0F12]'
              : 'border-[#E8DCC8] bg-[#FFFDF8] text-[#5A3828] hover:border-[#6B1E23] hover:text-[#2A1B16]'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-3 h-3 text-[#FFFDF8]" />
              <span>In Compare</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>Compare</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCardClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#2C0F12] text-[#FFFDF8] hover:bg-[#6B1E23] transition-colors shadow-xs"
        >
          <span>View Details</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

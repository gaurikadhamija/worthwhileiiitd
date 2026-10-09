import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Sparkles, Filter, Clock, X, ArrowRight, ExternalLink, Map as MapIcon, Layers, Search, Building2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { RelevanceScoreRing } from '../components/RelevanceScoreRing.js';
import { DelhiGoogleMap, MapSelectedLocation } from '../components/DelhiGoogleMap.js';
import { EventItem } from '../types/index.js';
import { KNOWN_DELHI_LOCATIONS, calculateDistanceKm, calculateWalkingMinutes, CampusLocation } from '../services/locationService.js';
import { getCategoryTheme } from '../utils/categoryColors.js';

export const HeatmapPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Selected Location (Defaults to IIT Delhi Main Campus)
  const [currentLocation, setCurrentLocation] = useState<MapSelectedLocation>({
    lat: KNOWN_DELHI_LOCATIONS[2].lat,
    lng: KNOWN_DELHI_LOCATIONS[2].lng,
    name: KNOWN_DELHI_LOCATIONS[2].name,
    address: KNOWN_DELHI_LOCATIONS[2].address
  });

  const [maxMinutes, setMaxMinutes] = useState<number>(15);
  const [viewMode, setViewMode] = useState<'google_map' | 'campus_quad'>('google_map');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await api.getEvents({});
        setAllEvents(eventsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // -------------------------------------------------------------
  // REAL DYNAMIC TRAVEL TIME & RADIUS CALCULATIONS
  // -------------------------------------------------------------
  // For each event, calculate distance (km) and walking time (minutes) from currentLocation
  const eventsWithDistance = useMemo(() => {
    return allEvents.map(ev => {
      if (!ev.venue || !ev.venue.latitude || !ev.venue.longitude) {
        return {
          ...ev,
          distanceKm: 999,
          walkingMinutes: 999
        };
      }

      const dist = calculateDistanceKm(
        currentLocation.lat,
        currentLocation.lng,
        ev.venue.latitude,
        ev.venue.longitude
      );
      const walkMins = calculateWalkingMinutes(dist);

      return {
        ...ev,
        distanceKm: dist,
        walkingMinutes: walkMins
      };
    });
  }, [allEvents, currentLocation]);

  // Events within the active selected walking radius (10, 15, or 20 minutes)
  const eventsInRadius = useMemo(() => {
    return eventsWithDistance.filter(e => e.walkingMinutes <= maxMinutes);
  }, [eventsWithDistance, maxMinutes]);

  // Dynamic counts for each radius button based on CURRENT selected location
  const count10Min = useMemo(() => {
    return eventsWithDistance.filter(e => e.walkingMinutes <= 10).length;
  }, [eventsWithDistance]);

  const count15Min = useMemo(() => {
    return eventsWithDistance.filter(e => e.walkingMinutes <= 15).length;
  }, [eventsWithDistance]);

  const count20Min = useMemo(() => {
    return eventsWithDistance.filter(e => e.walkingMinutes <= 20).length;
  }, [eventsWithDistance]);

  // Events specifically located at the selected campus venue (or within 2.5 km for Engineering Quad discovery)
  const campusEvents = useMemo(() => {
    return eventsWithDistance
      .filter(e => e.distanceKm <= 2.5)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [eventsWithDistance]);

  const handleSelectCampusPreset = (loc: CampusLocation) => {
    setCurrentLocation({
      lat: loc.lat,
      lng: loc.lng,
      name: loc.name,
      address: loc.address
    });
  };

  return (
    <div className="min-dynamic-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header (Coffee Shop Theme Editorial Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EADCC4] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EADCC4] text-[#3E2723] text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#A9805E]" />
              <span>Campus Geographic Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1410] tracking-tight">
              Campus Event Heatmap
            </h1>
            <p className="text-sm text-[#6B5A4E] mt-1 font-medium">
              Select any college or campus location to inspect real walking distance, venue density, and upcoming sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-full bg-[#FBF3E4] border border-[#EADCC4] p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('google_map')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'google_map'
                    ? 'bg-[#3E2723] text-[#FBF3E4] shadow-xs'
                    : 'text-[#6B5A4E] hover:text-[#1E1410]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Interactive Map</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('campus_quad')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'campus_quad'
                    ? 'bg-[#3E2723] text-[#FBF3E4] shadow-xs'
                    : 'text-[#6B5A4E] hover:text-[#1E1410]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Campus Quad View</span>
              </button>
            </div>

            {/* DYNAMIC REAL COUNT BADGE */}
            <span className="hidden sm:inline-block text-xs font-bold text-[#3E2723] bg-[#FBF3E4] px-4 py-2 rounded-full border border-[#EADCC4] shadow-xs">
              📍 {eventsInRadius.length} sessions within {maxMinutes}m walk of {currentLocation.name}
            </span>
          </div>
        </div>

        {/* Quick Campus Chips Selector */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-[#6B5A4E] uppercase tracking-wider shrink-0 mr-1">
            Campus Presets:
          </span>
          {KNOWN_DELHI_LOCATIONS.slice(0, 7).map(loc => {
            const isSelected = currentLocation.name === loc.name;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectCampusPreset(loc)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-[#3E2723] text-[#FBF3E4] border-[#3E2723] shadow-xs'
                    : 'bg-[#FBF3E4] text-[#1E1410] border-[#EADCC4] hover:border-[#3E2723]'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>

        {/* Main Grid: Left Map / Quad (8 cols) & Right Venue Feed (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Map Container */}
          <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#E8DCC8] rounded-2xl p-6 shadow-sm overflow-hidden">
            
            {/* Filter controls over map */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-[#F4EBDD]">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#5A3828]">Walking Radius:</span>
                
                {/* 10 MIN BUTTON WITH DYNAMIC COUNT */}
                <button
                  type="button"
                  onClick={() => setMaxMinutes(10)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    maxMinutes === 10
                      ? 'bg-[#6B1E23] text-white shadow-xs'
                      : 'bg-[#F4EBDD] text-[#5A3828] hover:bg-[#E8DCC8]'
                  }`}
                >
                  <span>10 min walk</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/20 text-white">
                    {count10Min}
                  </span>
                </button>

                {/* 15 MIN BUTTON WITH DYNAMIC COUNT */}
                <button
                  type="button"
                  onClick={() => setMaxMinutes(15)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    maxMinutes === 15
                      ? 'bg-[#6B1E23] text-white shadow-xs'
                      : 'bg-[#F4EBDD] text-[#5A3828] hover:bg-[#E8DCC8]'
                  }`}
                >
                  <span>15 min walk</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/20 text-white">
                    {count15Min}
                  </span>
                </button>

                {/* 20 MIN BUTTON WITH DYNAMIC COUNT */}
                <button
                  type="button"
                  onClick={() => setMaxMinutes(20)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                    maxMinutes === 20
                      ? 'bg-[#6B1E23] text-white shadow-xs'
                      : 'bg-[#F4EBDD] text-[#5A3828] hover:bg-[#E8DCC8]'
                  }`}
                >
                  <span>20 min walk</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/20 text-white">
                    {count20Min}
                  </span>
                </button>
              </div>

              <div className="text-xs text-[#5A3828]">
                Center: <strong className="text-[#2A1B16]">{currentLocation.name}</strong>
              </div>
            </div>

            {/* RENDER VIEW MODE */}
            {viewMode === 'google_map' ? (
              <DelhiGoogleMap
                events={allEvents}
                selectedEventId={selectedEventId}
                onSelectEvent={id => setSelectedEventId(id)}
                selectedLocation={currentLocation}
                onSelectLocation={loc => setCurrentLocation(loc)}
                radiusMinutes={maxMinutes}
                height="500px"
                zoom={12}
                showSearch={true}
                searchPlaceholder="Search any campus (IGDTU, DTU, IIT Delhi)..."
              />
            ) : (
              /* DYNAMIC CAMPUS QUAD VIEW */
              <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DCC8] p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#F4EBDD]">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B1E23]">
                      Active Campus Quad
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2A1B16]">
                      {currentLocation.name} Quad & Facilities
                    </h3>
                    <p className="text-xs text-[#5A3828] mt-0.5">
                      {currentLocation.address}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#6B1E23]/10 text-[#6B1E23]">
                    {campusEvents.length} Sessions at this Quad
                  </span>
                </div>

                {/* DYNAMIC SESSIONS AT THIS QUAD */}
                {campusEvents.length === 0 ? (
                  <div className="py-12 text-center bg-[#F4EBDD]/40 rounded-xl border border-[#E8DCC8] p-6">
                    <p className="font-serif text-lg font-bold text-[#2A1B16]">
                      No events found near this campus.
                    </p>
                    <p className="text-xs text-[#5A3828] mt-1 max-w-md mx-auto">
                      Currently no sessions are scheduled within walking distance of {currentLocation.name}. Switch to IIT Delhi, DTU, or IGDTUW to explore active hubs.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {campusEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => navigateTo('event-details', ev.id)}
                        className="p-4 rounded-xl border border-[#E8DCC8] bg-[#F4EBDD]/30 hover:bg-[#F4EBDD] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-[#6B1E23]">{ev.category}</span>
                          <span className="font-bold text-[#2C0F12]">{ev.relevance.totalScore}% Fit</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#2A1B16] group-hover:text-[#6B1E23] transition-colors line-clamp-1">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-[#5A3828] mt-1 line-clamp-2">
                          {ev.tagline}
                        </p>
                        <div className="mt-3 pt-2 border-t border-[#E8DCC8]/60 flex items-center justify-between text-xs text-[#5A3828]">
                          <span>{ev.distanceKm} km ({ev.walkingMinutes} min walk)</span>
                          <span className="font-semibold text-[#6B1E23] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#5A3828]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#6B1E23]" />
                  <span>Campus Event Location</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#2C0F12]" />
                  <span>Selected Starting Point</span>
                </span>
              </div>
              <span className="text-[11px] text-[#5A3828]/70">
                Click map or search to relocate center
              </span>
            </div>
          </div>

          {/* Right: Sessions Within Walking Distance Feed (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#FBF3E4] border border-[#EADCC4] rounded-3xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#EADCC4]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A9805E]">
                    Reachable on Foot
                  </span>
                  <h3 className="text-xl font-bold text-[#1E1410] mt-0.5 font-sans">
                    Within {maxMinutes} Min Walk
                  </h3>
                  <p className="text-xs text-[#6B5A4E] mt-0.5 font-medium">
                    From {currentLocation.name}
                  </p>
                </div>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-[#3E2723] text-[#FBF3E4] tabular-nums">
                  {eventsInRadius.length}
                </span>
              </div>

              {eventsInRadius.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6B5A4E]">
                  No events found within {maxMinutes} minutes walk of this point. Try expanding the radius to 20 mins or select a nearby campus like IIT Delhi, DTU, or IGDTUW.
                </div>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {eventsInRadius.map(ev => {
                    const catTheme = getCategoryTheme(ev.category);
                    return (
                      <div
                        key={ev.id}
                        onClick={() => navigateTo('event-details', ev.id)}
                        className="p-4 rounded-2xl border border-[#EADCC4] bg-[#F3E9D8] hover:bg-[#EADCC4] transition-colors cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${catTheme.pillBg} ${catTheme.pillText} border ${catTheme.pillBorder}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catTheme.dotColor }} />
                            <span>{ev.category}</span>
                          </span>
                          <span className="font-bold text-[#1E1410] bg-[#EADCC4] px-2.5 py-0.5 rounded-full">{ev.relevance.totalScore}% Fit</span>
                        </div>

                        <h5 className="font-bold text-sm text-[#1E1410] group-hover:text-[#A9805E] transition-colors line-clamp-1 font-sans">
                          {ev.title}
                        </h5>

                        <p className="text-[11px] text-[#6B5A4E] mt-0.5 line-clamp-1">
                          {ev.venue?.name} · {ev.venue?.building}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-[#EADCC4] flex items-center justify-between text-xs text-[#6B5A4E]">
                          <span className="font-semibold text-[#1E1410]">
                            ⏱ ~{ev.walkingMinutes} min walk ({ev.distanceKm} km)
                          </span>
                          <span className="font-bold text-[#A9805E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

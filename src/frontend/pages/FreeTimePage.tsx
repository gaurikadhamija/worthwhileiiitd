import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Navigation, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink, Search, LocateFixed } from 'lucide-react';
import { api } from '../services/api.js';
import { useApp } from '../context/AppContext.js';
import { RelevanceScoreRing } from '../components/RelevanceScoreRing.js';
import { DelhiGoogleMap, MapSelectedLocation } from '../components/DelhiGoogleMap.js';
import { KNOWN_DELHI_LOCATIONS, CampusLocation, calculateDistanceKm } from '../services/locationService.js';
import { EventItem } from '../types/index.js';
import { getCategoryTheme } from '../utils/categoryColors.js';

export const FreeTimePage: React.FC = () => {
  const { navigateTo } = useApp();

  const [startHour, setStartHour] = useState(15); // 3:00 PM
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(17); // 5:00 PM
  const [endMinute, setEndMinute] = useState(0);

  // Map-Based Starting Location (Defaults to Connaught Place)
  const [startingLocation, setStartingLocation] = useState<MapSelectedLocation>({
    lat: KNOWN_DELHI_LOCATIONS[7].lat, // Connaught Place
    lng: KNOWN_DELHI_LOCATIONS[7].lng,
    name: KNOWN_DELHI_LOCATIONS[7].name,
    address: KNOWN_DELHI_LOCATIONS[7].address
  });

  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch catalog events for map markers
  useEffect(() => {
    api.getEvents({}).then(evs => setAllEvents(evs)).catch(err => console.warn(err));
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFreeTimeRecommendations({
        startHour,
        startMinute,
        endHour,
        endMinute,
        originLat: startingLocation.lat,
        originLng: startingLocation.lng,
        originName: startingLocation.name
      });
      setRecommendations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch free-time recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [startHour, startMinute, endHour, endMinute, startingLocation]);

  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  const durationHours = (totalMinutes / 60).toFixed(1);

  const fittingEvents = recommendations.filter(r => r.isRecommended);
  const conflictingEvents = recommendations.filter(r => !r.isRecommended);

  return (
    <div className="min-dynamic-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header (Coffee Shop Theme Editorial Style) */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EADCC4] text-[#3E2723] text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-[#A9805E]" />
            <span>Time Availability & Commute Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1410] leading-tight tracking-tight">
            "I Have {durationHours} Hours Free"
          </h1>
          <p className="text-sm text-[#6B5A4E] mt-2 font-medium">
            Select your starting location directly on the map. We calculate real travel times, transit buffers, and highlight high-relevance sessions that fit.
          </p>
        </div>

        {/* Time Selector Toolbar */}
        <div className="bg-[#FBF3E4] border border-[#EADCC4] rounded-3xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            
            {/* Start Time */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1410] block mb-2">
                Free Starting At
              </label>
              <select
                value={startHour}
                onChange={e => setStartHour(Number(e.target.value))}
                className="w-full bg-[#F3E9D8] border border-[#EADCC4] rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1E1410] focus:outline-none focus:border-[#3E2723]"
              >
                <option value={10}>10:00 AM</option>
                <option value={12}>12:00 PM</option>
                <option value={13}>1:00 PM</option>
                <option value={14}>2:00 PM</option>
                <option value={15}>3:00 PM</option>
                <option value={16}>4:00 PM</option>
                <option value={17}>5:00 PM</option>
                <option value={18}>6:00 PM</option>
              </select>
            </div>

            {/* End Time */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1410] block mb-2">
                Busy Again By
              </label>
              <select
                value={endHour}
                onChange={e => setEndHour(Number(e.target.value))}
                className="w-full bg-[#F3E9D8] border border-[#EADCC4] rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1E1410] focus:outline-none focus:border-[#3E2723]"
              >
                <option value={14}>2:00 PM</option>
                <option value={15}>3:00 PM</option>
                <option value={16}>4:00 PM</option>
                <option value={17}>5:00 PM</option>
                <option value={18}>6:00 PM</option>
                <option value={19}>7:00 PM</option>
                <option value={20}>8:00 PM</option>
                <option value={21}>9:00 PM</option>
              </select>
            </div>

            {/* Current Starting Location Readout */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1410] block mb-2">
                Starting Location
              </label>
              <div className="flex items-center gap-2 bg-[#F3E9D8] border border-[#EADCC4] rounded-full px-4 py-2.5 text-xs text-[#1E1410]">
                <MapPin className="w-4 h-4 text-[#A9805E] shrink-0" />
                <span className="font-bold truncate">{startingLocation.name || 'Selected Map Location'}</span>
              </div>
            </div>

          </div>

          {/* Quick Preset Location Chips */}
          <div className="mt-4 pt-4 border-t border-[#EADCC4] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-[#6B5A4E] uppercase tracking-wider shrink-0 mr-1">
              Start From:
            </span>
            {KNOWN_DELHI_LOCATIONS.slice(0, 7).map(loc => {
              const isSelected = startingLocation.name === loc.name;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setStartingLocation({
                    lat: loc.lat,
                    lng: loc.lng,
                    name: loc.name,
                    address: loc.address
                  })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-[#3E2723] text-[#FBF3E4] border-[#3E2723] shadow-xs'
                      : 'bg-[#F3E9D8] text-[#1E1410] border-[#EADCC4] hover:border-[#3E2723]'
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE GOOGLE MAP LOCATION PICKER */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A3828]">
              <MapPin className="w-4 h-4 text-[#6B1E23]" />
              <span>Click anywhere on the map or search to choose ANY starting point:</span>
            </div>
            <span className="text-[11px] text-[#6B1E23] font-bold bg-[#FFFDF8] px-2.5 py-1 rounded-lg border border-[#E8DCC8]">
              Origin: {startingLocation.name}
            </span>
          </div>

          <DelhiGoogleMap
            events={allEvents}
            selectedLocation={startingLocation}
            onSelectLocation={loc => setStartingLocation(loc)}
            height="380px"
            zoom={12}
            showSearch={true}
            searchPlaceholder="Search any starting location (e.g. Connaught Place, DTU, IGDTU, IIT Delhi)..."
          />
        </div>

        {/* RECOMMENDATION RESULTS */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EADCC4]">
            <h2 className="text-2xl font-extrabold text-[#1E1410]">
              Sessions for your {durationHours}-Hour Window
            </h2>
            <span className="text-xs font-bold text-[#3E2723] bg-[#FBF3E4] px-4 py-1.5 rounded-full border border-[#EADCC4]">
              {fittingEvents.length} Sessions Fit Your Window
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 rounded-3xl bg-[#FBF3E4] border border-[#EADCC4] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center bg-[#FBF3E4] rounded-3xl border border-[#EADCC4] p-6">
              <p className="text-sm font-bold text-[#A9805E]">{error}</p>
              <button
                onClick={fetchRecommendations}
                className="mt-3 px-6 py-2.5 text-xs font-bold rounded-full bg-[#3E2723] text-[#FBF3E4]"
              >
                Retry
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="py-16 text-center bg-[#FBF3E4] rounded-3xl border border-[#EADCC4] p-8">
              <Clock className="w-8 h-8 text-[#A9805E] mx-auto mb-2" />
              <h3 className="text-lg font-bold text-[#1E1410]">
                No sessions fit this specific window.
              </h3>
              <p className="text-xs text-[#6B5A4E] mt-1 max-w-sm mx-auto">
                Try widening your free-time window or moving your starting location closer to campus hubs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map(rec => {
                const ev = rec.event;
                const isFit = rec.isRecommended;

                const catTheme = getCategoryTheme(ev.category);
                return (
                  <div
                    key={ev.id}
                    className={`rounded-3xl p-6 transition-all ${
                      isFit
                        ? 'bg-[#FBF3E4] border border-[#EADCC4] shadow-md hover:shadow-xl hover:border-[#A9805E]'
                        : 'bg-[#F3E9D8] border border-[#EADCC4] opacity-85'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Left: Info */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                            isFit
                              ? 'bg-[#1E4D38]/15 text-[#1E4D38] border border-[#1E4D38]/30'
                              : 'bg-[#B9770E]/15 text-[#854D0E] border border-[#B9770E]/30'
                          }`}>
                            {isFit ? '✓ Fits Window' : '✕ Exceeds Window'}
                          </span>

                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${catTheme.pillBg} ${catTheme.pillText} border ${catTheme.pillBorder}`}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catTheme.dotColor }} />
                            <span>{ev.category}</span>
                          </span>
                          <span className="text-[#6B5A4E]/60">·</span>
                          <span className="text-[#1E1410] font-bold">{rec.timeWindowDisplay}</span>
                        </div>

                        <h3 className="font-bold text-lg text-[#1E1410]">
                          {ev.title}
                        </h3>

                        <p className="text-xs text-[#6B5A4E]">
                          {ev.venue?.name} · {ev.venue?.building} ({ev.venue?.campus_zone})
                        </p>

                        {/* Commute Explanation */}
                        <div className="pt-2 text-xs flex items-center gap-2">
                          <span className="font-bold text-[#1E1410]">
                            ⏱ {rec.commuteEstimateMinutes} min commute ({rec.distanceKm} km via {rec.commuteTransitMode})
                          </span>
                          <span className="text-[#6B5A4E]/60">·</span>
                          <span className={`font-semibold ${isFit ? 'text-[#1E4D38]' : 'text-[#854D0E]'}`}>
                            {rec.explanation}
                          </span>
                        </div>
                      </div>

                      {/* Right: Score Ring & Action */}
                      <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                        <RelevanceScoreRing score={rec.fitScore} size="md" />

                        <button
                          type="button"
                          onClick={() => navigateTo('event-details', ev.id)}
                          className="px-5 py-2.5 rounded-full bg-[#3E2723] hover:bg-[#A9805E] text-[#FBF3E4] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span>View Event</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

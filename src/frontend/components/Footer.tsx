import React from 'react';
import { Compass, ShieldCheck, Heart, Star, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const Footer: React.FC = () => {
  const { navigateTo, setIsGoalsModalOpen } = useApp();

  const testimonials = [
    {
      name: 'Aanya Verma',
      major: '3rd Year CSE, IIT Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      quote: 'WorthWhile saved me 12+ wasted hours this semester. I used to go to generic workshops with hype marketing; now I only attend sessions with verified trust ratings and hands-on tool loops.',
      rating: 5,
      tag: 'Verified Student'
    },
    {
      name: 'Rohan Kapoor',
      major: 'Final Year ECE, NSUT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      quote: 'The 2-Hour free window mode is incredible. Between lab and evening lectures, I caught an angel pitch mixer that directly landed me an internship interview.',
      rating: 5,
      tag: 'Founder Track'
    },
    {
      name: 'Priya Nair',
      major: '2nd Year AI & DS, DTU',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      quote: 'Finally a platform that separates genuine certifications from participation fluff. Organizer credibility scores are spot-on and peer feedback is completely real.',
      rating: 5,
      tag: 'AI Researcher'
    }
  ];

  return (
    <footer className="relative bg-[#3E2723] text-[#F3E9D8] border-t border-[#2A1713] overflow-hidden pt-16 pb-12 px-4 sm:px-6 lg:px-8 shadow-2xl">
      
      {/* ----------------- SUBTLE MOVING BACKGROUND FOR FOOTER ----------------- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Slowly drifting steam & organic coffee shapes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none animate-steam"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <path
            d="M-40,300 C280,180 500,440 840,280 C1180,120 1320,380 1520,260"
            fill="none"
            stroke="#C8963E"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <path
            d="M-20,480 C260,360 620,540 980,400 C1240,280 1380,480 1500,410"
            fill="none"
            stroke="#EADCC4"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Floating Coffee Bean Silhouettes in Background */}
        <div className="absolute top-10 left-12 w-8 h-12 rounded-full border border-[#C8963E]/20 rotate-45 pointer-events-none animate-bean-drift-1" />
        <div className="absolute bottom-16 right-20 w-10 h-14 rounded-full border border-[#A9805E]/20 -rotate-12 pointer-events-none animate-bean-drift-2" />
        <div className="absolute top-1/2 left-2/3 w-6 h-9 rounded-full border border-[#EADCC4]/20 rotate-12 pointer-events-none animate-bean-drift-1" />
      </div>

      <div className="relative mx-auto max-w-7xl z-10">
        
        {/* ----------------- TESTIMONIAL SECTION WITH ROUNDED CARDS & AVATARS ----------------- */}
        <div className="mb-16 pb-14 border-b border-[#4E322C]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A1713] text-[#C8963E] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Experiences</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FBF3E4] tracking-tight">
              Loved by Students Who Value Their Free Time
            </h3>
            <p className="text-sm text-[#EADCC4] mt-2 font-normal">
              Real reviews from undergraduates and postgrads across technical and cultural student clubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="rounded-3xl bg-[#2A1713] border border-[#5A3828]/60 p-6 shadow-xl flex flex-col justify-between hover:border-[#C8963E]/60 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C8963E] mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#EADCC4] leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#4E322C] flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C8963E]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#FBF3E4] block">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-[#A9805E] block">
                      {t.major}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------- PLATFORM NAVIGATION LINKS & DETAILS ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#4E322C]">
          
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8963E] to-[#A9805E] flex items-center justify-center text-[#3E2723] shadow-md">
                <Compass className="w-5 h-5 text-[#3E2723]" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#FBF3E4]">
                Worth<span className="text-[#C8963E]">While</span>
              </span>
            </div>
            
            <p className="text-sm text-[#EADCC4] max-w-sm leading-relaxed font-normal">
              "Don't just find events. Find the ones worth your time." The campus discovery platform evaluating relevance, verified organizer claims, and peer evidence.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#C8963E] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#C8963E]" />
              <span>Evidence-based verification · Real peer feedback</span>
            </div>
          </div>

          {/* Col 3: PLATFORM */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C8963E] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EADCC4]">
              <li>
                <button onClick={() => navigateTo('discover')} className="hover:text-white transition-colors">
                  Discover Events
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('freetime')} className="hover:text-white transition-colors">
                  2-Hour Free Window
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('heatmap')} className="hover:text-white transition-colors">
                  Campus Heatmap
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('compare')} className="hover:text-white transition-colors">
                  Multi-Event Compare
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: STUDENTS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C8963E] mb-4">
              Students
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EADCC4]">
              <li>
                <button onClick={() => navigateTo('myevents')} className="hover:text-white transition-colors">
                  Activity Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => setIsGoalsModalOpen(true)} className="hover:text-white transition-colors">
                  Semester Goals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('myevents')} className="hover:text-white transition-colors">
                  Saved Bookmarks
                </button>
              </li>
              <li>
                <span className="text-[#EADCC4]/60">Verified Co-Curricular Record</span>
              </li>
            </ul>
          </div>

          {/* Col 5: ORGANIZERS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C8963E] mb-4">
              Organizers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EADCC4]">
              <li>
                <button onClick={() => navigateTo('organizer')} className="hover:text-white transition-colors">
                  Organizer Dashboard
                </button>
              </li>
              <li>
                <span className="text-[#EADCC4]/60">Claim Verification Protocol</span>
              </li>
              <li>
                <span className="text-[#EADCC4]/60">Attendance Analytics</span>
              </li>
              <li>
                <span className="text-[#EADCC4]/60">Punctuality Scorecard</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EADCC4]/70 gap-4">
          <p>© 2026 WorthWhile Campus Intelligence Inc. Built for undergraduate & graduate academic life.</p>
          <div className="flex items-center gap-1 text-[#EADCC4]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C8963E] fill-current" />
            <span>for students seeking high-ROI campus time.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

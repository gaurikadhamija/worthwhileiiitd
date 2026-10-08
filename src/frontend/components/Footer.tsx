import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext.js';

export const Footer: React.FC = () => {
  const { navigateTo, setIsGoalsModalOpen } = useApp();

  return (
    <footer className="bg-[#241510] text-[#F4EBDD] border-t border-[#5A3828]/60 pt-16 pb-12 px-4 sm:px-6 lg:px-8 shadow-2xl">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#6B1E23]/30">
          
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#6B1E23] flex items-center justify-center text-[#FFFDF8]">
                <Compass className="w-4 h-4 text-[#F4EBDD]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFFDF8]">
                WorthWhile
              </span>
            </div>
            
            <p className="text-sm text-[#E8DCC8]/80 max-w-sm leading-relaxed font-light">
              "Don't just find events. Find the ones worth your time." The campus discovery platform evaluating relevance, verified organizer claims, and peer evidence.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#B99A6B]">
              <ShieldCheck className="w-4 h-4 text-[#B99A6B]" />
              <span>Evidence-based verification · Real peer feedback</span>
            </div>
          </div>

          {/* Col 3: PLATFORM */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B99A6B] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCC8]/90">
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
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B99A6B] mb-4">
              Students
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCC8]/90">
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
                <span className="text-[#E8DCC8]/50">Verified Co-Curricular Record</span>
              </li>
            </ul>
          </div>

          {/* Col 5: ORGANIZERS */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B99A6B] mb-4">
              Organizers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCC8]/90">
              <li>
                <button onClick={() => navigateTo('organizer')} className="hover:text-white transition-colors">
                  Organizer Dashboard
                </button>
              </li>
              <li>
                <span className="text-[#E8DCC8]/50">Claim Verification Protocol</span>
              </li>
              <li>
                <span className="text-[#E8DCC8]/50">Attendance Analytics</span>
              </li>
              <li>
                <span className="text-[#E8DCC8]/50">Punctuality Scorecard</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8DCC8]/60 gap-4">
          <p>© 2026 WorthWhile Campus Intelligence Inc. Built for undergraduate & graduate academic life.</p>
          <div className="flex items-center gap-1 text-[#E8DCC8]/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#8B2C33] fill-current" />
            <span>for students seeking high-ROI campus time.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

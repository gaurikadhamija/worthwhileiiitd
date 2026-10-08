import React, { useEffect, useRef } from 'react';
import { ArrowRight, Clock, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { RelevanceScoreRing } from './RelevanceScoreRing.js';

// Continuously moving coffee & wine atmospheric background canvas
const CoffeeAtmosphereCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 650);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 650;
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Organic coffee, mocha, caramel & velvet wine liquid blobs
    const blobs = [
      { x: width * 0.15, y: height * 0.25, r: 360, vx: 0.00028, vy: 0.00034, color: 'rgba(36, 21, 16, 0.72)' },   // Deep espresso
      { x: width * 0.75, y: height * 0.35, r: 420, vx: 0.00022, vy: 0.00030, color: 'rgba(58, 33, 24, 0.65)' },   // Dark coffee
      { x: width * 0.45, y: height * 0.70, r: 380, vx: 0.00032, vy: 0.00024, color: 'rgba(122, 85, 64, 0.58)' },  // Medium mocha
      { x: width * 0.85, y: height * 0.65, r: 320, vx: 0.00025, vy: 0.00032, color: 'rgba(166, 124, 91, 0.48)' }, // Warm caramel
      { x: width * 0.30, y: height * 0.80, r: 300, vx: 0.00030, vy: 0.00026, color: 'rgba(107, 30, 35, 0.40)' },  // Subtle velvet wine
      { x: width * 0.60, y: height * 0.20, r: 260, vx: 0.00035, vy: 0.00028, color: 'rgba(232, 220, 200, 0.28)' }, // Warm cream highlight
    ];

    // Floating warm amber & mocha particles
    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.4 + 1.0,
      speedY: Math.random() * 0.28 + 0.12,
      swing: Math.random() * 1.6 + 0.6,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.4 + 0.18,
      color: Math.random() > 0.45 ? 'rgba(166, 124, 91,' : 'rgba(232, 220, 200,',
    }));

    // Floating translucent coffee crema rings
    const rings = [
      { x: width * 0.25, y: height * 0.35, r: 120, vx: 0.0002, vy: 0.00025, phase: 0 },
      { x: width * 0.78, y: height * 0.60, r: 150, vx: 0.00018, vy: 0.0002, phase: 2.2 },
    ];

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // Base rich multi-stop coffee gradient foundation
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#241510');    // Deep espresso
      baseGrad.addColorStop(0.35, '#3A2118'); // Dark coffee
      baseGrad.addColorStop(0.65, '#5A3828'); // Coffee brown
      baseGrad.addColorStop(0.90, '#7A5540'); // Medium mocha
      baseGrad.addColorStop(1, '#A67C5B');    // Warm caramel
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Render drifting organic coffee & wine blobs
      blobs.forEach((b, i) => {
        const motionX = prefersReducedMotion ? 0 : Math.sin(elapsed * b.vx + i) * 75;
        const motionY = prefersReducedMotion ? 0 : Math.cos(elapsed * b.vy + i * 1.4) * 60;
        const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(elapsed * 0.0003 + i) * 0.06;
        const curX = b.x + motionX;
        const curY = b.y + motionY;
        const curR = b.r * pulse;

        const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, curR);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.6, b.color.replace(/[\d\.]+\)$/, '0.15)'));
        grad.addColorStop(1, 'rgba(36, 21, 16, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(curX, curY, curR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animated café light sweep across hero
      if (!prefersReducedMotion) {
        const lightSweep = Math.sin(elapsed * 0.00016);
        const lightX = width * 0.45 + lightSweep * (width * 0.35);
        const lightY = height * 0.28 + Math.cos(elapsed * 0.00012) * (height * 0.15);
        const lightRadius = Math.max(width, height) * 0.5;

        const cafeLight = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius);
        cafeLight.addColorStop(0, 'rgba(232, 220, 200, 0.22)'); // Soft warm café light
        cafeLight.addColorStop(0.4, 'rgba(166, 124, 91, 0.12)'); // Amber halo
        cafeLight.addColorStop(0.75, 'rgba(107, 30, 35, 0.06)'); // Subtle wine edge
        cafeLight.addColorStop(1, 'rgba(36, 21, 16, 0)');
        ctx.fillStyle = cafeLight;
        ctx.fillRect(0, 0, width, height);
      }

      // Translucent crema rings
      rings.forEach((r, idx) => {
        const ringX = prefersReducedMotion ? r.x : r.x + Math.sin(elapsed * r.vx + r.phase) * 40;
        const ringY = prefersReducedMotion ? r.y : r.y + Math.cos(elapsed * r.vy + r.phase) * 30;
        ctx.strokeStyle = idx === 0 ? 'rgba(166, 124, 91, 0.18)' : 'rgba(232, 220, 200, 0.14)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ringX, ringY, r.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Floating warm particles
      particles.forEach(p => {
        if (!prefersReducedMotion) {
          p.y -= p.speedY;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
        const sway = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.001 + p.phase) * p.swing;
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x + sway, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: 'blur(20px)', transform: 'scale(1.04)' }}
    />
  );
};

export const HeroWine: React.FC = () => {
  const { navigateTo, setIsGoalsModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden bg-[#241510] text-[#FFFDF8] pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#5A3828]/50 shadow-2xl">
      
      {/* ----------------- CONTINUOUSLY MOVING COFFEE ATMOSPHERIC BACKGROUND ----------------- */}
      <CoffeeAtmosphereCanvas />

      {/* Organic Curved Vector Lines for Coffee Steam & Crema Depth */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none animate-float-slow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
      >
        <path
          d="M-40,200 C300,100 450,380 800,240 C1150,110 1260,320 1480,220"
          fill="none"
          stroke="#A67C5B"
          strokeWidth="1.5"
          strokeDasharray="8 10"
        />
        <path
          d="M-20,460 C240,320 560,600 940,420 C1200,300 1340,540 1460,450"
          fill="none"
          stroke="#E8DCC8"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      </svg>

      {/* Subtle fine paper / roasted coffee texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#E8DCC8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* ----------------- EDITORIAL COFFEEHOUSE CONTENT (REFERENCE 1) ----------------- */}
      <div className="relative mx-auto max-w-7xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Small uppercase tag with wine badge accent */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3A2118]/85 border border-[#A67C5B]/40 shadow-md backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E8DCC8]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8DCC8]">
                Campus Event Intelligence Platform
              </span>
            </div>

            {/* Display Typography (Cormorant Garamond) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#FFFDF8] leading-[1.08] text-balance drop-shadow-sm">
              Don't just find events.{' '}
              <span className="block mt-1 text-[#E8A598] italic drop-shadow-sm">
                Find the ones worth your time.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="max-w-xl text-base sm:text-lg text-[#E8DCC8]/90 font-light leading-relaxed">
              Discover, compare and verify campus events based on what actually matters to you: personalized relevance scores, organizer trust, verified student evidence, and strict time availability.
            </p>

            {/* Action Buttons: Wine gradient CTA & Warm cream secondary */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('discover-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6B1E23] to-[#8B2C33] text-[#FFFDF8] font-semibold text-sm shadow-lg hover:from-[#8B2C33] hover:to-[#A3343C] hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#9A1B28]/60"
              >
                <span>Find My Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('freetime')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF4EB] hover:bg-[#F0E4D2] text-[#2A1B16] font-semibold text-sm border border-[#CDB8A0] shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Clock className="w-4 h-4 text-[#6B1E23]" />
                <span>I Have 2 Hours Free</span>
              </button>
            </div>

            {/* Quick Goals Trigger Prompt */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#E8DCC8]/85">
              <span>Optimized for:</span>
              <button
                onClick={() => setIsGoalsModalOpen(true)}
                className="underline hover:text-white font-semibold text-[#E8A598] transition-colors"
              >
                Internship Hunt + Hands-on AI Projects (Edit Goals)
              </button>
            </div>
          </div>

          {/* Right Column: Floating Cream Editorial Cards (Reference 1 Composition) */}
          <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
            
            {/* Ambient Backlight Glow behind floating cards */}
            <div className="absolute w-72 h-72 rounded-full bg-[#A67C5B]/25 blur-3xl pointer-events-none" />

            {/* Card 1: 91 RELEVANCE (Floating top right) */}
            <div
              onClick={() => navigateTo('event-details', 'evt_genai_masterclass')}
              className="absolute top-2 right-2 sm:right-6 w-64 bg-[#FFFDF9] text-[#1A0D08] rounded-2xl p-4 shadow-2xl border border-[#CDB8A0] hover:border-[#6B1E23] animate-float-slow cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B1E23]">
                  91 Relevance Match
                </span>
                <RelevanceScoreRing score={91} size="sm" showLabel={false} />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#1A0D08] line-clamp-1">
                Building Production LLM Agents
              </h4>
              <p className="text-[11px] text-[#331C13] mt-1 leading-snug">
                Strong match for you · 96% learning value & hands-on tool loops.
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#E8DCC8] flex items-center justify-between text-[10px] text-[#5A3828]">
                <span>IIT Delhi · Dogra Hall</span>
                <span className="font-bold text-[#6B1E23]">94.5% Org Trust</span>
              </div>
            </div>

            {/* Card 2: VERIFIED CLAIM (Floating bottom left) */}
            <div className="absolute bottom-4 left-0 sm:left-4 w-64 bg-[#FFFDF9] text-[#1A0D08] rounded-2xl p-4 shadow-2xl border border-[#CDB8A0] animate-float-gentle cursor-default">
              <div className="flex items-center gap-1.5 text-[#1B4D3E] text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>✓ VERIFIED CLAIM</span>
              </div>
              <p className="text-xs font-bold text-[#1A0D08]">
                "Certificate Provided & Working Repo"
              </p>
              <div className="mt-2 text-[11px] text-[#331C13] flex items-center justify-between">
                <span>94% student confirmation</span>
                <span className="font-bold text-[#1A0D08]">48 Verified Peers</span>
              </div>
              <div className="mt-1.5 w-full bg-[#E8DCC8]/60 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#1B4D3E] rounded-full w-[94%]" />
              </div>
            </div>

            {/* Card 3: TODAY · 4:00 PM Startup Meetup (Center Floating Card) */}
            <div
              onClick={() => navigateTo('event-details', 'evt_startup_pitch_mixer')}
              className="z-10 w-72 bg-[#FFFDF9] text-[#1A0D08] rounded-2xl p-5 shadow-2xl border-2 border-[#CDB8A0] hover:border-[#6B1E23] transition-all cursor-pointer hover:scale-105"
            >
              <div className="flex items-center justify-between text-[11px] text-[#6B1E23] font-bold uppercase tracking-wider mb-1.5">
                <span>TODAY · 4:00 PM</span>
                <span className="bg-[#6B1E23]/15 text-[#6B1E23] px-2 py-0.5 rounded text-[10px] font-bold">
                  Surge Demand
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#1A0D08]">
                Founders & Angel Pitch Mixer
              </h4>
              <p className="text-xs text-[#331C13] mt-1 line-clamp-2">
                12 student ventures pitch for $50k grants with angel investors.
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#E8DCC8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#331C13]">
                  <Compass className="w-3.5 h-3.5 text-[#6B1E23]" />
                  <span className="font-medium">India Habitat Centre</span>
                </div>
                <span className="font-bold text-[#6B1E23]">
                  Networking · Career
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

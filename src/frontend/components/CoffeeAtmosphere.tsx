import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.js';

interface Props {
  intensity?: 'high' | 'medium' | 'subtle';
}

export const CoffeeAtmosphere: React.FC<Props> = ({ intensity = 'medium' }) => {
  const { activePage } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Section-aware intensity tuning
  const pageIntensity = activePage === 'heatmap' 
    ? 'subtle' 
    : activePage === 'discover' 
      ? 'high' 
      : intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Organic coffee and wine atmospheric blobs
    const blobs = [
      {
        x: width * 0.15,
        y: height * 0.25,
        radius: 420,
        vx: 0.00032,
        vy: 0.00038,
        colorStart: 'rgba(58, 33, 24, 0.40)', // Deep espresso wash
        colorEnd: 'rgba(58, 33, 24, 0)',
        phase: 0,
      },
      {
        x: width * 0.85,
        y: height * 0.35,
        radius: 450,
        vx: 0.00025,
        vy: 0.00034,
        colorStart: 'rgba(122, 85, 64, 0.35)', // Medium mocha warmth
        colorEnd: 'rgba(122, 85, 64, 0)',
        phase: 2.1,
      },
      {
        x: width * 0.5,
        y: height * 0.8,
        radius: 480,
        vx: 0.00035,
        vy: 0.00028,
        colorStart: 'rgba(166, 124, 91, 0.38)', // Warm caramel light
        colorEnd: 'rgba(166, 124, 91, 0)',
        phase: 4.3,
      },
      {
        x: width * 0.35,
        y: height * 0.55,
        radius: 380,
        vx: 0.00040,
        vy: 0.00030,
        colorStart: 'rgba(36, 21, 16, 0.45)', // Dark coffee depth
        colorEnd: 'rgba(36, 21, 16, 0)',
        phase: 1.5,
      },
      {
        x: width * 0.78,
        y: height * 0.72,
        radius: 360,
        vx: 0.00028,
        vy: 0.00036,
        colorStart: 'rgba(107, 30, 35, 0.32)', // Subtle velvet wine accent
        colorEnd: 'rgba(107, 30, 35, 0)',
        phase: 3.4,
      },
    ];

    // Floating subtle warm particles (like rising warm coffee aroma)
    const particleCount = pageIntensity === 'high' ? 32 : 18;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.4 + 1.0,
      speedY: Math.random() * 0.28 + 0.12,
      swing: Math.random() * 2.0 + 0.8,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.38 + 0.18,
      color: Math.random() > 0.4 ? 'rgba(166, 124, 91,' : 'rgba(232, 220, 200,',
    }));

    // Floating subtle translucent coffee rings
    const rings = [
      { x: width * 0.22, y: height * 0.4, r: 85, vx: 0.0002, vy: 0.00025, phase: 0.8 },
      { x: width * 0.72, y: height * 0.65, r: 110, vx: 0.00018, vy: 0.00022, phase: 2.5 },
      { x: width * 0.45, y: height * 0.2, r: 70, vx: 0.00022, vy: 0.00018, phase: 4.1 },
    ];

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // LAYER 1: Base Warm Coffee Gradient Foundation
      // Warm roasted café parchment: Rich coffee cream -> Warm mocha -> Warm caramel
      // -------------------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, width * 0.4, height);
      if (pageIntensity === 'high') {
        bgGrad.addColorStop(0, '#241510');    // Deep espresso
        bgGrad.addColorStop(0.25, '#3A2118'); // Dark coffee
        bgGrad.addColorStop(0.55, '#5A3828'); // Coffee brown & mocha
        bgGrad.addColorStop(0.80, '#8C5E40'); // Warm caramel
        bgGrad.addColorStop(1, '#C2A380');    // Warm toasted crema paper
      } else if (pageIntensity === 'subtle') {
        bgGrad.addColorStop(0, '#2C1810');
        bgGrad.addColorStop(0.40, '#4A2A1E');
        bgGrad.addColorStop(0.75, '#734A35');
        bgGrad.addColorStop(1, '#B09072');
      } else {
        bgGrad.addColorStop(0, '#261611');
        bgGrad.addColorStop(0.35, '#3E241A');
        bgGrad.addColorStop(0.70, '#664230');
        bgGrad.addColorStop(1, '#A8886A');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // LAYER 2: Large Slowly Drifting Organic Coffee & Wine Blobs
      // -------------------------------------------------------------
      blobs.forEach((b, i) => {
        const driftX = prefersReducedMotion ? 0 : Math.sin(elapsed * b.vx + b.phase) * 75;
        const driftY = prefersReducedMotion ? 0 : Math.cos(elapsed * b.vy + b.phase * 1.3) * 60;
        const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(elapsed * 0.0003 + i) * 0.08;
        const curX = b.x + driftX;
        const curY = b.y + driftY;
        const curR = b.radius * pulse;

        const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, curR);
        grad.addColorStop(0, b.colorStart);
        grad.addColorStop(0.6, b.colorStart.replace(/[\d\.]+\)$/, '0.12)'));
        grad.addColorStop(1, b.colorEnd);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(curX, curY, curR, 0, Math.PI * 2);
        ctx.fill();
      });

      // -------------------------------------------------------------
      // LAYER 3: Animated Café Lighting Sweep
      // Warm amber/caramel orbital light beam slowly sweeping
      // -------------------------------------------------------------
      if (!prefersReducedMotion) {
        const sweepProgress = Math.sin(elapsed * 0.00018); // ~35 second cycle
        const lightX = width * 0.5 + sweepProgress * (width * 0.35);
        const lightY = height * 0.3 + Math.cos(elapsed * 0.00014) * (height * 0.18);
        const lightRadius = Math.max(width, height) * 0.55;

        const lightGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius);
        lightGrad.addColorStop(0, 'rgba(232, 204, 168, 0.18)'); // Soft warm café light center
        lightGrad.addColorStop(0.35, 'rgba(166, 124, 91, 0.10)'); // Caramel halo
        lightGrad.addColorStop(0.7, 'rgba(107, 30, 35, 0.05)');   // Subtle wine edge tint
        lightGrad.addColorStop(1, 'rgba(36, 21, 16, 0)');

        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // -------------------------------------------------------------
      // LAYER 4: Floating Translucent Rings & Curved Linework
      // -------------------------------------------------------------
      rings.forEach((r, idx) => {
        const ringX = prefersReducedMotion ? r.x : r.x + Math.sin(elapsed * r.vx + r.phase) * 35;
        const ringY = prefersReducedMotion ? r.y : r.y + Math.cos(elapsed * r.vy + r.phase) * 25;
        ctx.strokeStyle = idx === 1 ? 'rgba(107, 30, 35, 0.14)' : 'rgba(232, 220, 200, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ringX, ringY, r.r, 0, Math.PI * 2);
        ctx.stroke();

        // Inner echo ring
        ctx.strokeStyle = 'rgba(166, 124, 91, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ringX, ringY, r.r * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      });

      // -------------------------------------------------------------
      // LAYER 5: Floating Subtle Warm Particles
      // -------------------------------------------------------------
      particles.forEach(p => {
        if (!prefersReducedMotion) {
          p.y -= p.speedY;
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
        }
        const sway = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.0008 + p.phase) * p.swing;
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x + sway, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pageIntensity]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* HTML5 Canvas Active Ambient Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 2: Visibly Moving Glowing Mocha & Caramel Atmospheric Orbs (GPU Composite) */}
      <div className="absolute -top-24 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#C49A6C]/30 via-[#A67C5B]/20 to-transparent blur-3xl pointer-events-none animate-coffee-drift-1" />
      <div className="absolute top-[35%] -right-24 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#7A5540]/25 via-[#A67C5B]/20 to-transparent blur-3xl pointer-events-none animate-coffee-drift-2" />
      <div className="absolute bottom-10 left-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#6B1E23]/18 via-[#8C4A28]/20 to-transparent blur-3xl pointer-events-none animate-cafe-light" />
      <div className="absolute top-[60%] left-[45%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#D8B48D]/25 to-transparent blur-2xl pointer-events-none animate-coffee-pulse" />

      {/* Organic Curved Line Vectors (Steam & Crema Contours) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none animate-float-slow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-50,250 C320,120 480,420 820,290 C1160,160 1280,380 1500,280"
          fill="none"
          stroke="#A67C5B"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <path
          d="M-30,580 C260,420 590,720 980,540 C1250,420 1380,680 1520,590"
          fill="none"
          stroke="#7A5540"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        <path
          d="M100,-20 C220,280 440,160 620,440 C800,720 1100,560 1350,880"
          fill="none"
          stroke="#6B1E23"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
      </svg>

      {/* Subtle Grain Overlay for Editorial Luxury Paper Feel */}
      <div className="absolute inset-0 bg-coffee-grain opacity-20 mix-blend-overlay pointer-events-none" />
    </div>
  );
};

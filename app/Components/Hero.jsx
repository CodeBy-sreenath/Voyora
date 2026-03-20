'use client';
import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const STATS = [
  { value: '2.4M+', label: 'Trips Planned' },
  { value: '190+',  label: 'Countries' },
  { value: '4.9 ★', label: 'Avg Rating' },
];

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.phase += s.speed;
        const alpha = ((Math.sin(s.phase) + 1) / 2) * 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,234,216,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(8,14,26,0.75),rgba(8,14,26,0.5),var(--dusk))' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(8,14,26,0.4),transparent,rgba(8,14,26,0.4))' }} />

      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(196,154,80,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(14,165,233,0.04)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 900, margin: '0 auto', paddingTop: 80 }}>

        <div className="tag-pill fade-up" style={{ marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          Powered by Claude AI
        </div>

        <h1 className="fade-up" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.4rem,7vw,5.5rem)', fontWeight: 700, lineHeight: 1.12, marginBottom: 20, animationDelay: '0.1s' }}>
          <span className="text-gradient">Your Dream Trip,</span><br />
          <em style={{ color: 'rgba(242,234,216,0.88)', fontStyle: 'italic', fontWeight: 400 }}>Planned in Seconds.</em>
        </h1>

        <p className="fade-up" style={{ color: 'rgba(242,234,216,0.55)', fontSize: 'clamp(1rem,2.2vw,1.15rem)', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.75, animationDelay: '0.2s' }}>
          Enter your destination, travel dates, and budget. Our AI instantly crafts a personalised
          day-by-day itinerary with places to visit, eat, and stay.
        </p>

        <div className="fade-up" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56, animationDelay: '0.3s' }}>
          <a href="#planner" className="btn-gold" style={{ textDecoration: 'none' }}>Start Planning for Free →</a>
          <a href="#how-it-works" className="btn-ghost">See How It Works</a>
        </div>

        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,6vw,72px)', flexWrap: 'wrap', animationDelay: '0.4s' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,234,216,0.35)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <a href="#planner" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(242,234,216,0.3)', textDecoration: 'none', animation: 'float 3.5s ease-in-out infinite' }}>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>scroll</span>
        <ArrowDown size={15} />
      </a>
    </section>
  );
}
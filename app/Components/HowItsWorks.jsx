'use client';
import { MapPin, CalendarCheck, Wand2, Plane } from 'lucide-react';

const STEPS = [
  { Icon: MapPin,        num: '01', title: 'Enter Your Destination', grad: 'linear-gradient(135deg,#f59e0b,#ea580c)', desc: 'Type any city, country, or region. Be as specific or vague as you like — our AI understands context.' },
  { Icon: CalendarCheck, num: '02', title: 'Set Dates & Budget',      grad: 'linear-gradient(135deg,#38bdf8,#06b6d4)', desc: 'Choose your travel window and budget. We optimise every day to make your money go further.' },
  { Icon: Wand2,         num: '03', title: 'AI Builds Your Plan',     grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)', desc: 'In seconds, Claude AI crafts a day-by-day itinerary with activities, restaurants, and curated stays.' },
  { Icon: Plane,         num: '04', title: 'Travel & Explore',        grad: 'linear-gradient(135deg,#34d399,#059669)', desc: 'Download or share your itinerary, pack your bags, and set off on a perfectly planned adventure.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: 'clamp(60px,10vw,112px) 24px', position: 'relative' }}>
      <style>{`
        .step-card { transition: transform 0.3s ease; }
        .step-card:hover { transform: translateY(-4px); }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,var(--dusk),rgba(17,24,39,0.5),var(--dusk))' }} />

      <div style={{ position: 'relative', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,7vw,72px)' }}>
          <span className="tag-pill" style={{ marginBottom: 14 }}>Simple Process</span>
          <h2 className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, marginTop: 12, marginBottom: 12 }}>
            How Voyara Works
          </h2>
          <p style={{ color: 'rgba(242,234,216,0.5)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            From dream destination to full itinerary in under 30 seconds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
          {STEPS.map(({ Icon, num, title, desc, grad }) => (
            <div key={num} className="glass step-card" style={{ borderRadius: 24, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: 12, right: 16, fontFamily: "'DM Mono',monospace", fontSize: '3.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none' }}>{num}</span>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon size={22} color="#fff" strokeWidth={2} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--sand)', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(242,234,216,0.5)', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

const REVIEWS = [
  { quote: "I planned a 10-day Japan trip in 45 seconds. Better than anything I'd have researched in weeks.", name: 'Sarah M.', role: 'Photographer, New York', init: 'SM', dest: 'Tokyo & Kyoto', grad: 'linear-gradient(135deg,#f59e0b,#ea580c)' },
  { quote: "The AI found restaurants and hidden gems I'd never have discovered alone. My Bali trip was magical.", name: 'James K.', role: 'Freelancer, London', init: 'JK', dest: 'Bali, Indonesia', grad: 'linear-gradient(135deg,#38bdf8,#0ea5e9)' },
  { quote: 'Travelling as 6 on a tight budget — Voyara nailed it. Found cheap but incredible stays for all of us.', name: 'Priya R.', role: 'Teacher, Toronto', init: 'PR', dest: 'Southeast Asia', grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
];

export default function Testimonials() {
  return (
    <section style={{ padding: 'clamp(60px,10vw,112px) 24px', position: 'relative' }}>
      <style>{`
        .review-card { transition: transform 0.3s ease; }
        .review-card:hover { transform: translateY(-4px); }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,var(--dusk),rgba(17,24,39,0.4),var(--dusk))' }} />
      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,6vw,60px)' }}>
          <span className="tag-pill" style={{ marginBottom: 14 }}>Loved by Travellers</span>
          <h2 className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, marginTop: 12 }}>
            What People Are Saying
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 20 }}>
          {REVIEWS.map(r => (
            <div key={r.name} className="glass review-card" style={{ borderRadius: 24, padding: '28px 26px' }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{s}</span>)}
              </div>
              <blockquote style={{ color: 'rgba(242,234,216,0.65)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>"{r.quote}"</blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{r.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sand)' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.38)' }}>{r.role}</div>
                </div>
                <span className="tag-pill" style={{ flexShrink: 0 }}>{r.dest}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
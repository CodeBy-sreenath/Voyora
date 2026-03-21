'use client';

const DESTS = [
  { name: 'Kyoto',        country: 'Japan',     tag: 'Cultural',  from: 'From $1,200', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80' },
  { name: 'Santorini',    country: 'Greece',    tag: 'Romantic',  from: 'From $1,800', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80' },
  { name: 'Bali',         country: 'Indonesia', tag: 'Adventure', from: 'From $900',   img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80' },
  { name: 'Marrakech',    country: 'Morocco',   tag: 'Foodie',    from: 'From $700',   img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80' },
  { name: 'Patagonia',    country: 'Argentina', tag: 'Nature',    from: 'From $2,000', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80' },
  { name: 'Amalfi Coast', country: 'Italy',     tag: 'Luxury',    from: 'From $2,500', img: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=700&q=80' },
];

function DestCard({ name, country, tag, from, img }) {
  return (
    <div className="dest-card" style={{ aspectRatio: '4/3', cursor: 'pointer' }}>
      <img src={img} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div className="dest-overlay" />
      <div style={{ position: 'absolute', top: 14, left: 14 }}>
        <span className="tag-pill">{tag}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px' }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{name}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>{country}</span>
          <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>{from}</span>
        </div>
        <a href="#planner" className="dest-cta" style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 12, color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
          Plan This Trip →
        </a>
      </div>
    </div>
  );
}

export default function FeaturedDestinations() {
  return (
    <section id="destinations" style={{ padding: 'clamp(60px,10vw,112px) 24px', position: 'relative' }}>
      <style>{`
        .dest-card { position: relative; border-radius: 24px; overflow: hidden; }
        .dest-card img { transition: transform 0.6s ease; width: 100%; height: 100%; object-fit: cover; }
        .dest-card:hover img { transform: scale(1.08); }
        .dest-cta { opacity: 0; transform: translateY(8px); transition: opacity 0.3s, transform 0.3s; }
        .dest-card:hover .dest-cta { opacity: 1 !important; transform: translateY(0) !important; }
        .dest-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,14,26,0.85) 0%, rgba(8,14,26,0.1) 60%, transparent 100%);
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,var(--dusk),rgba(17,24,39,0.5),var(--dusk))' }} />

      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,6vw,64px)' }}>
          <span className="tag-pill" style={{ marginBottom: 14 }}>Trending Now</span>
          <h2 className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, marginTop: 12, marginBottom: 12 }}>
            Popular Destinations
          </h2>
          <p style={{ color: 'rgba(242,234,216,0.5)', fontSize: '1rem', maxWidth: 440, margin: '0 auto' }}>
            Explore where our travellers are heading this season.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {DESTS.map(d => <DestCard key={d.name} {...d} />)}
        </div>
      </div>
    </section>
  );
}
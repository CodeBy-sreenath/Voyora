'use client';
import { Compass, Twitter, Instagram, Youtube } from 'lucide-react';

const COLS = [
  { title: 'Product', links: ['How It Works', 'Destinations', 'Pricing', 'API'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(48px,8vw,80px) 24px 32px' }}>
      <style>{`
        .footer-link { font-size: 0.875rem; color: rgba(242,234,216,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: rgba(242,234,216,0.75); }
        .footer-legal { font-size: 0.78rem; color: rgba(242,234,216,0.28); text-decoration: none; transition: color 0.2s; }
        .footer-legal:hover { color: rgba(242,234,216,0.55); }
        .social-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:rgba(242,234,216,0.38); transition:color 0.2s; text-decoration:none; }
        .social-icon:hover { color: var(--sand); }
      `}</style>

      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40, marginBottom: 48 }}>

          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={16} color="#0f172a" strokeWidth={2.5} />
              </div>
              <span className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Voyara</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(242,234,216,0.38)', lineHeight: 1.7, maxWidth: 280 }}>
              AI-powered travel planning that turns your dream destinations into perfectly crafted itineraries in seconds.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="glass social-icon">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(196,154,80,0.65)', marginBottom: 16 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="footer-link">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.7rem', color: 'rgba(242,234,216,0.28)' }}>© 2025 Voyara · Powered by Claude AI</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" className="footer-legal">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
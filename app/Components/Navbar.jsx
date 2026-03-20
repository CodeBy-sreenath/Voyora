'use client';
import { useState, useEffect } from 'react';
import { Compass, Menu, X } from 'lucide-react';

const NAV_LINKS = ['How It Works', 'Destinations', 'Pricing', 'Blog'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.4s ease',
      padding: scrolled ? '10px 0' : '20px 0',
      background: scrolled ? 'rgba(8,14,26,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={18} color="#0f172a" strokeWidth={2.5} />
          </div>
          <span className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700 }}>Voyara</span>
        </a>

        <div style={{ display: 'flex', gap: 32 }} className="desk-nav">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" style={{ color: 'rgba(242,234,216,0.55)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--sand)'}
              onMouseLeave={e => e.target.style.color = 'rgba(242,234,216,0.55)'}
            >{l}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }} className="desk-nav">
          <a href="#" style={{ color: 'rgba(242,234,216,0.5)', fontSize: '0.88rem', textDecoration: 'none' }}>Sign in</a>
          <a href="#planner" className="btn-gold" style={{ padding: '9px 22px', fontSize: '0.85rem', borderRadius: 999 }}>Plan a Trip</a>
        </div>

        <button onClick={() => setOpen(!open)} className="mob-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sand)', display: 'none' }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ background: 'rgba(8,14,26,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href="#" onClick={() => setOpen(false)}
              style={{ color: 'rgba(242,234,216,0.65)', fontSize: '1rem', textDecoration: 'none' }}>{l}</a>
          ))}
          <a href="#planner" onClick={() => setOpen(false)} className="btn-gold"
            style={{ marginTop: 4, textDecoration: 'none', borderRadius: 14, padding: '13px 0', textAlign: 'center' }}>
            Plan a Trip →
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .mob-btn  { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { Compass, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Destinations', href: '#destinations'  },
  { label: 'Plan a Trip',  href: '#planner'        },
 // { label: 'Testimonials', href: '#testimonials'   },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.4s ease',
      padding: scrolled ? '10px 0' : '20px 0',
      background: scrolled ? 'rgba(8,14,26,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      <style>{`
        .nav-link {
          color: rgba(242,234,216,0.55); font-size: 0.88rem;
          text-decoration: none; transition: color 0.2s;
          cursor: pointer; background: none; border: none;
          font-family: 'DM Sans', sans-serif; padding: 0;
        }
        .nav-link:hover { color: var(--sand); }

        .mob-link {
          color: rgba(242,234,216,0.65); font-size: 1rem;
          text-decoration: none; cursor: pointer;
          background: none; border: none;
          font-family: 'DM Sans', sans-serif; text-align: left; padding: 0;
        }
        .mob-link:hover { color: var(--sand); }

        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .mob-btn  { display: flex !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={18} color="#0f172a" strokeWidth={2.5} />
          </div>
          <span className="text-gradient" style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700 }}>Voyara</span>
        </a>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desk-nav">
          {NAV_LINKS.map(({ label, href }) => (
            <button key={label} className="nav-link" onClick={() => handleNav(href)}>{label}</button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="mob-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sand)', display: 'none' }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: 'rgba(8,14,26,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <button key={label} className="mob-link" onClick={() => handleNav(href)}>{label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}
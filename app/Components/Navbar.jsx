'use client';
import { useState, useEffect } from 'react';
import { Compass, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
//import AuthModal from './AuthModal';
import AuthModal from '../Components/AuthModels';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Destinations', href: '#destinations'  },
  { label: 'Plan a Trip',  href: '#planner'        },
  { label: 'Testimonials', href: '#testimonials'   },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [open,       setOpen]       = useState(false);
  const [showAuth,   setShowAuth]   = useState(false);
  const [authMode,   setAuthMode]   = useState('signin');
  const [user,       setUser]       = useState(null);
  const [showDrop,   setShowDrop]   = useState(false);

  // Restore session on mount
  useEffect(() => {
    const session = localStorage.getItem('voyara_session');
    if (session) setUser(JSON.parse(session));
  }, []);

  // Scroll listener
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const fn = (e) => {
      if (!e.target.closest('.user-menu')) setShowDrop(false);
    };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openSignIn = () => { setAuthMode('signin'); setShowAuth(true); setOpen(false); };
  const openSignUp = () => { setAuthMode('signup'); setShowAuth(true); setOpen(false); };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('voyara_session');
    setUser(null);
    setShowDrop(false);
  };

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <>
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

          .user-avatar {
            width: 34px; height: 34px; border-radius: 50%;
            background: linear-gradient(135deg,#f59e0b,#d97706);
            display: flex; align-items: center; justify-content: center;
            color: #0f172a; font-weight: 700; font-size: 0.75rem;
            cursor: pointer; border: 2px solid rgba(196,154,80,0.3);
            transition: border-color 0.2s;
          }
          .user-avatar:hover { border-color: rgba(196,154,80,0.7); }

          .dropdown {
            position: absolute; top: calc(100% + 10px); right: 0;
            background: linear-gradient(160deg,#0f1c2e,#080e1a);
            border: 1px solid rgba(196,154,80,0.2);
            border-radius: 16px; padding: 8px;
            min-width: 200px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            animation: fadeUp 0.2s ease;
          }
          .drop-item {
            display: flex; align-items: center; gap: 10;
            padding: 10px 14px; border-radius: 10px;
            color: rgba(242,234,216,0.65); font-size: 0.875rem;
            cursor: pointer; background: none; border: none;
            font-family: 'DM Sans',sans-serif; width: 100%; text-align: left;
            transition: background 0.2s, color 0.2s;
          }
          .drop-item:hover { background: rgba(255,255,255,0.06); color: var(--sand); }
          .drop-item.danger:hover { background: rgba(239,68,68,0.1); color: rgba(252,165,165,0.9); }

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

          {/* Desktop right side */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }} className="desk-nav">
            {user ? (
              /* Logged-in user menu */
              <div className="user-menu" style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDrop(!showDrop)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="user-avatar">{initials}</div>
                  <span style={{ color: 'rgba(242,234,216,0.75)', fontSize: '0.88rem', fontFamily: "'DM Sans',sans-serif" }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} style={{ color: 'rgba(242,234,216,0.4)', transform: showDrop ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {showDrop && (
                  <div className="dropdown">
                    {/* User info header */}
                    <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 6 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sand)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.38)', marginTop: 2 }}>{user.email}</div>
                    </div>
                    <button className="drop-item" onClick={() => { handleNav('#planner'); setShowDrop(false); }}>
                      <Compass size={15} /> My Itineraries
                    </button>
                    <button className="drop-item" onClick={() => { handleNav('#planner'); setShowDrop(false); }}>
                      <User size={15} /> Profile
                    </button>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 8px' }} />
                    <button className="drop-item danger" onClick={handleSignOut}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest buttons */
              <>
                <button className="nav-link" onClick={openSignIn}>Sign In</button>
                <button className="btn-gold" onClick={openSignUp} style={{ padding: '9px 22px', fontSize: '0.85rem', borderRadius: 999 }}>
                  Get Started
                </button>
              </>
            )}
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
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="user-avatar" style={{ width: 36, height: 36 }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--sand)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.38)' }}>{user.email}</div>
                  </div>
                </div>
                <button className="mob-link" style={{ color: 'rgba(252,165,165,0.7)', display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleSignOut}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="mob-link" onClick={openSignIn}>Sign In</button>
                <button className="btn-gold" onClick={openSignUp} style={{ borderRadius: 14, padding: '13px 0', textAlign: 'center', width: '100%' }}>
                  Get Started →
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

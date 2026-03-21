'use client';
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Compass } from 'lucide-react';

export default function AuthModal({ mode = 'signin', onClose, onSuccess }) {
  const [tab, setTab]           = useState(mode); // 'signin' | 'signup'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    if (tab === 'signup' && !form.name.trim()) return 'Please enter your name.';
    if (!form.email.includes('@'))              return 'Please enter a valid email.';
    if (form.password.length < 6)              return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async () => {
  const err = validate();
  if (err) { setError(err); return; }
  setError('');
  setLoading(true);

  try {
    const endpoint = tab === 'signup'
      ? '/api/auth/signup'
      : '/api/auth/signin';

    const body = tab === 'signup'
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password };

    const res  = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      setLoading(false);
      return;
    }

    // Success — pass user up to Navbar
    onSuccess(data.user);

  } catch (err) {
    setError('Network error. Please check your connection.');
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,26,0.85)', backdropFilter: 'blur(8px)', zIndex: 200 }}
      />

      {/* Modal box */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 201, width: '100%', maxWidth: 440,
        margin: '0 16px',
        background: 'linear-gradient(160deg,#0f1c2e,#080e1a)',
        border: '1px solid rgba(196,154,80,0.2)',
        borderRadius: 28, padding: 'clamp(28px,5vw,44px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,234,216,0.4)', lineHeight: 1 }}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={16} color="#0f172a" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }} className="text-gradient">
            Voyara
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 4, marginBottom: 28 }}>
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 11, border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 500,
                transition: 'all 0.25s',
                background: tab === t ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'transparent',
                color: tab === t ? '#0f172a' : 'rgba(242,234,216,0.5)',
              }}
            >
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }} className="text-gradient">
          {tab === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(242,234,216,0.45)', marginBottom: 24 }}>
          {tab === 'signin' ? 'Sign in to access your saved itineraries.' : 'Join thousands of AI-powered travellers.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Name — signup only */}
          {tab === 'signup' && (
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(196,154,80,0.55)', pointerEvents: 'none' }} />
              <input
                className="travel-input"
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ paddingLeft: 42 }}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(196,154,80,0.55)', pointerEvents: 'none' }} />
            <input
              className="travel-input"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ paddingLeft: 42 }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(196,154,80,0.55)', pointerEvents: 'none' }} />
            <input
              className="travel-input"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ paddingLeft: 42, paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,234,216,0.35)', lineHeight: 1 }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        {tab === 'signin' && (
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(196,154,80,0.65)', fontSize: '0.8rem', fontFamily: "'DM Sans',sans-serif" }}>
              Forgot password?
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '10px 14px', fontSize: '0.82rem', color: 'rgba(252,165,165,0.9)' }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn-gold"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', marginTop: 20, borderRadius: 14, padding: '14px 0', fontSize: '0.95rem' }}
        >
          {loading
            ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> {tab === 'signin' ? 'Signing in…' : 'Creating account…'}</>
            : tab === 'signin' ? 'Sign In' : 'Create Account'
          }
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.3)' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google OAuth placeholder */}
        <button
          style={{
            width: '100%', padding: '12px 0', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)', color: 'rgba(242,234,216,0.75)',
            fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          onClick={() => setError('Google sign-in coming soon! Use email for now.')}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.7-2.9-11.3-8H6.3C9.6 39.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.8 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(242,234,216,0.25)', marginTop: 20 }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
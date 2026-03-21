'use client';
import { useState, useEffect } from 'react';
import {
  MapPin, Calendar, DollarSign, Users, Sparkles, Loader2,
  ChevronDown, ChevronUp, Utensils, Hotel, Clock, Camera,
  Share2, Download, AlertCircle, Bookmark,
  Package, Phone, CheckCircle,
} from 'lucide-react';

const STYLES = ['Cultural', 'Adventure', 'Relaxation', 'Foodie', 'Budget', 'Luxury'];

function daysBetween(a, b) {
  if (!a || !b) return null;
  const d = (new Date(b) - new Date(a)) / 86400000;
  return d > 0 ? Math.ceil(d) : null;
}

/* ── Form label ── */
function FormLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Mono',monospace", fontSize: '0.65rem',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'rgba(196,154,80,0.75)', marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

/* ── Input wrapper with icon ── */
function InputWrap({ icon, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 14, top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(196,154,80,0.55)', pointerEvents: 'none', zIndex: 1,
      }}>
        {icon}
      </div>
      {children}
    </div>
  );
}

/* ── Single day accordion card ── */
function DayCard({ day, isOpen, toggle }) {
  return (
    <div className="day-card glass">

      {/* Header */}
      <button onClick={toggle} style={{
        width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '18px 20px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="dot-gold">{day.day}</div>
          <div>
            <div style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: '1.05rem', fontWeight: 600, color: 'var(--sand)',
            }}>
              {day.theme}
            </div>
            <div style={{
              fontFamily: "'DM Mono',monospace", fontSize: '0.68rem',
              color: 'rgba(242,234,216,0.38)', marginTop: 3,
            }}>
              {day.date} · {day.estimatedDayCost}
            </div>
          </div>
        </div>
        {isOpen
          ? <ChevronUp   size={18} style={{ color: 'rgba(242,234,216,0.35)', flexShrink: 0 }} />
          : <ChevronDown size={18} style={{ color: 'rgba(242,234,216,0.35)', flexShrink: 0 }} />
        }
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ padding: '0 20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Highlights */}
          {day.highlights?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 14px' }}>
              {day.highlights.map((h, i) => (
                <span key={i} className="tag-pill">{h}</span>
              ))}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 18, marginTop: 4,
          }}>

            {/* Activities column */}
            <div>
              <div className="sub-label">Activities</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { time: 'Morning',   ...day.morning   },
                  { time: 'Afternoon', ...day.afternoon },
                  { time: 'Evening',   ...day.evening   },
                ].map(a => (
                  <div key={a.time} className="info-tile">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Clock size={13} style={{ color: 'rgba(196,154,80,0.55)', marginTop: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.63rem', color: 'rgba(196,154,80,0.55)' }}>
                            {a.time}
                          </span>
                          {a.duration && (
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: 'rgba(242,234,216,0.3)' }}>
                              {a.duration}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sand)', marginTop: 3 }}>
                          {a.activity}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.4)', marginTop: 3 }}>
                          📍 {a.location}
                        </div>
                        {a.cost && (
                          <div style={{ fontSize: '0.72rem', color: 'rgba(196,154,80,0.5)', marginTop: 3 }}>
                            💰 {a.cost}
                          </div>
                        )}
                        {a.tip && (
                          <div style={{ fontSize: '0.75rem', color: 'rgba(196,154,80,0.5)', marginTop: 5, fontStyle: 'italic' }}>
                            💡 {a.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food + Stay column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Dining */}
              <div>
                <div className="sub-label">Dining</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Lunch',  ...day.lunch  },
                    { label: 'Dinner', ...day.dinner },
                  ].map(m => (
                    <div key={m.label} className="info-tile">
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <Utensils size={13} style={{ color: 'rgba(52,211,153,0.6)', marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.63rem', color: 'rgba(52,211,153,0.55)' }}>
                              {m.label}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.5)' }}>
                              {m.priceRange}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sand)', marginTop: 3 }}>
                            {m.restaurant}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.38)', marginTop: 2 }}>
                            {m.cuisine}
                          </div>
                          {m.dish && (
                            <div style={{ fontSize: '0.72rem', color: 'rgba(196,154,80,0.5)', marginTop: 2 }}>
                              ⭐ Try: {m.dish}
                            </div>
                          )}
                          {m.address && (
                            <div style={{ fontSize: '0.72rem', color: 'rgba(242,234,216,0.3)', marginTop: 2 }}>
                              📍 {m.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stay */}
              <div>
                <div className="sub-label">Stay</div>
                <div className="info-tile">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Hotel size={13} style={{ color: 'rgba(56,189,248,0.6)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sand)' }}>
                          {day.stay?.name}
                        </span>
                        {day.stay?.rating && (
                          <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>
                            ★ {day.stay.rating}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(242,234,216,0.38)', marginTop: 2 }}>
                        {day.stay?.type} · {day.stay?.pricePerNight}/night
                      </div>
                      {day.stay?.area && (
                        <div style={{ fontSize: '0.72rem', color: 'rgba(242,234,216,0.3)', marginTop: 2 }}>
                          📍 {day.stay.area}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Full itinerary result ── */
function ItineraryResult({ itinerary, canSave, onSave, saving, saved }) {
  const [openDay,   setOpenDay]   = useState(0);
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <div id="result" style={{ marginTop: 32 }}>
      <style>{`
        .result-tab {
          padding: 8px 20px; border-radius: 999px;
          border: none; cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          font-size: 0.85rem; font-weight: 500;
          transition: all 0.2s;
        }
        .result-tab.active {
          background: linear-gradient(135deg,#f59e0b,#d97706);
          color: #0f172a;
        }
        .result-tab:not(.active) {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(242,234,216,0.55);
        }
        .result-tab:not(.active):hover {
          border-color: rgba(196,154,80,0.3);
          color: var(--sand);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Summary card */}
      <div className="glass-gold" style={{ borderRadius: 24, padding: 'clamp(20px,4vw,36px)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 className="text-gradient" style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: 10,
            }}>
              {itinerary.destination}
            </h3>
            <p style={{ color: 'rgba(242,234,216,0.6)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 560 }}>
              {itinerary.summary}
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              {itinerary.bestTimeToVisit && (
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.7rem', color: 'rgba(196,154,80,0.65)' }}>
                  🗓 {itinerary.bestTimeToVisit}
                </span>
              )}
              {itinerary.weatherNote && (
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.7rem', color: 'rgba(196,154,80,0.65)' }}>
                  🌤 {itinerary.weatherNote}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
            {canSave && (
              <button
                onClick={onSave}
                disabled={saving || saved}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 12, cursor: saved ? 'default' : 'pointer',
                  background: saved ? 'rgba(52,211,153,0.15)' : 'rgba(196,154,80,0.15)',
                  color:      saved ? 'rgba(52,211,153,0.9)'  : 'rgba(196,154,80,0.9)',
                  fontSize: '0.82rem', fontFamily: "'DM Sans',sans-serif",
                  border: saved ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(196,154,80,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {saved
                  ? <><CheckCircle size={14} /> Saved!</>
                  : saving
                  ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : <><Bookmark size={14} /> Save Trip</>
                }
              </button>
            )}
            <button className="glass" style={{ width: 36, height: 36, border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(242,234,216,0.5)' }}>
              <Share2 size={15} />
            </button>
            <button className="glass" style={{ width: 36, height: 36, border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(242,234,216,0.5)' }}>
              <Download size={15} />
            </button>
          </div>
        </div>

        {/* Budget breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginTop: 22 }}>
          {Object.entries(itinerary.budgetBreakdown || {}).map(([k, v]) => (
            <div key={k} className="budget-chip">
              <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.9rem' }}>{v}</div>
              <div style={{ color: 'rgba(242,234,216,0.4)', fontSize: '0.7rem', marginTop: 3, textTransform: 'capitalize' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'itinerary', label: '🗓 Day by Day'  },
          { key: 'tips',      label: '💡 Local Tips'  },
          { key: 'info',      label: '📦 Travel Info' },
        ].map(t => (
          <button
            key={t.key}
            className={`result-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Day by day tab */}
      {activeTab === 'itinerary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {itinerary.days?.map((day, idx) => (
            <DayCard
              key={day.day}
              day={day}
              isOpen={openDay === idx}
              toggle={() => setOpenDay(openDay === idx ? null : idx)}
            />
          ))}
        </div>
      )}

      {/* Local tips tab */}
      {activeTab === 'tips' && (
        <div className="glass" style={{ borderRadius: 20, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
            <Camera size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--sand)' }}>
              Local Tips & Tricks
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {itinerary.localTips?.map((t, i) => (
              <div key={i} className="info-tile" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(242,234,216,0.7)', lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel info tab */}
      {activeTab === 'info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Packing tips */}
          {itinerary.packingTips?.length > 0 && (
            <div className="glass" style={{ borderRadius: 20, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
                <Package size={16} style={{ color: '#38bdf8' }} />
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 600, color: 'var(--sand)' }}>
                  Packing Tips
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {itinerary.packingTips.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.875rem', color: 'rgba(242,234,216,0.65)', alignItems: 'flex-start' }}>
                    <span style={{ color: '#38bdf8', flexShrink: 0 }}>→</span>{t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency info */}
          {itinerary.emergencyInfo && (
            <div className="glass" style={{ borderRadius: 20, padding: '24px', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
                <Phone size={16} style={{ color: 'rgba(252,165,165,0.8)' }} />
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 600, color: 'var(--sand)' }}>
                  Emergency Info
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(itinerary.emergencyInfo).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 10 }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(242,234,216,0.45)', textTransform: 'capitalize' }}>{k}</span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(252,165,165,0.8)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main TravelPlanner component ── */
export default function TravelPlanner() {

  // ── Auth state — no NextAuth, uses JWT cookie ──────
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.success) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // ── Form state ─────────────────────────────────────
  const [form, setForm] = useState({
    destination: '', startDate: '', endDate: '',
    budget: '', travelers: '2', style: 'Cultural', preferences: '',
  });
  const [loading,   setLoading]   = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [canSave,   setCanSave]   = useState(false);
  const [error,     setError]     = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  const days = form.startDate && form.endDate
    ? Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000)
    : null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Generate itinerary ─────────────────────────────
  const generate = async () => {
    if (!form.destination || !form.startDate || !form.endDate || !form.budget) {
      setError('Please fill in destination, dates and budget.'); return;
    }
    if (!days || days < 1) {
      setError('End date must be after start date.'); return;
    }
    if (days > 30) {
      setError('Maximum trip length is 30 days.'); return;
    }

    setError('');
    setLoading(true);
    setItinerary(null);
    setSaved(false);
    setCanSave(false);

    try {
      const res  = await fetch('/api/itinerary/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, days }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate itinerary.');
        return;
      }

      setItinerary(data.itinerary);
      setCanSave(data.canSave);

      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);

    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Save itinerary ─────────────────────────────────
  const handleSave = async () => {
    if (!itinerary || saving || saved) return;
    setSaving(true);

    try {
      const res  = await fetch('/api/itinerary/save', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ itinerary, inputs: form }),
      });
      const data = await res.json();

      if (res.ok) {
        setSaved(true);
      } else {
        setError(data.error || 'Could not save itinerary.');
      }
    } catch {
      setError('Network error. Could not save itinerary.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="planner" style={{ padding: 'clamp(60px,10vw,112px) 24px', position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1920&q=60')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundAttachment: 'fixed', opacity: 0.15,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,14,26,0.85)' }} />

      <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,6vw,56px)' }}>
          <span className="tag-pill" style={{ marginBottom: 14 }}>AI-Powered</span>
          <h2 className="text-gradient" style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700,
            marginTop: 12, marginBottom: 12,
          }}>
            Plan Your Journey
          </h2>
          <p style={{ color: 'rgba(242,234,216,0.5)', fontSize: '1rem' }}>
            Fill in the details — Claude AI handles the rest.
          </p>
        </div>

        {/* Form card */}
        <div className="glass-gold" style={{ borderRadius: 28, padding: 'clamp(24px,5vw,44px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>

            {/* Destination */}
            <div style={{ gridColumn: '1/-1' }}>
              <FormLabel>Destination</FormLabel>
              <InputWrap icon={<MapPin size={16} />}>
                <input
                  className="travel-input" type="text"
                  placeholder="Paris, Tokyo, Bali…"
                  value={form.destination}
                  onChange={e => set('destination', e.target.value)}
                />
              </InputWrap>
            </div>

            {/* Start date */}
            <div>
              <FormLabel>Start Date</FormLabel>
              <InputWrap icon={<Calendar size={16} />}>
                <input
                  className="travel-input" type="date"
                  style={{ colorScheme: 'dark' }}
                  value={form.startDate}
                  onChange={e => set('startDate', e.target.value)}
                />
              </InputWrap>
            </div>

            {/* End date */}
            <div>
              <FormLabel>
                End Date{' '}
                {days && days > 0 && (
                  <span style={{ color: '#f59e0b' }}>({days} days)</span>
                )}
              </FormLabel>
              <InputWrap icon={<Calendar size={16} />}>
                <input
                  className="travel-input" type="date"
                  style={{ colorScheme: 'dark' }}
                  value={form.endDate}
                  onChange={e => set('endDate', e.target.value)}
                />
              </InputWrap>
            </div>

            {/* Budget */}
            <div>
              <FormLabel>Total Budget (USD)</FormLabel>
              <InputWrap icon={<DollarSign size={16} />}>
                <input
                  className="travel-input" type="number"
                  placeholder="2000"
                  value={form.budget}
                  onChange={e => set('budget', e.target.value)}
                />
              </InputWrap>
            </div>

            {/* Travellers */}
            <div>
              <FormLabel>Travellers</FormLabel>
              <InputWrap icon={<Users size={16} />}>
                <select
                  className="travel-input"
                  value={form.travelers}
                  onChange={e => set('travelers', e.target.value)}
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Traveller' : 'Travellers'}
                    </option>
                  ))}
                </select>
              </InputWrap>
            </div>

            {/* Travel style */}
            <div style={{ gridColumn: '1/-1' }}>
              <FormLabel>Travel Style</FormLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {STYLES.map(s => (
                  <button
                    key={s}
                    className={`style-chip${form.style === s ? ' active' : ''}`}
                    onClick={() => set('style', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div style={{ gridColumn: '1/-1' }}>
              <FormLabel>
                Preferences{' '}
                <span style={{
                  color: 'rgba(242,234,216,0.3)', textTransform: 'none',
                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', letterSpacing: 0,
                }}>
                  (optional)
                </span>
              </FormLabel>
              <textarea
                className="travel-input"
                style={{ paddingLeft: 16, paddingTop: 14, resize: 'none', height: 90 }}
                placeholder="e.g. vegetarian, avoid tourist traps, love street art, need wheelchair access…"
                value={form.preferences}
                onChange={e => set('preferences', e.target.value)}
              />
            </div>
          </div>

          {/* Not logged in notice */}
          {!currentUser && (
            <div style={{
              marginTop: 16, padding: '10px 16px',
              background: 'rgba(196,154,80,0.08)',
              border: '1px solid rgba(196,154,80,0.2)',
              borderRadius: 12, fontSize: '0.82rem',
              color: 'rgba(196,154,80,0.8)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              💡 Sign in to save your generated itineraries to your account.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="err-box">
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* Generate button */}
          <button
            className="btn-gold"
            onClick={generate}
            disabled={loading}
            style={{ width: '100%', marginTop: 22, borderRadius: 16, padding: '15px 0', fontSize: '1rem' }}
          >
            {loading
              ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Claude is crafting your itinerary…</>
              : <><Sparkles size={20} /> Generate My Itinerary</>
            }
          </button>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center', color: 'rgba(242,234,216,0.5)', fontSize: '0.9rem', marginBottom: 8 }}>
              ✨ AI is planning your perfect trip…
            </div>
            {[100, 80, 90].map((h, i) => (
              <div key={i} className="shimmer-card" style={{ height: h }} />
            ))}
          </div>
        )}

        {/* Itinerary result */}
        {itinerary && (
          <ItineraryResult
            itinerary={itinerary}
            canSave={canSave}
            onSave={handleSave}
            saving={saving}
            saved={saved}
          />
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
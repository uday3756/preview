import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Award, Star, Shield, Palette, Activity, Lock,
  Bell, Eye, EyeOff, ChevronRight, Trophy, Flame, Ticket, Clapperboard, Check,
  Calendar, Clock
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20 },
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: <User size={16} /> },
  { id: 'bookings', label: 'My Bookings', icon: <Ticket size={16} /> },
  { id: 'applications', label: 'My Applications', icon: <Clapperboard size={16} /> },
  { id: 'achievements', label: 'Achievements', icon: <Award size={16} /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={16} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={16} /> },
  { id: 'theme', label: 'Theme', icon: <Palette size={16} /> },
];

const ACHIEVEMENTS = [
  { id: 1, icon: <Ticket />, title: 'First Booking', desc: 'Booked your first event on Lumina', points: 50, earned: true },
  { id: 2, icon: <Trophy />, title: 'Workshop Pro', desc: 'Attended 5 workshops', points: 200, earned: true },
  { id: 3, icon: <Flame />, title: '7-Day Streak', desc: 'Logged in 7 days in a row', points: 100, earned: false },
  { id: 4, icon: <Clapperboard />, title: 'Cine Explorer', desc: 'Applied for 3 movie roles', points: 150, earned: false },
  { id: 5, icon: <Star />, title: 'Top Reviewer', desc: 'Left 10 venue reviews', points: 300, earned: false },
  { id: 6, icon: <Award />, title: 'Lumina Legend', desc: 'Reached 1000 XP points', points: 500, earned: false },
];

const ACTIVITY = [
  { id: 1, time: '2 hours ago', action: 'Bookmarked "KGF Chapter 3" role', type: 'movie', icon: <Clapperboard size={15} /> },
  { id: 2, time: 'Yesterday', action: 'Signed up for "Clay & Sip Pottery"', type: 'workshop', icon: <Ticket size={15} /> },
  { id: 3, time: '2 days ago', action: 'Booked table at Bunkerzz, Hubli', type: 'event', icon: <Star size={15} /> },
  { id: 4, time: '4 days ago', action: 'Reviewed Ice Cube Club — 5 stars ⭐', type: 'review', icon: <Activity size={15} /> },
  { id: 5, time: '1 week ago', action: 'Applied for "Folk Dancer" in Kantara 2', type: 'movie', icon: <Clapperboard size={15} /> },
  { id: 6, time: '1 week ago', action: 'Joined Yoga & Mindfulness Retreat', type: 'workshop', icon: <Ticket size={15} /> },
];

const activityColors = { movie: '#8a2be2', workshop: 'var(--success)', event: '#ffb800', review: 'var(--accent-secondary)' };

const THEMES = [
  { id: 'default', label: 'Lumina Dark', primary: '#8a2be2', accent: '#ff007f', bg: '#0a0a0f' },
  { id: 'ocean', label: 'Ocean', primary: '#0080ff', accent: '#00d4ff', bg: '#050d1a' },
  { id: 'crimson', label: 'Crimson', primary: '#dc143c', accent: '#ff6b6b', bg: '#0f0507' },
  { id: 'forest', label: 'Forest', primary: '#00c853', accent: '#69f0ae', bg: '#050f07' },
  { id: 'golden', label: 'Golden Hour', primary: '#f4a000', accent: '#ffcc02', bg: '#0f0c05' },
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [privacy, setPrivacy] = useState({ publicProfile: true, showActivity: true, showBookmarks: false, emailNotifs: true });
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem('lumina_bookings') || '[]');
    const userBookings = allBookings.filter(b => b.email === user.email);
    setBookings(userBookings);
  }, [user, navigate]);

  const handleCancelBooking = (refNum) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel booking ${refNum}?`);
    if (!confirmCancel) return;

    const allBookings = JSON.parse(localStorage.getItem('lumina_bookings') || '[]');
    const updated = allBookings.map(b => {
      if (b.ref === refNum && b.email === user?.email) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    });
    localStorage.setItem('lumina_bookings', JSON.stringify(updated));
    setBookings(updated.filter(b => b.email === user?.email));
  };

  const handleResendEmail = (refNum) => {
    alert(`✉️ Simulated: Booking confirmation email resent for ${refNum}!`);
  };

  if (!user) return null;
  const totalPoints = ACHIEVEMENTS.filter(a => a.earned).reduce((s, a) => s + a.points, 0);
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevel = level * 100;

  const applyTheme = (theme) => {
    setSelectedTheme(theme.id);
    document.documentElement.style.setProperty('--accent-primary', theme.primary);
    document.documentElement.style.setProperty('--accent-secondary', theme.accent);
  };

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingBottom: '60px' }}>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          borderRadius: '24px', overflow: 'hidden', marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(138,43,226,0.2), rgba(255,0,127,0.1))',
          border: '1px solid rgba(138,43,226,0.3)', padding: '32px',
          display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #8a2be2, #ff007f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', border: '3px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 30px rgba(138,43,226,0.5)',
          }}>
            🎭
          </div>
          <div style={{
            position: 'absolute', bottom: 2, right: 2, width: '20px', height: '20px',
            borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-primary)',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '4px' }}>{user.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.95rem' }}>
            🌟 Lumina Level {user.level || level} Explorer · {user.location || 'Hubli, Karnataka'}
          </p>

          {/* XP Bar */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{totalPoints} XP</span>
              <span style={{ color: 'var(--text-secondary)' }}>{nextLevel - totalPoints} XP to Level {level + 1}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totalPoints % 100)}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #8a2be2, #ff007f)', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(138,43,226,0.2)', color: 'var(--accent-primary)', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.82rem' }}>
              ⚡ {user.xp || totalPoints} XP
            </span>
            <span style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--success)', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.82rem' }}>
              🏆 {ACHIEVEMENTS.filter(a => a.earned).length} Badges
            </span>
            <span style={{ background: 'rgba(255,184,0,0.1)', color: '#ffb800', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.82rem' }}>
              🎯 Level {user.level || level}
            </span>
            <button 
              onClick={logout}
              style={{ background: 'rgba(255,71,87,0.1)', color: '#ff4757', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(255,71,87,0.2)', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '600',
              fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap', cursor: 'pointer',
              transition: 'all 0.2s',
              background: tab === t.id ? 'linear-gradient(135deg, #8a2be2, #ff007f)' : 'rgba(255,255,255,0.05)',
              color: tab === t.id ? '#fff' : 'var(--text-secondary)',
              border: tab === t.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Events Attended', value: bookings.filter(b => b.status === 'Confirmed' && b.type === 'event').length || '0', color: '#ffb800', icon: '🎉' },
                { label: 'Workshops Done', value: bookings.filter(b => b.status === 'Confirmed' && b.type === 'workshop').length || '0', color: 'var(--success)', icon: '🎨' },
                { label: 'Tables Booked', value: bookings.filter(b => b.status === 'Confirmed' && b.type === 'venue').length || '0', color: 'var(--accent-primary)', icon: '🍽️' },
                { label: 'Reviews Left', value: '12', color: 'var(--accent-secondary)', icon: '⭐' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="glass-panel" style={{ textAlign: 'center', padding: '28px 16px' }}>
                   <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: stat.color, marginBottom: '4px', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {bookings.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <Ticket size={48} style={{ opacity: 0.3, marginBottom: '16px', margin: '0 auto' }} />
                <h3 style={{ fontWeight: '700', color: '#fff', marginBottom: '8px' }}>No Active Bookings</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>You haven't booked any events, tables, or workshops yet.</p>
                <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/event')}>Explore Events</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bookings.map((booking, i) => (
                  <motion.div
                    key={booking.ref}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      border: `1px solid ${booking.status === 'Cancelled' ? 'rgba(255, 71, 87, 0.15)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '20px',
                      opacity: booking.status === 'Cancelled' ? 0.7 : 1
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <img src={booking.image} alt={booking.title} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            background: booking.type === 'venue' ? 'rgba(255,184,0,0.1)' : booking.type === 'workshop' ? 'rgba(0,255,136,0.1)' : 'rgba(138,43,226,0.1)',
                            color: booking.type === 'venue' ? '#ffb800' : booking.type === 'workshop' ? 'var(--success)' : 'var(--accent-primary)',
                            padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase'
                          }}>
                            {booking.type === 'venue' ? 'Table' : booking.type}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
                            Ref: {booking.ref}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{booking.title}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {booking.date}</span>
                          {booking.time && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {booking.time}</span>
                          {booking.category && booking.category !== 'N/A' && <span style={{ color: '#ffb800', fontWeight: '700' }}>👑 {booking.category}</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Amount Paid</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--success)' }}>{booking.price}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {booking.status === 'Cancelled' ? (
                          <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '700', padding: '4px 10px', background: 'rgba(255, 71, 87, 0.08)', borderRadius: '8px', border: '1px solid rgba(255, 71, 87, 0.2)' }}>
                            Cancelled
                          </span>
                        ) : (
                          <>
                            <button onClick={() => handleResendEmail(booking.ref)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                              Resend Email
                            </button>
                            <button onClick={() => handleCancelBooking(booking.ref)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'rgba(255, 71, 87, 0.4)', color: 'rgb(255, 71, 87)', background: 'transparent' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,71,87,0.05)' }} onMouseLeave={(e) => { e.target.style.background = 'transparent' }}>
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Junior Artist - KGF Chapter 1', status: 'Under Review', date: 'Applied 2 days ago', studio: 'Hombale Films', color: '#ffb800' },
                { title: 'Folk Dancer - Kantara', status: 'Accepted', date: 'Applied 1 week ago', studio: 'Hombale Films', color: 'var(--success)' },
                { title: 'Sound Engineer - KGF Chapter 2', status: 'Interpreting', date: 'Applied 5 days ago', studio: 'Hombale Films', color: 'var(--accent-primary)' },
              ].map((app, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: `${app.color}18`, color: app.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', border: `1px solid ${app.color}33` }}>
                    {app.status}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clapperboard size={20} color="var(--accent-primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{app.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.studio}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{app.date}</span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>View Details</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {tab === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {ACHIEVEMENTS.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-panel"
                  style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', opacity: a.earned ? 1 : 0.5, position: 'relative', overflow: 'hidden' }}
                >
                  {a.earned && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success)', color: '#000', fontSize: '0.65rem', fontWeight: '700', padding: '4px 10px', borderRadius: '0 16px 0 10px' }}>EARNED</div>}
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                    background: a.earned ? 'linear-gradient(135deg, #8a2be2, #ff007f)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    border: a.earned ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.97rem', marginBottom: '3px' }}>{a.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '6px' }}>{a.desc}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffb800' }}>+{a.points} XP</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ACTIVITY */}
        {tab === 'activity' && (
          <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {ACTIVITY.map((act, i) => (
                <motion.div key={act.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ paddingBottom: '28px', position: 'relative' }}
                >
                  <div style={{
                    position: 'absolute', left: '-33px', top: '2px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: activityColors[act.type] || '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#000', border: '2px solid var(--bg-primary)',
                  }}>
                    {act.icon}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{act.time}</div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{act.action}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PRIVACY */}
        {tab === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '0', overflow: 'hidden' }}>
              {[
                { key: 'publicProfile', label: 'Public Profile', desc: 'Allow others to see your profile', icon: <Eye size={18} /> },
                { key: 'showActivity', label: 'Show Activity', desc: 'Display your event activity to followers', icon: <Activity size={18} /> },
                { key: 'showBookmarks', label: 'Show Saved Roles', desc: 'Others can see your bookmarked movie roles', icon: <Lock size={18} /> },
                { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive event reminders and updates', icon: <Bell size={18} /> },
              ].map((item, i) => (
                <div key={item.key} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{item.desc}</div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key] }))}
                    aria-label={`Toggle ${item.label}`}
                    style={{
                      width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
                      background: privacy[item.key] ? 'linear-gradient(135deg, #8a2be2, #ff007f)' : 'rgba(255,255,255,0.12)',
                      position: 'relative', transition: 'background 0.3s', flexShrink: 0,
                    }}
                  >
                    <motion.div
                      animate={{ x: privacy[item.key] ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* THEME */}
        {tab === 'theme' && (
          <motion.div key="theme" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Choose an accent color scheme to personalize your Lumina experience.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {THEMES.map(theme => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => applyTheme(theme)}
                  style={{
                    padding: '20px', borderRadius: '16px', cursor: 'pointer', border: 'none', fontFamily: "'Outfit', sans-serif",
                    background: `linear-gradient(135deg, ${theme.primary}22, ${theme.accent}11)`,
                    border: `2px solid ${selectedTheme === theme.id ? theme.primary : 'rgba(255,255,255,0.08)'}`,
                    position: 'relative', overflow: 'hidden',
                    boxShadow: selectedTheme === theme.id ? `0 0 20px ${theme.primary}44` : 'none',
                  }}
                >
                  {selectedTheme === theme.id && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '22px', height: '22px', borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={13} color="#fff" />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.primary }} />
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.accent }} />
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.bg, border: '1px solid rgba(255,255,255,0.2)' }} />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff', textAlign: 'left' }}>{theme.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;

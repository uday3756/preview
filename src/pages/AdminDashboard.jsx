import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, TrendingUp, Calendar, Search, Eye, Ticket, Star, ArrowUp, ArrowDown } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20 },
};

const METRICS = [
  { label: 'Total Users', value: '12,480', change: '+18%', up: true, icon: <Users size={24} />, color: 'var(--accent-primary)' },
  { label: 'Event Registrations', value: '3,271', change: '+34%', up: true, icon: <Ticket size={24} />, color: 'var(--success)' },
  { label: 'Avg. Session (min)', value: '8.4', change: '-2%', up: false, icon: <Eye size={24} />, color: '#ffb800' },
  { label: 'New Reviews', value: '892', change: '+12%', up: true, icon: <Star size={24} />, color: 'var(--accent-secondary)' },
];

const TOP_VENUES = [
  { name: 'Bunkerzz, Hubli', bookings: 1240, rating: 4.7, trend: '+12%' },
  { name: 'Ice Cube Club, Hubli', bookings: 988, rating: 4.8, trend: '+27%' },
  { name: 'Bombay 63, Hubli', bookings: 754, rating: 4.5, trend: '+8%' },
  { name: 'Rave Party – Dharwad', bookings: 612, rating: 4.6, trend: '+41%' },
  { name: 'Jazz Garden, Dharwad', bookings: 510, rating: 4.4, trend: '+5%' },
];

const TOP_WORKSHOPS = [
  { name: 'Clay & Sip Pottery', registrations: 560, category: 'Pottery' },
  { name: 'Abstract Canvas Painting', registrations: 490, category: 'Art' },
  { name: 'Chef\'s Table: Coastal Cooking', registrations: 380, category: 'Cooking' },
  { name: 'Screen Print Tote Bag', registrations: 342, category: 'Craft' },
  { name: 'Yoga & Mindfulness Retreat', registrations: 290, category: 'Fitness' },
];

const TOP_SEARCHES = [
  { query: 'live music Hubli', count: 2140 },
  { query: 'KGF Chapter 3 audition', count: 1890 },
  { query: 'pottery workshop Dharwad', count: 1340 },
  { query: 'happy hour pubs Hubli', count: 1200 },
  { query: 'Kantara 2 casting call', count: 980 },
  { query: 'rave party tickets', count: 870 },
];

function SimpleBar({ value, max, color }) {
  return (
    <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ height: '100%', background: color, borderRadius: '4px' }}
      />
    </div>
  );
}

const AdminDashboard = () => {
  const [period, setPeriod] = useState('7d');

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '6px 16px', background: 'rgba(255,51,102,0.1)', borderRadius: '20px' }}>
          <BarChart2 size={15} color="var(--danger)" />
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--danger)', letterSpacing: '2px', textTransform: 'uppercase' }}>Admin Only</span>
        </div>
        <h1 className="page-title">Analytics <span className="text-gradient">Dashboard</span></h1>
        <p className="page-subtitle">Track user engagement, top searches, and event registrations in real time.</p>
      </div>

      {/* Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px', gap: '8px' }}>
        {['7d', '30d', '90d', 'All'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{
              padding: '8px 18px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)',
              background: period === p ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
            }}>
            {p}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {METRICS.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-panel" style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${m.color}18`, border: `1px solid ${m.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                {m.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '700', color: m.up ? 'var(--success)' : 'var(--danger)' }}>
                {m.up ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {m.change}
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1, marginBottom: '6px', color: '#fff' }}>{m.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Top Venues */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel">
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--success)" /> Top Venues
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {TOP_VENUES.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', color: 'var(--success)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.87rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: '700', marginLeft: '8px', flexShrink: 0 }}>{v.trend}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SimpleBar value={v.bookings} max={1240} color="var(--success)" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{v.bookings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Workshops */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-panel">
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--accent-primary)" /> Top Workshops
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {TOP_WORKSHOPS.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(138,43,226,0.1)', border: '1px solid rgba(138,43,226,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', color: 'var(--accent-primary)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.87rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(138,43,226,0.15)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', marginLeft: '8px', flexShrink: 0 }}>{w.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SimpleBar value={w.registrations} max={560} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{w.registrations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Searches */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel">
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} color="#ffb800" /> Top Search Queries
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {TOP_SEARCHES.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              style={{
                padding: '10px 18px', borderRadius: '30px',
                background: `rgba(255,184,0,${0.05 + (TOP_SEARCHES.length - i) * 0.025})`,
                border: '1px solid rgba(255,184,0,0.2)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <Search size={13} color="#ffb800" />
              <span style={{ fontWeight: '600', fontSize: '0.88rem' }}>{s.query}</span>
              <span style={{ color: '#ffb800', fontWeight: '700', fontSize: '0.8rem' }}>{s.count.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;

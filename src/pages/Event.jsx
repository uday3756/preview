import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Flame, Music, Mic2, Sparkles, Users } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.4 } },
};

const generalEvents = [
  {
    id: 'e1', title: 'Hubli Music Festival 2026', category: 'Music', status: 'upcoming',
    date: 'May 15–17, 2026', time: '5:00 PM onwards', venue: 'Nrupatunga Ground, Hubli',
    price: '₹499', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    description: 'Three days of live music, food stalls, and culture celebrating the spirit of North Karnataka.', attendees: 4200,
  },
  {
    id: 'e2', title: 'Dharwad Lit Fest', category: 'Culture', status: 'upcoming',
    date: 'June 7, 2026', time: '10:00 AM', venue: 'Town Hall, Dharwad',
    price: 'Free', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
    description: 'Annual literary festival with award-winning authors, storytelling sessions, and poetry slams.', attendees: 800,
  },
  {
    id: 'e3', title: 'Stand-Up Night at Ice Cube', category: 'Comedy', status: 'ongoing',
    date: 'Every Friday', time: '8:30 PM', venue: 'Ice Cube Club, Hubli',
    price: '₹299', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800',
    description: 'The funniest night in Hubli. Catch both local comedians and national acts live at Ice Cube.', attendees: 320,
  },
  {
    id: 'e4', title: 'Yoga on the Lake', category: 'Wellness', status: 'upcoming',
    date: 'Every Sunday', time: '7:00 AM', venue: 'Unkal Lake, Hubli',
    price: 'Free', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    description: 'Open-air lakeside yoga session for all levels. Start your Sundays right.', attendees: 150,
  },
  {
    id: 'e5', title: 'Local Craft Market', category: 'Market', status: 'upcoming',
    date: 'May 25, 2026', time: '10 AM – 8 PM', venue: 'Lamington Road, Hubli',
    price: 'Free Entry', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    description: 'Shop handcrafted goods, local art, and artisanal food from 100+ vendors.', attendees: 2500,
  },
  {
    id: 'e6', title: 'Tech Meetup – Build with AI', category: 'Tech', status: 'closed',
    date: 'April 10, 2026', time: '6:00 PM', venue: 'BHub, Hubli',
    price: '₹199', image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800',
    description: 'An evening for Hubli\'s developer community to demo AI projects and network.', attendees: 180,
  },
];

const CATEGORIES = ['All', 'Music', 'Culture', 'Comedy', 'Wellness', 'Market', 'Tech'];

const Event = () => {
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const filtered = generalEvents.filter(e => category === 'All' || e.category === category);

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-header">
        <h1 className="page-title">Events <span className="text-gradient">Near You</span></h1>
        <p className="page-subtitle">Concerts, cultural fests, comedy nights, wellness events & more — all in Hubli & Dharwad.</p>
      </div>

      {/* Featured Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          borderRadius: '24px', overflow: 'hidden', marginBottom: '40px',
          position: 'relative', height: '250px',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400"
          alt="Hubli Music Festival 2026 featured event"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,184,0,0.2)', border: '1px solid rgba(255,184,0,0.4)', borderRadius: '20px', padding: '4px 12px', marginBottom: '10px', width: 'fit-content' }}>
            <Flame size={13} color="#ffb800" />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffb800', letterSpacing: '1px' }}>FEATURED EVENT</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '6px' }}>Hubli Music Festival 2026</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '16px' }}>May 15–17 · Nrupatunga Ground · 4200+ attending</p>
          <button className="btn-primary" style={{ width: 'fit-content', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => navigate('/checkout', { state: { event: generalEvents[0] } })}>
            Get Tickets <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="tabs-container" style={{ flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`tab-btn ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <motion.div layout className="events-grid">
        <AnimatePresence>
          {filtered.map(event => (
            <motion.div
              key={event.id} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
              className="event-card"
            >
              <div className="event-image-container">
                <img src={event.image} alt={`${event.title} - ${event.category} event in ${event.venue}`} className="event-image" />
                <div className={`event-badge badge-${event.status}`}>
                  {event.status === 'ongoing' ? '🟢 Happening Now' : event.status === 'upcoming' ? '⏳ Upcoming' : '🔴 Ended'}
                </div>
              </div>
              <div className="event-content">
                <span className="event-category">{event.category}</span>
                <h3 className="event-title">{event.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px', lineHeight: 1.5 }}>{event.description}</p>
                <div className="event-details">
                  <div className="event-detail-item"><MapPin size={14} /> {event.venue}</div>
                  <div className="event-detail-item"><Calendar size={14} /> {event.date}</div>
                  <div className="event-detail-item"><Clock size={14} /> {event.time}</div>
                  <div className="event-detail-item"><Users size={14} /> {event.attendees.toLocaleString()} attending</div>
                </div>
                <div className="event-footer">
                  <span className="event-price" style={{ fontSize: '1.1rem' }}>{event.price}</span>
                  <button
                    className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                    onClick={() => navigate('/checkout', { state: { event } })}
                    disabled={event.status === 'closed'}
                  >
                    {event.status === 'closed' ? 'Ended' : 'Join Event'} {event.status !== 'closed' && <ArrowRight size={15} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Event;

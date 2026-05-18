import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Palette, Scissors, ArrowRight, Clock, Users, Camera,
  ChevronLeft, ChevronRight, Timer, UserCheck, Utensils, Dumbbell, Brush
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.4 } },
};

const CATEGORIES = [
  { id: 'all', label: 'All Workshops', icon: null },
  { id: 'art', label: 'Art', icon: <Brush size={14} /> },
  { id: 'craft', label: 'Craft', icon: <Scissors size={14} /> },
  { id: 'cooking', label: 'Cooking', icon: <Utensils size={14} /> },
  { id: 'fitness', label: 'Fitness', icon: <Dumbbell size={14} /> },
  { id: 'pottery', label: 'Pottery', icon: <Palette size={14} /> },
];

const workshopsList = [
  {
    id: 101, title: 'Clay & Sip: Pottery Making', venue: 'Earth Studio, Hubli',
    category: 'pottery', status: 'upcoming', price: '₹1,200',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
    spots: 8, totalSpots: 15,
    description: 'Learn hand-building and wheel-throwing alongside expert potters with complimentary wine.',
  },
  {
    id: 102, title: 'Screen Print Your Tote Bag', venue: 'The Craft Room, Dharwad',
    category: 'craft', status: 'ongoing', price: '₹800',
    date: new Date(Date.now() + 5 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1595337222538-4e891eb2d483?auto=format&fit=crop&q=80&w=800',
    spots: 3, totalSpots: 12,
    description: 'Design and print your own custom tote bag using professional silkscreen techniques.',
  },
  {
    id: 103, title: 'Advanced Wheel Throwing', venue: 'Earth Studio, Hubli',
    category: 'pottery', status: 'closed', price: '₹1,500',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1565193566173-7a0cb3d90403?auto=format&fit=crop&q=80&w=800',
    spots: 0, totalSpots: 10,
    description: 'Master the pottery wheel with advanced centering and pulling techniques.',
  },
  {
    id: 104, title: 'Abstract Canvas Painting', venue: 'Colors Art Cafe, Hubli',
    category: 'art', status: 'upcoming', price: '₹950',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    spots: 12, totalSpots: 20,
    description: 'Unleash your inner artist with abstract acrylic techniques guided by professional artists.',
  },
  {
    id: 105, title: 'Chef\'s Table: Coastal Cooking', venue: 'Flavor Lab, Dharwad',
    category: 'cooking', status: 'upcoming', price: '₹1,800',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
    spots: 6, totalSpots: 10,
    description: 'Learn to cook traditional Karnataka coastal dishes with a Michelin-trained chef.',
  },
  {
    id: 106, title: 'Yoga & Mindfulness Retreat', venue: 'Zen Hub, Hubli',
    category: 'fitness', status: 'upcoming', price: '₹600',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    spots: 15, totalSpots: 25,
    description: 'A holistic yoga and mindfulness session for all skill levels. Mat included.',
  },
];

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600', caption: 'Pottery at Earth Studio' },
  { src: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600', caption: 'Abstract Painting Workshop' },
  { src: 'https://images.unsplash.com/photo-1595337222538-4e891eb2d483?auto=format&fit=crop&q=80&w=600', caption: 'Tote Bag Printing Session' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=600', caption: 'Chef\'s Table Cooking Class' },
  { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', caption: 'Yoga & Mindfulness Retreat' },
  { src: 'https://images.unsplash.com/photo-1565193566173-7a0cb3d90403?auto=format&fit=crop&q=80&w=600', caption: 'Advanced Wheel Throwing' },
];

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {[{ label: 'Days', value: timeLeft.d }, { label: 'Hours', value: timeLeft.h }, { label: 'Mins', value: timeLeft.m }, { label: 'Secs', value: timeLeft.s }].map(({ label, value }) => (
        <div key={label} style={{ textAlign: 'center', minWidth: '64px' }}>
          <div style={{
            fontSize: '2rem', fontWeight: '900', lineHeight: 1, color: '#fff',
            background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px',
            border: '1px solid rgba(138,43,226,0.3)', letterSpacing: '-1px',
          }}>
            {String(value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '5px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryCarousel() {
  const [active, setActive] = useState(0);
  const next = () => setActive(p => (p + 1) % galleryImages.length);
  const prev = () => setActive(p => (p - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', maxWidth: '700px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={active}
          src={galleryImages[active].src}
          alt={galleryImages[active].caption}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
        />
      </AnimatePresence>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
        display: 'flex', alignItems: 'flex-end', padding: '20px',
      }}>
        <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>{galleryImages[active].caption}</p>
      </div>
      <button onClick={prev} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronRight size={20} />
      </button>
      <div style={{ position: 'absolute', bottom: '56px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {galleryImages.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === active ? '#8a2be2' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

const Workshops = () => {
  const [filter, setFilter] = useState('all');
  const [registeredIds, setRegisteredIds] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const filtered = workshopsList.filter(w => filter === 'all' || w.category === filter);
  const nextUpcoming = workshopsList.filter(w => w.status === 'upcoming').sort((a, b) => a.date - b.date)[0];

  const handleRegister = (workshop) => {
    if (workshop.status === 'closed') return;
    setRegisteredIds(p => p.includes(workshop.id) ? p : [...p, workshop.id]);
    const workshopEvent = { ...workshop, type: 'workshop' };
    if (!user) {
      navigate('/auth', { state: { redirectTo: '/checkout', event: workshopEvent } });
    } else {
      navigate('/checkout', { state: { event: workshopEvent } });
    }
  };

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-header">
        <h1 className="page-title">Creative <span className="text-gradient">Workshops</span></h1>
        <p className="page-subtitle">
          Hands-on experiences in art, craft, cooking, fitness & more — across Hubli & Dharwad.
        </p>
      </div>

      {/* Countdown Banner */}
      {nextUpcoming && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(138,43,226,0.15), rgba(255,0,127,0.1))',
            border: '1px solid rgba(138,43,226,0.3)',
            borderRadius: '20px', padding: '28px 32px', marginBottom: '40px', textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <Timer size={20} color="#8a2be2" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Next Workshop Starts In
            </span>
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>{nextUpcoming.title}</h3>
          <CountdownTimer targetDate={nextUpcoming.date} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            📍 {nextUpcoming.venue} · Only {nextUpcoming.spots} spots left!
          </p>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="tabs-container" style={{ flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <motion.div layout className="events-grid">
        <AnimatePresence>
          {filtered.map(workshop => {
            const spotPercent = ((workshop.totalSpots - workshop.spots) / workshop.totalSpots) * 100;
            const isRegistered = registeredIds.includes(workshop.id);
            return (
              <motion.div
                key={workshop.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="event-card"
              >
                <div className="event-image-container">
                  <img src={workshop.image} alt={`${workshop.title} workshop at ${workshop.venue}`} className="event-image" />
                  <div className={`event-badge badge-${workshop.status}`}>
                    {workshop.status === 'ongoing' ? '🟢 In Session' : workshop.status === 'upcoming' ? '⏳ Upcoming' : '🔴 Sold Out'}
                  </div>
                </div>

                <div className="event-content">
                  <span className="event-category">{workshop.category.charAt(0).toUpperCase() + workshop.category.slice(1)}</span>
                  <h3 className="event-title">{workshop.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px', lineHeight: 1.5 }}>
                    {workshop.description}
                  </p>
                  <div className="event-details">
                    <div className="event-detail-item"><Palette size={14} /> {workshop.venue}</div>
                    <div className="event-detail-item">
                      <Users size={14} />
                      <span style={{ flex: 1 }}>
                        {workshop.spots > 0 ? `${workshop.spots} spots left` : 'Sold Out'}
                      </span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${spotPercent}%`, background: spotPercent > 80 ? 'var(--danger)' : spotPercent > 50 ? '#ffb800' : 'var(--success)', borderRadius: '2px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                    <div className="event-detail-item">
                      <Clock size={14} />
                      {workshop.date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {workshop.date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="event-footer">
                    <span className="event-price" style={{ fontSize: '1.1rem' }}>{workshop.price}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.88rem', gap: '6px' }}
                      onClick={() => handleRegister(workshop)}
                      disabled={workshop.status === 'closed' || workshop.spots === 0}
                    >
                      {isRegistered ? (
                        <><UserCheck size={15} /> Registered!</>
                      ) : workshop.status === 'closed' || workshop.spots === 0 ? (
                        'Sold Out'
                      ) : (
                        <>Sign Up <ArrowRight size={15} /></>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Gallery Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ marginTop: '80px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '6px 16px', background: 'rgba(138,43,226,0.1)', borderRadius: '20px' }}>
            <Camera size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>Workshop Gallery</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Moments from <span className="text-gradient">Past Workshops</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real photos from our incredible community of creators.</p>
        </div>
        <GalleryCarousel />
      </motion.div>
    </motion.div>
  );
};

export default Workshops;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, ArrowRight, Star, Music, Coffee, DollarSign,
  Filter, X, ChevronDown, Tag, Flame, Bike, UtensilsCrossed, Map
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

/** ── Location Data: Hubli & Dharwad ── **/
const venuesList = [
  {
    id: 1,
    title: 'Bunkerzz',
    venue: 'Bunkerzz, Hubli',
    type: 'Pub',
    cuisine: 'Multi-Cuisine',
    ambience: 'Party',
    priceRange: '$$',
    liveMusic: true,
    status: 'ongoing',
    price: '₹800/person',
    rating: 4.7,
    reviews: 312,
    offer: '🍺 Happy Hours: 7–9 PM · Buy 2 Get 1 Free on Beers',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    mapLat: 15.3617,
    mapLng: 75.1240,
    address: 'Keshwapur Road, Hubli, Karnataka',
    reviewsList: [
      { user: 'Rahul M.', stars: 5, text: 'Best DJ nights in Hubli! Unreal atmosphere.' },
      { user: 'Priya S.', stars: 4, text: 'Great cocktails, the bass hits different here 🎶' },
    ],
  },
  {
    id: 2,
    title: 'Bombay 63',
    venue: 'Bombay 63, Hubli',
    type: 'Cafe',
    cuisine: 'North Indian',
    ambience: 'Casual',
    priceRange: '$',
    liveMusic: false,
    status: 'ongoing',
    price: '₹400/person',
    rating: 4.5,
    reviews: 198,
    offer: '🍕 Weekend Special: Unlimited Starters ₹299',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    mapLat: 15.3600,
    mapLng: 75.1320,
    address: 'Vidyanagar, Hubli, Karnataka',
    reviewsList: [
      { user: 'Akhil K.', stars: 5, text: 'The vibe is super chill. Perfect for evenings!' },
      { user: 'Sneha R.', stars: 4, text: 'Food quality is excellent. Great desi ambience.' },
    ],
  },
  {
    id: 3,
    title: 'Ice Cube',
    venue: 'Ice Cube Club, Hubli',
    type: 'Pub',
    cuisine: 'Continental',
    ambience: 'Rave / Club',
    priceRange: '$$$',
    liveMusic: true,
    status: 'upcoming',
    price: '₹1200/person',
    rating: 4.8,
    reviews: 510,
    offer: '🎉 Rave Night this Saturday · Early Bird ₹799',
    image: 'https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?auto=format&fit=crop&q=80&w=800',
    mapLat: 15.3650,
    mapLng: 75.1190,
    address: 'Old Hubli Circle, Hubli, Karnataka',
    reviewsList: [
      { user: 'Dev P.', stars: 5, text: 'Absolutely insane rave nights! The sound system 🔥' },
      { user: 'Kavya T.', stars: 5, text: 'Best club in North Karnataka. Period.' },
    ],
  },
  {
    id: 4,
    title: 'Rave Party – Dharwad Edition',
    venue: 'The Arena, Dharwad',
    type: 'Event',
    cuisine: 'Fusion',
    ambience: 'Outdoor Festival',
    priceRange: '$$',
    liveMusic: true,
    status: 'upcoming',
    price: '₹999/person',
    rating: 4.6,
    reviews: 87,
    offer: '🎵 3-Day Music Fest · Group Discount 20% OFF',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    mapLat: 15.4589,
    mapLng: 75.0078,
    address: 'Stadium Road, Dharwad, Karnataka',
    reviewsList: [
      { user: 'Rohan G.', stars: 5, text: 'Dharwad is finally getting the party scene it deserves!' },
      { user: 'Anjali B.', stars: 4, text: 'The outdoor stage setup was absolutely epic.' },
    ],
  },
  {
    id: 5,
    title: 'The Jazz Garden',
    venue: 'Jazz Garden Café, Dharwad',
    type: 'Cafe',
    cuisine: 'European',
    ambience: 'Acoustic / Lounge',
    priceRange: '$$',
    liveMusic: true,
    status: 'ongoing',
    price: '₹600/person',
    rating: 4.4,
    reviews: 145,
    offer: '☕ Live Acoustic every Friday 8 PM – Free Entry',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    mapLat: 15.4560,
    mapLng: 75.0120,
    address: 'Jubilee Circle, Dharwad, Karnataka',
    reviewsList: [
      { user: 'Meera J.', stars: 5, text: 'Best live jazz I\'ve heard outside Bengaluru. Gorgeous garden!' },
      { user: 'Arjun S.', stars: 4, text: 'Perfect for date nights. Very cozy atmosphere.' },
    ],
  },
  {
    id: 6,
    title: 'Nightfall Lounge',
    venue: 'Nightfall, Hubli',
    type: 'Pub',
    cuisine: 'Pan-Asian',
    ambience: 'Club',
    priceRange: '$$$',
    liveMusic: true,
    status: 'closed',
    price: '₹1500/person',
    rating: 4.2,
    reviews: 420,
    offer: null,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
    mapLat: 15.3580,
    mapLng: 75.1270,
    address: 'Club Road, Hubli, Karnataka',
    reviewsList: [
      { user: 'Vikram B.', stars: 4, text: 'Premium experience. A bit pricey but worth it.' },
      { user: 'Nisha A.', stars: 4, text: 'The rooftop view is just stunning!' },
    ],
  },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.4 } },
};

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13} fill={s <= Math.round(rating) ? '#ffb800' : 'transparent'} color="#ffb800" />
      ))}
      <span style={{ color: '#ffb800', fontSize: '0.8rem', fontWeight: '700', marginLeft: '2px' }}>{rating}</span>
    </div>
  );
}

function MapModal({ venue, onClose }) {
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${venue.mapLng - 0.015}%2C${venue.mapLat - 0.01}%2C${venue.mapLng + 0.015}%2C${venue.mapLat + 0.01}&layer=mapnik&marker=${venue.mapLat}%2C${venue.mapLng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.mapLat},${venue.mapLng}&travelmode=driving`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.8)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)', borderRadius: '20px',
          width: '100%', maxWidth: '680px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{venue.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{venue.address}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,51,102,0.15)', border: 'none', color: 'var(--danger)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <iframe
          src={iframeSrc}
          title={`Map for ${venue.title}`}
          style={{ width: '100%', height: '340px', border: 'none', display: 'block' }}
          loading="lazy"
        />
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #8a2be2, #ff007f)',
              color: '#fff', padding: '10px 24px', borderRadius: '30px',
              fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none',
            }}
          >
            <Bike size={16} /> Get Directions
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReviewsSection({ reviews }) {
  return (
    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {reviews.map((r, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontWeight: '600', fontSize: '0.82rem' }}>{r.user}</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={s <= r.stars ? '#ffb800' : 'transparent'} color="#ffb800" />)}
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

const Events = () => {
  const [filter, setFilter] = useState('all');
  const [cuisine, setCuisine] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapVenue, setMapVenue] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookingRedirect = (selectedVenue) => {
    const venueEvent = { ...selectedVenue, title: selectedVenue.title, type: 'venue' };
    if (!user) {
      navigate('/auth', { state: { redirectTo: '/checkout', event: venueEvent } });
    } else {
      navigate('/checkout', { state: { event: venueEvent } });
    }
  };

  const prices = ['all', '$', '$$', '$$$'];
  const cuisines = ['all', 'Multi-Cuisine', 'North Indian', 'Continental', 'Fusion', 'European', 'Pan-Asian'];

  const filtered = venuesList.filter(v => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (cuisine !== 'all' && v.cuisine !== cuisine) return false;
    if (priceFilter !== 'all' && v.priceRange !== priceFilter) return false;
    if (liveOnly && !v.liveMusic) return false;
    return true;
  });

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Pubs &amp; <span className="text-gradient">Cafés</span></h1>
        <p className="page-subtitle">
          Top venues in Hubli &amp; Dharwad — Bunkerzz, Ice Cube, Bombay 63, and more.
        </p>
      </div>

      {/* Special Offers Banner */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {venuesList.filter(v => v.offer).map(v => (
          <motion.div
            key={v.id}
            whileHover={{ scale: 1.02 }}
            style={{
              flexShrink: 0, padding: '12px 20px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(255,184,0,0.12), rgba(255,51,102,0.08))',
              border: '1px solid rgba(255,184,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', minWidth: '280px',
            }}
            onClick={() => setMapVenue(v)}
          >
            <Tag size={16} color="#ffb800" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#ffb800', marginBottom: '2px' }}>{v.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v.offer}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs + Filter Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div className="tabs-container" style={{ margin: 0 }}>
          {['all', 'ongoing', 'upcoming', 'closed'].map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Venues' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(p => !p)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.15)',
            background: showFilters ? 'rgba(138,43,226,0.2)' : 'rgba(255,255,255,0.05)',
            color: '#fff', fontWeight: '600', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem',
          }}
        >
          <Filter size={16} /> Filters
          <ChevronDown size={16} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginBottom: '24px' }}
          >
            <div style={{
              padding: '20px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start',
            }}>
              {/* Cuisine Filter */}
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
                  <UtensilsCrossed size={13} style={{ display: 'inline', marginRight: '5px' }} /> CUISINE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {cuisines.map(c => (
                    <button key={c} onClick={() => setCuisine(c)}
                      style={{
                        padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif",
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: cuisine === c ? 'var(--accent-primary)' : 'transparent',
                        color: cuisine === c ? '#fff' : 'var(--text-secondary)', cursor: 'pointer',
                      }}>
                      {c === 'all' ? 'All' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
                  <DollarSign size={13} style={{ display: 'inline', marginRight: '5px' }} /> PRICE RANGE
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {prices.map(p => (
                    <button key={p} onClick={() => setPriceFilter(p)}
                      style={{
                        padding: '5px 14px', borderRadius: '20px', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif",
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: priceFilter === p ? '#ffb800' : 'transparent',
                        color: priceFilter === p ? '#000' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '700',
                      }}>
                      {p === 'all' ? 'All' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Music Toggle */}
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
                  <Music size={13} style={{ display: 'inline', marginRight: '5px' }} /> LIVE MUSIC
                </div>
                <button
                  onClick={() => setLiveOnly(p => !p)}
                  style={{
                    padding: '5px 16px', borderRadius: '20px', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif",
                    border: '1px solid rgba(0,255,136,0.3)',
                    background: liveOnly ? 'rgba(0,255,136,0.2)' : 'transparent',
                    color: liveOnly ? 'var(--success)' : 'var(--text-secondary)', cursor: 'pointer',
                  }}
                >
                  {liveOnly ? '✓ Live Music Only' : 'Show Live Music Venues'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <motion.div layout className="events-grid">
        <AnimatePresence>
          {filtered.map(venue => (
            <motion.div
              key={venue.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="event-card"
            >
              <div className="event-image-container">
                <img src={venue.image} alt={`${venue.title} - ${venue.ambience} venue in ${venue.address}`} className="event-image" />
                <div className={`event-badge badge-${venue.status}`}>
                  {venue.status === 'ongoing' ? '🟢 Open Now' : venue.status === 'upcoming' ? '⏳ Upcoming' : '🔴 Closed'}
                </div>
                {venue.liveMusic && (
                  <div style={{
                    position: 'absolute', bottom: '12px', left: '12px', zIndex: 10,
                    background: 'rgba(138,43,226,0.85)', backdropFilter: 'blur(8px)',
                    borderRadius: '20px', padding: '4px 10px', fontSize: '0.75rem',
                    color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <Music size={11} /> LIVE MUSIC
                  </div>
                )}
              </div>

              <div className="event-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span className="event-category">{venue.type} · {venue.cuisine}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffb800', letterSpacing: '1px' }}>{venue.priceRange}</span>
                </div>
                <h3 className="event-title">{venue.title}</h3>

                <div className="event-details">
                  <div className="event-detail-item"><MapPin size={14} /> {venue.address}</div>
                  <div className="event-detail-item"><Coffee size={14} /> {venue.ambience}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <StarRating rating={venue.rating} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginLeft: '2px' }}>({venue.reviews} reviews)</span>
                </div>

                {venue.offer && (
                  <div style={{
                    padding: '8px 12px', borderRadius: '10px', marginBottom: '12px',
                    background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.2)',
                    fontSize: '0.8rem', color: '#ffb800',
                  }}>
                    {venue.offer}
                  </div>
                )}

                {/* Toggle Reviews */}
                <button
                  onClick={() => setExpandedReviews(expandedReviews === venue.id ? null : venue.id)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--accent-primary)',
                    fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    marginBottom: '4px', padding: 0, fontWeight: '600',
                  }}
                >
                  {expandedReviews === venue.id ? '▲ Hide Reviews' : '▼ Show Reviews'}
                </button>
                <AnimatePresence>
                  {expandedReviews === venue.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <ReviewsSection reviews={venue.reviewsList} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="event-footer" style={{ marginTop: '12px' }}>
                  <span className="event-price" style={{ fontSize: '1.1rem' }}>{venue.price}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setMapVenue(venue)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px',
                        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)',
                        background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.82rem',
                        fontFamily: "'Outfit', sans-serif",
                      }}
                      title="View on Map"
                    >
                      <Map size={14} />
                    </button>
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                      onClick={() => handleBookingRedirect(venue)}
                      disabled={venue.status === 'closed'}
                    >
                      {venue.status === 'closed' ? 'Closed' : 'Book Table'} {venue.status !== 'closed' && <ArrowRight size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <Flame size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No venues match your filters</h3>
          <p>Try adjusting your filters to find the perfect spot.</p>
        </motion.div>
      )}

      {/* Map Modal */}
      <AnimatePresence>
        {mapVenue && <MapModal venue={mapVenue} onClose={() => setMapVenue(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Events;

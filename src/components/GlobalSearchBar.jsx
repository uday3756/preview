import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Tag, ArrowRight, X, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const SEARCH_DATABASE = [
  // Events
  { id: 'e1', title: 'Hubli Music Festival 2026', type: 'event', category: 'Music', price: '₹499', venue: 'Nrupatunga Ground, Hubli', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', date: 'May 15–17, 2026', time: '5:00 PM onwards' },
  { id: 'e2', title: 'Dharwad Lit Fest', type: 'event', category: 'Culture', price: 'Free', venue: 'Town Hall, Dharwad', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800', date: 'June 7, 2026', time: '10:00 AM' },
  { id: 'e3', title: 'Stand-Up Night at Ice Cube', type: 'event', category: 'Comedy', price: '₹299', venue: 'Ice Cube Club, Hubli', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800', date: 'Every Friday', time: '8:30 PM' },
  { id: 'e4', title: 'Yoga on the Lake', type: 'event', category: 'Wellness', price: 'Free', venue: 'Unkal Lake, Hubli', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', date: 'Every Sunday', time: '7:00 AM' },
  { id: 'e5', title: 'Local Craft Market', type: 'event', category: 'Market', price: 'Free Entry', venue: 'Lamington Road, Hubli', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', date: 'May 25, 2026', time: '10 AM – 8 PM' },
  
  // Pubs/Cafes
  { id: 'v1', title: 'Bombay 63', type: 'venue', category: 'Cafe', price: '₹800 cover', venue: 'Gokul Road, Hubli', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800', cuisine: 'Continental, North Indian' },
  { id: 'v2', title: 'Bunkerzz', type: 'venue', category: 'Pub', price: '₹400 cover', venue: 'Shirur Park, Hubli', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', cuisine: 'Multi-Cuisine, Fusion' },
  { id: 'v3', title: 'Ice Cube Club', type: 'venue', category: 'Club', price: '₹1200 cover', venue: 'Coppal Road, Hubli', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800', cuisine: 'European, Continental' },
  { id: 'v4', title: 'The Urban Terrace', type: 'venue', category: 'Rooftop', price: '₹1000 cover', venue: 'Vidyanagar, Hubli', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800', cuisine: 'Continental, Fusion' },
  
  // Workshops
  { id: 'w1', title: 'Clay & Sip Pottery', type: 'workshop', category: 'Art & Craft', price: '₹599', venue: 'Crafty Studio, Hubli', image: 'https://images.unsplash.com/photo-1565192647048-f997ded879f0?auto=format&fit=crop&q=80&w=800', spots: 8 },
  { id: 'w2', title: 'Canvas Painting Masterclass', type: 'workshop', category: 'Painting', price: '₹799', venue: 'Hubli Art Center', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800', spots: 12 },
  { id: 'w3', title: 'Culinary Arts - Gourmet Italian', type: 'workshop', category: 'Cooking', price: '₹1299', venue: 'The Chef\'s Kitchen, Dharwad', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800', spots: 6 },
  { id: 'w4', title: 'HIIT & Aerobics Power Hour', type: 'workshop', category: 'Fitness', price: '₹299', venue: 'Gold\'s Gym, Hubli', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800', spots: 20 },
  { id: 'w5', title: 'Advanced Coding with AI', type: 'workshop', category: 'Tech', price: '₹999', venue: 'BHub Co-working, Hubli', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', spots: 15 }
];

export const GlobalSearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { user } = useAuth();

  // Search logic
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const filtered = SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.venue.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectResult = (item) => {
    setIsOpen(false);
    setQuery('');
    
    // Construct standard checkout redirection
    const payload = { ...item };
    if (!user) {
      navigate('/auth', { state: { redirectTo: '/checkout', event: payload } });
    } else {
      navigate('/checkout', { state: { event: payload } });
    }
  };

  return (
    <div 
      ref={searchRef}
      style={{
        width: '100%',
        background: 'rgba(10, 10, 15, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 0',
        position: 'relative',
        zIndex: 1000
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <Search 
            size={18} 
            color="rgba(255,255,255,0.4)" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            placeholder="🔍 Search Events, VIP Tables, or Workshops near Hubli/Dharwad..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.92rem',
              fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.3s',
            }}
            className="search-input-field"
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setResults([]); }}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Floating Results Popup */}
        <AnimatePresence>
          {isOpen && query.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{
                position: 'absolute',
                top: '56px',
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(13, 13, 20, 0.98)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(138, 43, 226, 0.25)',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(138,43,226,0.15)',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '16px',
                zIndex: 2000
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '1px' }}>
                  SEARCH RESULTS ({results.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                  <Sparkles size={11} /> Lumina Smart Booking
                </span>
              </div>

              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)' }}>
                  No match found. Try searching for "Festival", "Bombay", or "Coding".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {results.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(138, 43, 226, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img src={item.image} alt={item.title} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <span style={{
                              background: item.type === 'venue' ? 'rgba(255,184,0,0.1)' : item.type === 'workshop' ? 'rgba(0,255,136,0.1)' : 'rgba(138,43,226,0.1)',
                              color: item.type === 'venue' ? '#ffb800' : item.type === 'workshop' ? 'var(--success)' : 'var(--accent-primary)',
                              padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase'
                            }}>
                              {item.type === 'venue' ? 'Table' : item.type}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                              {item.category}
                            </span>
                          </div>
                          <h4 style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>{item.title}</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <MapPin size={11} /> {item.venue}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--success)' }}>{item.price}</div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Cover/Pass</span>
                        </div>
                        <ArrowRight size={16} color="var(--accent-primary)" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

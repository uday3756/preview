import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.4 } }
};

const eventsList = [
  { id: 1, title: 'Neon Night at The Vault', venue: 'The Vault Pub', type: 'Pub', status: 'ongoing', price: '$25', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Acoustic Sunday Cafe', venue: 'Brew & Bean Cafe', type: 'Cafe', status: 'upcoming', price: '$15', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Techno Underground', venue: 'Basement Club', type: 'Pub', status: 'closed', price: '$40', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Jazz & Wine Tasting', venue: 'Harmony Lounge', type: 'Cafe', status: 'ongoing', price: '$55', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800' },
];

const Events = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filteredEvents = eventsList.filter(e => filter === 'all' || e.status === filter);

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-header">
        <h1 className="page-title">Pubs & <span className="text-gradient">Cafes</span></h1>
        <p className="page-subtitle">Discover live music, DJ sets, and exclusive parties happening near you.</p>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Events</button>
        <button className={`tab-btn ${filter === 'ongoing' ? 'active' : ''}`} onClick={() => setFilter('ongoing')}>Ongoing</button>
        <button className={`tab-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Upcoming</button>
        <button className={`tab-btn ${filter === 'closed' ? 'active' : ''}`} onClick={() => setFilter('closed')}>Closed</button>
      </div>

      <motion.div layout className="events-grid">
        <AnimatePresence>
          {filteredEvents.map(event => (
            <motion.div 
              key={event.id} 
              layout 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="event-card"
            >
              <div className="event-image-container">
                <img src={event.image} alt={event.title} className="event-image" />
                <div className={`event-badge badge-${event.status}`}>
                  {event.status === 'ongoing' ? 'Live Now' : event.status}
                </div>
              </div>
              <div className="event-content">
                <span className="event-category">{event.type}</span>
                <h3 className="event-title">{event.title}</h3>
                
                <div className="event-details">
                  <div className="event-detail-item">
                    <MapPin size={16} /> {event.venue}
                  </div>
                  <div className="event-detail-item">
                    <Clock size={16} /> {event.status === 'closed' ? 'Event has ended' : 'Ends at 2:00 AM'}
                  </div>
                </div>

                <div className="event-footer">
                  <span className="event-price">{event.price}</span>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '8px 20px' }}
                    onClick={() => navigate('/checkout', { state: { event } })}
                    disabled={event.status === 'closed'}
                    title={event.status === 'closed' ? 'Booking closed' : ''}
                  >
                    {event.status === 'closed' ? 'Closed' : 'Book Ticket'} <ArrowRight size={16} />
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

export default Events;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palette, Scissors, ArrowRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.4 } }
};

const workshopsList = [
  { id: 101, title: 'Clay & Sip: Pottery Making', venue: 'Earth Studio', category: 'Pottery', status: 'upcoming', price: '$45', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800' },
  { id: 102, title: 'Screen Print Your Tote Bag', venue: 'The Craft Room', category: 'Tote Bag', status: 'ongoing', price: '$35', image: 'https://images.unsplash.com/photo-1595337222538-4e891eb2d483?auto=format&fit=crop&q=80&w=800' },
  { id: 103, title: 'Advanced Wheel Throwing', venue: 'Earth Studio', category: 'Pottery', status: 'closed', price: '$60', image: 'https://images.unsplash.com/photo-1565193566173-7a0cb3d90403?auto=format&fit=crop&q=80&w=800' },
  { id: 104, title: 'Abstract Canvas Painting', venue: 'Colors Art Cafe', category: 'Painting', status: 'upcoming', price: '$50', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800' },
];

const Workshops = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filteredWorkshops = workshopsList.filter(w => filter === 'all' || w.category.toLowerCase() === filter.toLowerCase());

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-header">
        <h1 className="page-title">Creative <span className="text-gradient">Workshops</span></h1>
        <p className="page-subtitle">Get hands-on experience in pottery, tote bag making, painting and more.</p>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Workshops</button>
        <button className={`tab-btn ${filter === 'pottery' ? 'active' : ''}`} onClick={() => setFilter('pottery')}>Pottery</button>
        <button className={`tab-btn ${filter === 'tote bag' ? 'active' : ''}`} onClick={() => setFilter('tote bag')}>Tote Bags</button>
        <button className={`tab-btn ${filter === 'painting' ? 'active' : ''}`} onClick={() => setFilter('painting')}>Painting</button>
      </div>

      <motion.div layout className="events-grid">
        <AnimatePresence>
          {filteredWorkshops.map(workshop => (
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
                <img src={workshop.image} alt={workshop.title} className="event-image" />
                <div className={`event-badge badge-${workshop.status}`}>
                  {workshop.status === 'ongoing' ? 'In Session' : workshop.status}
                </div>
              </div>
              <div className="event-content">
                <span className="event-category">{workshop.category}</span>
                <h3 className="event-title">{workshop.title}</h3>
                
                <div className="event-details">
                  <div className="event-detail-item">
                    <Palette size={16} /> {workshop.venue}
                  </div>
                  <div className="event-detail-item">
                    <Scissors size={16} /> All materials included
                  </div>
                </div>

                <div className="event-footer">
                  <span className="event-price">{workshop.price}</span>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '8px 20px' }}
                    onClick={() => navigate('/checkout', { state: { event: workshop } })}
                    disabled={workshop.status === 'closed'}
                    title={workshop.status === 'closed' ? 'Booking closed' : ''}
                  >
                    {workshop.status === 'closed' ? 'Sold Out' : 'Reserve Spot'} <ArrowRight size={16} />
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

export default Workshops;

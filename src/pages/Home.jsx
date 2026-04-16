import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Sparkles } from 'lucide-react';

const homeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="container"
      variants={homeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="page-header" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(138, 43, 226, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '30px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
            <Sparkles size={16} /> Discover the best local events
          </div>
        </motion.div>
        
        <h1 className="page-title">
          Experience <span className="text-gradient">Extraordinary</span> Moments
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.4rem', marginBottom: '40px' }}>
          From vibrant pub nights to creative pottery workshops. Book your next unforgettable experience today.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/events')} style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
            Explore Pubs & Cafes
          </button>
          <button className="btn-outline" onClick={() => navigate('/workshops')} style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
            View Workshops
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '20px' }}>
        {[
          { icon: <Ticket size={32} color="var(--accent-primary)"/>, title: 'Instant Booking', desc: 'Secure your spot seamlessly with zero friction.' },
          { icon: <MapPin size={32} color="var(--success)"/>, title: 'Premium Venues', desc: 'Handpicked cafes, pubs, and art studios.' },
          { icon: <Calendar size={32} color="var(--warning)"/>, title: 'Dynamic Schedule', desc: 'Real-time updates on ongoing and upcoming events.' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            className="glass-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
          >
            <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: '700' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;

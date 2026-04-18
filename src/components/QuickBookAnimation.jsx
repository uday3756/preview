import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';

export const QuickBookAnimation = () => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [20, -20]);
  const rotateY = useTransform(x, [-200, 200], [-20, 20]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ padding: '40px 20px 100px', perspective: '2000px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.8, rotateX: 60, y: 100 }}
        whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '850px',
          padding: '80px 40px',
          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.4) 0%, rgba(20, 20, 30, 0.8) 100%)',
          borderRadius: '40px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 100px rgba(138, 43, 226, 0.25)',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          textAlign: 'center',
          cursor: 'default'
        }}
      >
        <motion.div 
          style={{ transform: 'translateZ(100px)', pointerEvents: 'none' }}
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ 
            display: 'inline-flex', padding: '28px', background: 'rgba(0,0,0,0.6)', 
            borderRadius: '50%', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 40px rgba(138, 43, 226, 0.5)'
          }}>
            <Ticket size={72} color="white" />
          </div>
          
          <h2 style={{ fontSize: '3.8rem', fontWeight: '900', color: 'white', marginBottom: '20px', letterSpacing: '-1px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Your Backstage Pass Awaits.
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '550px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Gain instant access to top-tier pubs, exclusive workshops, and blockbuster casting auditions with a single tap.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.08, backgroundColor: 'var(--accent-primary)', color: 'white' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/events')}
            style={{ 
              padding: '18px 54px', fontSize: '1.2rem', fontWeight: '800', 
              backgroundColor: 'white', color: 'black', 
              borderRadius: '50px', border: 'none', cursor: 'pointer',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)', pointerEvents: 'auto',
              transition: 'background-color 0.3s'
            }}
          >
            Start Booking Now
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

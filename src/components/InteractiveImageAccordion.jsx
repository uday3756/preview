import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const accordionItems = [
  { id: 1, title: 'K.G.F Chapter 2', imageUrl: '/movies/kgf2.jpg' },
  { id: 2, title: 'Kantara', imageUrl: '/movies/kantara.jpg' },
  { id: 3, title: 'Salaar', imageUrl: '/movies/salar.jpg' },
  { id: 4, title: '777 Charlie', imageUrl: '/movies/777 Charlie.jpg' },
  { id: 5, title: 'Bagheera', imageUrl: '/movies/Bagheera.jpg' },
];

const AccordionItem = ({ item, isActive, onMouseEnter }) => {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      data-cursor="PLAY"
      animate={{ width: isActive ? 400 : 80 }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      style={{
        position: 'relative',
        height: '450px',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0
      }}
    >
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%)' }} />
      
      {/* Caption Text styled like the reference */}
      <span style={{
        position: 'absolute',
        color: 'white',
        fontSize: isActive ? '1.4rem' : '1.1rem',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        transition: 'all 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        bottom: isActive ? '30px' : '40px',
        left: '50%',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        transform: isActive ? 'translateX(-50%) rotate(0deg)' : 'translateX(-50%) rotate(-90deg)',
      }}>
        {item.title}
      </span>
    </motion.div>
  );
};

export const LandingAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(4);
  const navigate = useNavigate();

  // Handle responsiveness via state for mobile widths
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ padding: '80px 0', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
        
        {/* Left Side: Text Content */}
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px' }}>
            Accelerate Your <span className="text-gradient">Career</span> in Cinema
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '36px' }}>
            Build your high-performance acting portfolio on-set with the biggest South Indian blockbuster productions without the hassle of unverified agencies.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/hiring')}
            style={{ padding: '14px 32px' }}
          >
            Explore Open Roles
          </button>
        </div>

        {/* Right Side: Image Accordion */}
        <div style={{ 
          flex: '1 1 500px', 
          display: 'flex', 
          gap: '12px', 
          overflowX: 'auto', 
          padding: '20px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none' /* Hide scrollbar Firefox */
        }}>
          {accordionItems.map((item, index) => (
            <AccordionItem 
              key={item.id} 
              item={item} 
              isActive={isMobile ? true : index === activeIndex} // Expand all on tiny mobile if necessary, or just rely on CSS
              onMouseEnter={() => !isMobile && setActiveIndex(index)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

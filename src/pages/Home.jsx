import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { ScrollExpandMedia } from '../components/ScrollExpansionHero';
import { LandingAccordion } from '../components/InteractiveImageAccordion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ overflow: 'hidden' }}
    >
      <ScrollExpandMedia
        mediaSrc="/movies/toxic.mp4"
        bgImageSrc="/movies/salar.jpg"
        title="IMMERSIVE CINEMA"
        date="Next Generation Casting"
        scrollToExpand="SCROLL TO EXPAND"
      >
        {/* Animated Scroll Explanations / Showcase Ads */}
        <div style={{ background: 'var(--bg-primary)', padding: '60px 0 100px 0' }}>
          <div className="container">
            
            {/* Scroll Section 1 - KGF Ad */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px', marginBottom: '140px' }}
            >
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ padding: '6px 14px', background: 'rgba(255,51,102,0.1)', color: 'var(--danger)', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '24px' }}>
                  SPONSORED SHOWCASE
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
                  Enter the <span style={{ color: 'var(--danger)', textShadow: '0 0 20px rgba(255,51,102,0.4)' }}>Underworld</span>.
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.7 }}>
                  Dive deep into the most immersive movie sets of the decade. We are offering exclusive backstage casting roles, extra appearances, and production crew opportunities for India's biggest action blockbusters.
                </p>
                <button className="btn-primary" onClick={() => navigate('/hiring')} style={{ background: 'var(--danger)', boxShadow: '0 4px 20px rgba(255,51,102,0.3)', padding: '14px 32px', fontSize: '1.1rem' }}>
                  Apply For Casting <ArrowRight size={20} />
                </button>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.02, rotateY: -10, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ flex: '1 1 400px', perspective: '1000px', cursor: 'grab' }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(255,51,102,0.3) 0%, transparent 70%)', zIndex: 0, opacity: 0.8 }} />
                  <img src="/movies/kgf.jpg" alt="Featured Blockbuster" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }} />
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll Section 2 - Kantara Ad (Reversed) */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px', marginBottom: '140px' }}
            >
              <motion.div 
                whileHover={{ scale: 1.02, rotateY: 10, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ flex: '1 1 400px', perspective: '1000px', cursor: 'grab' }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)', zIndex: 0, opacity: 0.8 }} />
                  <img src="/movies/kantara.jpg" alt="Local Culture Events" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }} />
                </div>
              </motion.div>

              <div style={{ flex: '1 1 400px' }}>
                <div style={{ padding: '6px 14px', background: 'rgba(0,255,136,0.1)', color: 'var(--success)', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '24px' }}>
                  FEATURED WORKSHOPS
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
                  Connect with <br/><span style={{ color: 'var(--success)', textShadow: '0 0 20px rgba(0,255,136,0.4)' }}>Your Roots</span>.
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.7 }}>
                  Immerse yourself in authentic cultural experiences. From traditional folk arts and high-energy dance groups to calming pottery and canvas painting—book your next creative escape today.
                </p>
                <button 
                  className="btn-outline" 
                  onClick={() => navigate('/workshops')} 
                  style={{ color: 'var(--success)', borderColor: 'var(--success)', padding: '14px 32px', fontSize: '1.1rem' }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(0,255,136,0.1)' }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
                >
                  Discover Workshops <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>

            {/* Quick Metrics / Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '60px' }}
            >
              {[
                { icon: <Ticket size={32} color="var(--accent-primary)"/>, title: 'Instant Booking', desc: 'Secure your spot seamlessly with zero friction.' },
                { icon: <MapPin size={32} color="var(--success)"/>, title: 'Premium Venues', desc: 'Handpicked cafes, pubs, and art studios.' },
                { icon: <Calendar size={32} color="var(--warning)"/>, title: 'Live Scheduling', desc: 'Real-time updates on ongoing and upcoming events.' }
              ].map((feature, i) => (
                <div key={i} className="glass-panel" style={{ textAlign: 'center', padding: '32px 24px' }}>
                  <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontWeight: '700' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* Stunning Interactive Image Accordion */}
        <div style={{ background: 'var(--bg-primary)', paddingBottom: '40px' }}>
          <LandingAccordion />
        </div>
      </ScrollExpandMedia>
    </motion.div>
  );
};

export default Home;

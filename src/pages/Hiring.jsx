import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clapperboard, Star, Volume2, VolumeX, Play, Info } from 'lucide-react';

const moviesList = [
  { id: 1, title: 'K.G.F: Chapter 1', image: '/movies/kgf.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', roles: ['Junior Artist', 'VFX Assistant'] },
  { id: 2, title: 'K.G.F: Chapter 2', image: '/movies/kgf2.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', roles: ['Lighting Tech', 'Sound Engineer'] },
  { id: 3, title: 'K.G.F: Chapter 3', image: '/movies/kgf3.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', roles: ['Lead Actor Auditions', 'Script Writer'] },
  { id: 4, title: 'Kantara', image: '/movies/kantara.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', roles: ['Production Assistant', 'Makeup Artist', 'Folk Dancer'] },
  { id: 5, title: 'Salaar', image: '/movies/salar.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', roles: ['Stunt Double', 'Camera Operator'] },
  { id: 6, title: '777 Charlie', image: '/movies/777 Charlie.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Paramvah Studios', roles: ['Animal Handler', 'Assistant Director'] },
  { id: 7, title: 'Bagheera', image: '/movies/Bagheera.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', roles: ['Costume Designer', 'Set Decorator'] },
  { id: 8, title: 'Kirik Party', image: '/movies/kirikparty.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Paramvah Studios', roles: ['Background Extra', 'Catering Manager'] },
  { id: 9, title: 'Ugramm', image: '/movies/urgram.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Inkfinite Pictures', roles: ['Editor', 'Cinematographer'] },
];

// Individual Card Component to handle Netflix-style hover video playback
const MovieCard = ({ movie, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  let hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 600); // 600ms hover delay
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div 
      className="event-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, zIndex: 10, outline: '3px solid white', transition: { duration: 0.2 } }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <div className="event-image-container" style={{ height: '180px', position: 'relative' }}>
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="event-image" 
          style={{ objectPosition: 'top', opacity: isHovered ? 0 : 1, transition: 'opacity 0.4s ease' }} 
        />
        
        {/* Hover Video Preview */}
        <video 
          ref={videoRef}
          src={movie.previewVideo}
          loop
          muted
          playsInline
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            objectFit: 'cover', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s ease',
            zIndex: 1
          }}
        />

        <div className="event-badge badge-ongoing" style={{ zIndex: 5 }}>
          <Briefcase size={10} style={{ display: 'inline', marginRight: '4px' }} /> Hiring Action
        </div>
      </div>
      
      <div className="event-content" style={{ padding: '16px' }}>
        <span className="event-category" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <Clapperboard size={14} /> {movie.studio}
        </span>
        <h3 className="event-title" style={{ fontSize: '1.2rem', margin: '6px 0 12px' }}>{movie.title}</h3>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Requirements:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {movie.roles.map((role, idx) => (
            <span key={idx} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', color: '#fff' }}>
              {role}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Hiring = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.6 } }} exit={{ opacity: 0 }}>
      {/* 🎬 Netflix-style Hero Video */}
      <div style={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: '-120px', // Pull it under the navbar
        height: '85vh',
        overflow: 'hidden',
        marginBottom: '20px',
        backgroundColor: '#000'
      }}>
        <video 
          src="/movies/toxic.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Gradient Overlay for Fade to Black */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Hero Content Overlay */}
        <div className="container" style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E50914', fontWeight: '800', letterSpacing: '4px', marginBottom: '8px', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              <Star size={16} fill="currentColor" /> Exclusive Original Castings
            </div>
            
            <img src="/movies/kantara.jpg" style={{ display: 'none' }} alt="preload" /> {/* Ensuring early image loads invisibly */}
            
            <h1 className="hero-title">
              TOXIC PREVIEW
            </h1>
            <p className="hero-desc">
              Join the crew of the most anticipated blockbuster of the year. Explore exclusive backstage castings, production opportunities, and lead/extra action roles natively on our platform.
            </p>
            
            <div className="hero-actions">
              <button 
                className="btn-primary" 
                style={{ background: 'white', color: 'black', padding: '12px 32px', fontSize: '1.2rem', borderRadius: '4px', gap: '12px', boxShadow: 'none' }}
              >
                <Play fill="currentColor" size={24} /> Apply For Cast
              </button>
              <button 
                className="btn-outline" 
                style={{ background: 'rgba(109, 109, 110, 0.7)', color: 'white', border: 'none', padding: '12px 32px', fontSize: '1.2rem', borderRadius: '4px', gap: '12px' }}
              >
                <Info size={24} /> Role Info
              </button>
            </div>
          </motion.div>
        </div>

        {/* Volume Controls */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          style={{ 
            position: 'absolute', bottom: '15%', right: '5%', zIndex: 10, 
            width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', 
            background: 'rgba(0,0,0,0.4)', color: 'white', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 20 }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', fontWeight: '700' }}>Trending Productions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '60px' }}>
          {moviesList.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Hiring;

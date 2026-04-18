import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Clapperboard, Star, Volume2, VolumeX, Play, Info,
  Bookmark, BookmarkCheck, Sparkles, Mic, Film, Sword, Laugh, X
} from 'lucide-react';

const moviesList = [
  { id: 1, title: 'K.G.F: Chapter 1', image: '/movies/kgf.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', genre: 'Action', roles: ['Junior Artist', 'VFX Assistant'] },
  { id: 2, title: 'K.G.F: Chapter 2', image: '/movies/kgf2.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', genre: 'Action', roles: ['Lighting Tech', 'Sound Engineer'] },
  { id: 3, title: 'K.G.F: Chapter 3', image: '/movies/kgf3.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', genre: 'Action', roles: ['Lead Actor Auditions', 'Script Writer'] },
  { id: 4, title: 'Kantara', image: '/movies/kantara.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', genre: 'Drama', roles: ['Production Assistant', 'Makeup Artist', 'Folk Dancer'] },
  { id: 5, title: 'Salaar', image: '/movies/salar.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', genre: 'Action', roles: ['Stunt Double', 'Camera Operator'] },
  { id: 6, title: '777 Charlie', image: '/movies/777 Charlie.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Paramvah Studios', genre: 'Drama', roles: ['Animal Handler', 'Assistant Director'] },
  { id: 7, title: 'Bagheera', image: '/movies/Bagheera.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Hombale Films', genre: 'Action', roles: ['Costume Designer', 'Set Decorator'] },
  { id: 8, title: 'Kirik Party', image: '/movies/kirikparty.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Paramvah Studios', genre: 'Comedy', roles: ['Background Extra', 'Catering Manager'] },
  { id: 9, title: 'Ugramm', image: '/movies/urgram.jpg', previewVideo: '/movies/toxic2.mp4', studio: 'Inkfinite Pictures', genre: 'Drama', roles: ['Editor', 'Cinematographer'] },
];

const castingUpdates = [
  { id: 1, title: 'KGF Chapter 3 – Lead Auditions Open', date: 'April 22, 2026', type: 'Audition', hot: true },
  { id: 2, title: 'Kantara 2 – Casting Call for Folk Artists', date: 'April 28, 2026', type: 'Casting Call', hot: true },
  { id: 3, title: 'Salaar 2 – Stunt Coordinator Applications', date: 'May 3, 2026', type: 'Crew', hot: false },
  { id: 4, title: 'Hombale Untitled – Background Extras Needed', date: 'May 10, 2026', type: 'Extras', hot: false },
];

const aiSuggestions = [
  { id: 's1', title: "You'd Nail This: Folk Dancer in Kantara 2", match: 94, image: '/movies/kantara.jpg' },
  { id: 's2', title: 'Trending For You: Lead Actor – KGF 3', match: 88, image: '/movies/kgf3.jpg' },
  { id: 's3', title: 'Based on Your Searches: Cinematographer – Ugramm', match: 81, image: '/movies/urgram.jpg' },
  { id: 's4', title: 'New Posting: Comedy Extra – Kirik Party 2', match: 77, image: '/movies/kirikparty.jpg' },
];

const GENRES = [
  { id: 'all', label: 'All Roles' },
  { id: 'Action', label: '⚔️ Action' },
  { id: 'Drama', label: '🎭 Drama' },
  { id: 'Comedy', label: '😄 Comedy' },
];

const MovieCard = ({ movie, index, bookmarked, onBookmark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
      videoRef.current?.play().catch(() => {});
    }, 600);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setIsHovered(false);
    videoRef.current?.pause();
  };

  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.04, zIndex: 10, transition: { duration: 0.2 } }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <div className="event-image-container" style={{ height: '180px', position: 'relative' }}>
        <img
          src={movie.image}
          alt={`${movie.title} - ${movie.genre} film by ${movie.studio}`}
          className="event-image"
          style={{ objectPosition: 'top', opacity: isHovered ? 0 : 1, transition: 'opacity 0.4s ease' }}
        />
        <video
          ref={videoRef}
          src={movie.previewVideo}
          loop muted playsInline
          aria-label={`Preview clip for ${movie.title}`}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s ease', zIndex: 1,
          }}
        />
        <div className="event-badge badge-ongoing" style={{ zIndex: 5 }}>
          <Briefcase size={10} style={{ display: 'inline', marginRight: '4px' }} /> Hiring
        </div>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onBookmark(movie.id)}
          style={{
            position: 'absolute', bottom: '12px', right: '12px', zIndex: 10,
            background: bookmarked ? 'rgba(138,43,226,0.9)' : 'rgba(0,0,0,0.6)',
            border: 'none', borderRadius: '50%', width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
          }}
          title={bookmarked ? 'Bookmarked' : 'Bookmark'}
          aria-label={bookmarked ? `Remove bookmark for ${movie.title}` : `Bookmark ${movie.title}`}
        >
          {bookmarked ? <BookmarkCheck size={15} color="white" /> : <Bookmark size={15} color="white" />}
        </motion.button>

        <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 10, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: '700', color: '#fff' }}>
          {movie.genre}
        </div>
      </div>

      <div className="event-content" style={{ padding: '16px' }}>
        <span className="event-category" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <Clapperboard size={14} /> {movie.studio}
        </span>
        <h3 className="event-title" style={{ fontSize: '1.1rem', margin: '6px 0 10px' }}>{movie.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '8px' }}>Open Roles:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          {movie.roles.map((role, idx) => (
            <span key={idx} style={{ background: 'rgba(138,43,226,0.15)', border: '1px solid rgba(138,43,226,0.3)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.73rem', color: '#c8a8f8' }}>
              {role}
            </span>
          ))}
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '9px', fontSize: '0.85rem', justifyContent: 'center' }}>
          <Mic size={14} /> Apply Now
        </button>
      </div>
    </motion.div>
  );
};

const Hiring = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [genre, setGenre] = useState('all');
  const [bookmarks, setBookmarks] = useState([]);

  const filteredMovies = moviesList.filter(m => genre === 'all' || m.genre === genre);
  const toggleBookmark = (id) => setBookmarks(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.6 } }} exit={{ opacity: 0 }}>

      {/* Hero Video */}
      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginTop: '-120px', height: '85vh', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#000' }}>
        <video src="/movies/toxic.mp4" autoPlay loop muted={isMuted} playsInline aria-label="Toxic movie preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E50914', fontWeight: '800', letterSpacing: '4px', marginBottom: '8px', textTransform: 'uppercase' }}>
              <Star size={16} fill="currentColor" /> Exclusive Original Castings
            </div>
            <h1 className="hero-title">TOXIC PREVIEW</h1>
            <p className="hero-desc">Join the crew of the most anticipated blockbuster. Explore exclusive backstage castings, production opportunities, and lead action roles on Lumina.</p>
            <div className="hero-actions">
              <button className="btn-primary" style={{ background: 'white', color: 'black', padding: '12px 32px', fontSize: '1.1rem', borderRadius: '4px' }}>
                <Play fill="currentColor" size={22} /> Apply For Cast
              </button>
              <button className="btn-outline" style={{ background: 'rgba(109,109,110,0.7)', color: 'white', border: 'none', padding: '12px 32px', fontSize: '1.1rem', borderRadius: '4px' }}>
                <Info size={22} /> Role Info
              </button>
            </div>
          </motion.div>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          style={{ position: 'absolute', bottom: '15%', right: '5%', zIndex: 10, width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 20 }}>

        {/* Casting Updates Ticker */}
        <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,184,0,0.2)', background: 'rgba(255,184,0,0.05)' }}>
          <div style={{ padding: '10px 20px', background: 'rgba(255,184,0,0.1)', borderBottom: '1px solid rgba(255,184,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic size={15} color="#ffb800" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffb800', letterSpacing: '2px' }}>🔴 LIVE CASTING UPDATES</span>
          </div>
          <div style={{ padding: '12px 0', overflow: 'hidden' }}>
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', whiteSpace: 'nowrap' }}
            >
              {[...castingUpdates, ...castingUpdates].map((u, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '0 32px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                  {u.hot && <span style={{ background: 'var(--danger)', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>HOT</span>}
                  <span style={{ fontWeight: '600', fontSize: '0.88rem' }}>{u.title}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.date}</span>
                  <span style={{ background: 'rgba(138,43,226,0.2)', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>{u.type}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* AI Suggestions */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8a2be2, #ff007f)', borderRadius: '10px', padding: '8px', display: 'flex' }}>
              <Sparkles size={18} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>AI-Suggested <span className="text-gradient">For You</span></h2>
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {aiSuggestions.map((s) => (
              <motion.div key={s.id} whileHover={{ scale: 1.03 }} style={{ flexShrink: 0, width: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(138,43,226,0.3)', background: 'var(--bg-secondary)' }}>
                <div style={{ position: 'relative', height: '130px' }}>
                  <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(138,43,226,0.9)', borderRadius: '10px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>
                    {s.match}% Match
                  </div>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: '600', lineHeight: 1.4, color: '#fff', marginBottom: '10px' }}>{s.title}</p>
                  <button className="btn-primary" style={{ width: '100%', padding: '7px', fontSize: '0.8rem', justifyContent: 'center' }}>View Role</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Genre Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Trending Productions</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => setGenre(g.id)}
                className={`tab-btn ${genre === g.id ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '60px' }}>
          <AnimatePresence>
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} bookmarked={bookmarks.includes(movie.id)} onBookmark={toggleBookmark} />
            ))}
          </AnimatePresence>
        </div>

        {/* Bookmarks Tray */}
        <AnimatePresence>
          {bookmarks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{ marginBottom: '60px', padding: '24px', borderRadius: '20px', background: 'rgba(138,43,226,0.08)', border: '1px solid rgba(138,43,226,0.25)' }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookmarkCheck size={20} color="var(--accent-primary)" /> Saved Roles ({bookmarks.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {moviesList.filter(m => bookmarks.includes(m.id)).map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Clapperboard size={14} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.87rem', fontWeight: '600' }}>{m.title}</span>
                    <button onClick={() => toggleBookmark(m.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', padding: '0 0 0 4px' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Hiring;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import { CustomCursor } from './components/CustomCursor';
import { LuminaChat } from './components/LuminaChat';
import { Menu, X, Moon, Sun, Contrast } from 'lucide-react';
import { GlobalSearchBar } from './components/GlobalSearchBar';

import Home from './pages/Home';
import Events from './pages/Events';
import Event from './pages/Event';
import Workshops from './pages/Workshops';
import Checkout from './pages/Checkout';
import Hiring from './pages/Hiring';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/event" element={<PageTransition><Event /></PageTransition>} />
        <Route path="/workshops" element={<PageTransition><Workshops /></PageTransition>} />
        <Route path="/hiring" element={<PageTransition><Hiring /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const NAV_LINKS = [
  { to: '/', label: 'Home', cursor: 'VIEW' },
  { to: '/event', label: 'Events', cursor: 'RSVP' },
  { to: '/events', label: 'Pubs & Cafés', cursor: 'DRINKS' },
  { to: '/workshops', label: 'Workshops', cursor: 'CREATE' },
  { to: '/hiring', label: 'Movie Roles', cursor: 'ACT' },
  { to: '/contact', label: 'Contact', cursor: 'HI' },
];

function Navbar({ highContrast, setHighContrast }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <nav
        className="navbar"
        style={{
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container nav-content">
          <NavLink to="/" className="logo text-gradient" data-cursor="HOME" aria-label="Lumina home">Lumina</NavLink>

          {/* Desktop Links */}
          <div className="nav-links" role="menubar">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                data-cursor={l.cursor}
                role="menuitem"
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(p => !p)}
              aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                background: highContrast ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
              title="Toggle High Contrast"
            >
              <Contrast size={16} />
            </button>

            {/* Profile / Auth */}
            <AuthNav />

            {/* Book Now (desktop) */}
            <NavLink to="/events" className="btn-primary nav-book-btn" style={{ padding: '8px 20px', fontSize: '0.9rem' }} data-cursor="VIP">
              Book Now
            </NavLink>

            {/* Hamburger (mobile) */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(p => !p)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                display: 'none', width: '40px', height: '40px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                color: '#fff', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            style={{
              position: 'fixed', top: 0, right: 0, width: '80%', maxWidth: '320px', height: '100vh',
              background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)',
              zIndex: 2000, padding: '80px 24px 32px',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                style={{ fontSize: '1.3rem', fontWeight: '700', padding: '12px 0', display: 'block' }}
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ fontSize: '1.3rem', fontWeight: '700', padding: '12px 0', display: 'block' }}>
              Admin 📊
            </NavLink>
            <NavLink to="/events" className="btn-primary" style={{ marginTop: '16px', padding: '14px', justifyContent: 'center' }}>
              Book Now
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1999, backdropFilter: 'blur(4px)' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}

const SearchAndNavbar = ({ highContrast, setHighContrast }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {!isHome && <GlobalSearchBar />}
      <Navbar highContrast={highContrast} setHighContrast={setHighContrast} />
    </>
  );
};

function AuthNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <NavLink to="/profile" aria-label="My Profile"
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #8a2be2, #ff007f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: '700', textDecoration: 'none',
            color: '#fff', border: '2px solid rgba(255,255,255,0.2)'
          }}
          title={`Logged in as ${user.name}`}
        >
          {user.name.split(' ').map(n => n[0]).join('')}
        </NavLink>
        <button 
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <NavLink to="/auth" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
      Sign In
    </NavLink>
  );
}

function App() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CustomCursor />
        <Router>
          <div className="app-container">
            <SearchAndNavbar highContrast={highContrast} setHighContrast={setHighContrast} />
            <main className="main-content" id="main-content" role="main">
              <AnimatedRoutes />
            </main>
          </div>
          <LuminaChat />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

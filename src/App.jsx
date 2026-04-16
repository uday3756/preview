import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Events from './pages/Events';
import Workshops from './pages/Workshops';
import Checkout from './pages/Checkout';
import Hiring from './pages/Hiring';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="container nav-content">
            <NavLink to="/" className="logo text-gradient">Lumina</NavLink>
            <div className="nav-links">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
              <NavLink to="/events" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Pubs & Cafes</NavLink>
              <NavLink to="/workshops" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Workshops</NavLink>
              <NavLink to="/hiring" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Movie Roles</NavLink>
            </div>
            <NavLink to="/events" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              Book Now
            </NavLink>
          </div>
        </nav>
        
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/hiring" element={<Hiring />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;

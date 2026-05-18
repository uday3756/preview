import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, AtSign, Share2, PlayCircle, Check } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }, 4000);
  };

  const contactInfo = [
    { icon: <Mail size={20} />, label: 'Email', value: 'hello@lumina.in', color: 'var(--accent-primary)' },
    { icon: <Phone size={20} />, label: 'Phone', value: '+91 98765 43210', color: 'var(--success)' },
    { icon: <MapPin size={20} />, label: 'Office', value: 'Keshwapur, Hubli, Karnataka', color: '#ffb800' },
  ];

  const socials = [
    { icon: <Instagram size={20} />, label: 'Instagram', href: '#' },
    { icon: <Share2 size={20} />, label: 'Twitter / X', href: '#' },
    { icon: <PlayCircle size={20} />, label: 'YouTube', href: '#' },
  ];

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-header">
        <h1 className="page-title">Contact <span className="text-gradient">Us</span></h1>
        <p className="page-subtitle">We're here to help with bookings, events, and partnerships. Reach out anytime!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '20px', paddingBottom: '60px' }}>
        {/* Left — Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Info Cards */}
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-panel"
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${info.color}18`, border: `1px solid ${info.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: info.color, flexShrink: 0 }}>
                {info.icon}
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>{info.label}</div>
                <div style={{ fontWeight: '600', fontSize: '0.97rem' }}>{info.value}</div>
              </div>
            </motion.div>
          ))}

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '1rem' }}>Follow Lumina</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                  style={{
                    width: '46px', height: '46px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(138,43,226,0.2)'; e.currentTarget.style.borderColor = 'rgba(138,43,226,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Map Embed */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '220px' }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=75.1190%2C15.3570%2C75.1290%2C15.3670&layer=mapnik&marker=15.3617%2C75.1240"
              title="Lumina Office Location - Hubli"
              style={{ width: '100%', height: '100%', border: 'none' }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Right — Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="glass-panel"
          style={{ padding: '32px' }}
        >
          {sent ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Check size={32} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Message Sent! 🎉</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>Send a Message</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Your Name</label>
                    <input id="contact-name" className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email Address</label>
                    <input id="contact-email" className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject</label>
                  <input id="contact-subject" className="form-input" name="subject" value={form.subject} onChange={handleChange} placeholder="Event Booking · Workshop Query · Partnership..." required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-msg">Message</label>
                  <textarea
                    id="contact-msg"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-input"
                    placeholder="Tell us how we can help you..."
                    style={{ resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
                  <Send size={18} /> Send Message
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;

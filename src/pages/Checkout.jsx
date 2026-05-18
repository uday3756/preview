import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import {
  CreditCard, Wallet, AlertCircle, CheckCircle2, Tag, ChevronRight,
  Plus, Minus, Info, MapPin, Calendar, Clock, Sparkles, Smartphone, X, Check
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
};

// Available Table Categories for Pubs/Cafés
const TABLE_CATEGORIES = [
  {
    id: 'standard',
    name: 'Standard Table',
    price: 0,
    desc: 'Included in base cover. Standard restaurant seating area.',
    icon: '🍽️'
  },
  {
    id: 'vip',
    name: 'VIP Booth Lounge',
    price: 1000,
    desc: 'Premium leather booths with prime acoustics & near-stage views.',
    icon: '👑'
  },
  {
    id: 'rooftop',
    name: 'Rooftop Starlight Table',
    price: 1500,
    desc: 'Romantic open-air dining under the stars with spectacular Hubli city views.',
    icon: '🌌'
  },
  {
    id: 'private',
    name: 'Private Dining Cabin',
    price: 2500,
    desc: 'Luxury soundproof private room with a dedicated butler service.',
    icon: '🥂'
  }
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Protect page: Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { redirectTo: '/checkout', event: location.state?.event } });
    }
  }, [user, navigate, location.state]);

  const event = location.state?.event;

  // Checkout states
  const [tableCategory, setTableCategory] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'razorpay' | 'paypal'
  
  // Stripe form fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // Razorpay form fields
  const [upiId, setUpiId] = useState('');
  
  // Testing State: Success vs Failure simulation toggle
  const [paymentSimResult, setPaymentSimResult] = useState('success'); // 'success' | 'failure'
  const [failureReason, setFailureReason] = useState('Insufficent Funds'); // Custom reason
  
  // Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [emailNotificationSent, setEmailNotificationSent] = useState(false);

  // If no event selected
  if (!event) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <AlertCircle size={48} color="var(--warning)" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>No Booking Selected</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Please browse events, pubs, or workshops and make a selection first.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '24px' }}>Browse Home</button>
      </div>
    );
  }

  // Parse price helper
  const getBasePrice = () => {
    if (!event.price) return 0;
    if (event.price.toLowerCase().includes('free')) return 0;
    const cleaned = event.price.replace(/[₹\$,/person]/gi, '').trim();
    return parseFloat(cleaned) || 0;
  };

  const basePrice = getBasePrice();
  const isPubOrCafe = event.cuisine || event.type === 'venue';
  const isWorkshop = event.spots !== undefined || event.type === 'workshop';
  const isGeneralEvent = !isPubOrCafe && !isWorkshop;

  // Selected upgrades pricing
  const upgradeCost = isPubOrCafe ? (TABLE_CATEGORIES.find(c => c.id === tableCategory)?.price || 0) : 0;
  
  // Total pricing calculator
  const ticketSubtotal = isGeneralEvent ? (basePrice * guestCount) : basePrice;
  const subtotal = ticketSubtotal + upgradeCost;
  const processingFee = subtotal > 0 ? 50 : 0; // Flat ₹50 processing fee if price > 0

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = subtotal * (appliedPromo.val / 100);
      if (appliedPromo.max) {
        discountAmount = Math.min(discountAmount, appliedPromo.max);
      }
    } else if (appliedPromo.type === 'flat') {
      discountAmount = Math.min(appliedPromo.val, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + processingFee - discountAmount);

  // Dynamic promo application helper
  const handleApplyPromo = (codeToApply) => {
    setPromoError('');
    const code = (codeToApply || promoCode).toUpperCase().trim();
    
    if (code === 'WELCOME50') {
      setAppliedPromo({ code: 'WELCOME50', type: 'percent', val: 50, max: 500 });
      setPromoCode('WELCOME50');
    } else if (code === 'LUMINA20') {
      setAppliedPromo({ code: 'LUMINA20', type: 'percent', val: 20 });
      setPromoCode('LUMINA20');
    } else if (code === 'HAPPYHOUR' && isPubOrCafe) {
      setAppliedPromo({ code: 'HAPPYHOUR', type: 'flat', val: 300 });
      setPromoCode('HAPPYHOUR');
    } else {
      setPromoError('Invalid coupon code. Try WELCOME50 or LUMINA20.');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Mock Card formatting helper
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  // Submit payment logic
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      
      if (paymentSimResult === 'success') {
        const refNum = `LUM-${event.category ? 'WK' : isPubOrCafe ? 'PB' : 'EV'}-${Math.floor(100000 + Math.random() * 900000)}`;
        setGeneratedRef(refNum);
        
        // Construct booking record
        const booking = {
          ref: refNum,
          id: event.id || Math.floor(1000 + Math.random() * 9000),
          title: event.title,
          image: event.image,
          venue: event.venue || event.address || 'Lumina Premium Venue',
          price: `₹${grandTotal.toFixed(2)}`,
          date: event.date instanceof Date ? event.date.toLocaleDateString('en-IN') : (event.date || 'Flexible Date'),
          time: event.time || 'N/A',
          category: isPubOrCafe ? TABLE_CATEGORIES.find(c => c.id === tableCategory)?.name : 'N/A',
          discount: appliedPromo ? `${appliedPromo.code} (-₹${discountAmount.toFixed(0)})` : 'None',
          type: isPubOrCafe ? 'venue' : isWorkshop ? 'workshop' : 'event',
          status: 'Confirmed',
          bookingDate: new Date().toISOString(),
          email: user?.email || 'guest@lumina.com',
          guestCount: guestCount
        };

        // Save to LocalStorage
        const existingBookings = JSON.parse(localStorage.getItem('lumina_bookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('lumina_bookings', JSON.stringify(existingBookings));

        setIsSuccess(true);
        setEmailNotificationSent(true);

        // Clear email sent status after a delay
        setTimeout(() => {
          setEmailNotificationSent(false);
        }, 5000);

      } else {
        setIsFailure(true);
      }
    }, 2000);
  };

  // Success view
  if (isSuccess) {
    return (
      <motion.div
        className="container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        style={{ textAlign: 'center', paddingTop: '60px', maxWidth: '650px' }}
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ marginBottom: '24px' }}
        >
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'rgba(0, 255, 136, 0.1)', border: '2px solid var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
          }}>
            <CheckCircle2 size={54} color="var(--success)" />
          </div>
        </motion.div>

        <h1 className="page-title text-gradient" style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '8px' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Your payment was processed successfully. Have your tickets ready!
        </p>

        {/* Dynamic Booking Pass card */}
        <div className="glass-panel" style={{ textAlign: 'left', padding: '24px', borderRadius: '24px', border: '1px solid rgba(0, 255, 136, 0.2)', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px',
            borderRadius: '50%', background: 'var(--success)', filter: 'blur(50px)', opacity: 0.15
          }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>BOOKING REFERENCE</span>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{generatedRef}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>STATUS</span>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                🟢 CONFIRMED
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <img src={event.image} alt={event.title} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>{event.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} /> {event.venue || event.address}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date & Time</span>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
                {event.date instanceof Date ? event.date.toLocaleDateString('en-IN') : event.date}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Selected Tier</span>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
                {isPubOrCafe ? TABLE_CATEGORIES.find(c => c.id === tableCategory)?.name : isWorkshop ? 'Standard Access' : `${guestCount} Guest(s)`}
              </div>
            </div>
          </div>
        </div>

        {/* Email toast simulation */}
        <AnimatePresence>
          {emailNotificationSent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: '12px', padding: '12px 20px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                color: 'var(--success)', fontSize: '0.9rem', fontWeight: '600'
              }}
            >
              ✉️ Confirmation receipt email dispatched to {user?.email}!
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-outline" onClick={() => navigate('/')}>Return Home</button>
          <button className="btn-primary" onClick={() => navigate('/profile')}>Go to Dashboard</button>
        </div>
      </motion.div>
    );
  }

  // Failure view
  if (isFailure) {
    return (
      <motion.div
        className="container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        style={{ textAlign: 'center', paddingTop: '60px', maxWidth: '600px' }}
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring' }}
          style={{ marginBottom: '24px' }}
        >
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'rgba(255, 51, 102, 0.1)', border: '2px solid var(--danger)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
          }}>
            <AlertCircle size={54} color="var(--danger)" />
          </div>
        </motion.div>

        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--danger)', marginBottom: '8px' }}>
          Payment Failed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>
          We could not process this transaction. Reason: <strong style={{ color: '#fff' }}>{failureReason}</strong>
        </p>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255, 51, 102, 0.2)', marginBottom: '32px', textAlign: 'left' }}>
          <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Common fixes:</h4>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '20px', lineHeight: 1.6 }}>
            <li>Verify card credentials or secure SMS OTP digits.</li>
            <li>Select an alternative payment method (e.g. Razorpay UPI or PayPal).</li>
            <li>Ensure the simulated gateway is toggled to "Success" at the bottom of the checkout page.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-outline" onClick={() => navigate(-1)}>Exit Checkout</button>
          <button className="btn-primary" style={{ background: 'var(--danger)', boxShadow: '0 4px 15px rgba(255, 51, 102, 0.3)' }} onClick={() => { setIsFailure(false); setIsProcessing(false); }}>
            Retry Payment
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingBottom: '80px' }}>
      {/* Dynamic Loader Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.92)',
              backdropFilter: 'blur(10px)', zIndex: 10000,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '4px solid rgba(138,43,226,0.1)', borderTopColor: 'var(--accent-primary)',
              animation: 'spin 1s linear infinite', marginBottom: '24px'
            }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Verifying Transaction
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Securely communicating with bank servers, please wait...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-header" style={{ textAlign: 'left', paddingBottom: '20px' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem' }}>Secure <span className="text-gradient">Checkout</span></h1>
        <p className="page-subtitle">Fully encrypted checkout powered by Stripe &amp; Razorpay.</p>
      </div>

      <div className="checkout-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Form and Selection Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Step 1: Upgrades (For Pubs & Cafes) */}
          {isPubOrCafe && (
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--accent-primary)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                Select Table Category
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {TABLE_CATEGORIES.map(category => (
                  <div
                    key={category.id}
                    onClick={() => setTableCategory(category.id)}
                    style={{
                      padding: '16px', borderRadius: '16px', cursor: 'pointer',
                      background: tableCategory === category.id ? 'rgba(138,43,226,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${tableCategory === category.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', gap: '16px', alignItems: 'center', transition: 'all 0.2s',
                      boxShadow: tableCategory === category.id ? '0 0 20px rgba(138,43,226,0.2)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h4 style={{ fontWeight: '700', fontSize: '0.98rem' }}>{category.name}</h4>
                        <span style={{ fontWeight: '800', color: category.price === 0 ? 'var(--success)' : '#ffb800' }}>
                          {category.price === 0 ? 'Included' : `+₹${category.price}`}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>{category.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Guest Count (For General Events) */}
          {isGeneralEvent && (
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--accent-primary)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                Select Ticket Quantity
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>General Admission Pass</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>Choose count. Max 5 tickets per user.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                    disabled={guestCount <= 1}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Minus size={15} />
                  </button>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>{guestCount}</span>
                  <button
                    onClick={() => setGuestCount(c => Math.min(5, c + 1))}
                    disabled={guestCount >= 5}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Batch Info (For Workshops) */}
          {isWorkshop && (
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--accent-primary)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                Enrollment Details
              </h3>
              <div style={{ padding: '16px 20px', background: 'rgba(0, 255, 136, 0.04)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'start' }}>
                <Info size={20} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.98rem', color: '#fff', marginBottom: '4px' }}>Guaranteed Spot Secured</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                    Your spot is temporarily locked for 10 minutes. Complete checkout to finalize your registration for the workshop.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--accent-primary)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
              Select Payment Method
            </h3>

            {/* Payment tab selections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              <div
                className={`payment-method ${paymentMethod === 'stripe' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('stripe')}
                style={{
                  border: `1.5px solid ${paymentMethod === 'stripe' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                  background: paymentMethod === 'stripe' ? 'rgba(138,43,226,0.1)' : 'rgba(255,255,255,0.03)',
                  padding: '12px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer', transition: '0.2s'
                }}
              >
                <CreditCard size={20} style={{ margin: '0 auto 6px', color: paymentMethod === 'stripe' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>Stripe (Card)</span>
              </div>

              <div
                className={`payment-method ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
                style={{
                  border: `1.5px solid ${paymentMethod === 'razorpay' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                  background: paymentMethod === 'razorpay' ? 'rgba(138,43,226,0.1)' : 'rgba(255,255,255,0.03)',
                  padding: '12px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer', transition: '0.2s'
                }}
              >
                <Smartphone size={20} style={{ margin: '0 auto 6px', color: paymentMethod === 'razorpay' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>Razorpay (UPI)</span>
              </div>

              <div
                className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
                style={{
                  border: `1.5px solid ${paymentMethod === 'paypal' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
                  background: paymentMethod === 'paypal' ? 'rgba(138,43,226,0.1)' : 'rgba(255,255,255,0.03)',
                  padding: '12px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer', transition: '0.2s'
                }}
              >
                <Wallet size={20} style={{ margin: '0 auto 6px', color: paymentMethod === 'paypal' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>PayPal</span>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit}>
              {paymentMethod === 'stripe' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      CARDHOLDER NAME
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                      placeholder="e.g. Rahul Patil"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                      placeholder="4000 0000 0000 0000 (Try 4000... for Success)"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        EXPIRY DATE
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        className="form-input"
                        style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                        placeholder="123"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'razorpay' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ background: '#fff', padding: '6px', borderRadius: '8px' }}>
                      {/* Generates a simple text representation of a QR code */}
                      <span style={{ fontSize: '1.8rem' }}>📱</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '0.92rem' }}>UPI QR Code Simulation</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Scan and pay directly using any preferred UPI App.</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      ENTER VIRTUAL PAYMENT ADDRESS (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }}
                      placeholder="e.g. username@okaxis"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div style={{ padding: '24px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>💳</span>
                  <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>PayPal Sandbox Redirect</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto' }}>
                    Upon clicking pay, you will be redirected to PayPal's secure checkout popup overlay to authorize the transaction.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '24px', justifyContent: 'center' }}
              >
                Pay Grand Total: ₹{grandTotal.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Step 3: Developer Simulation Panel */}
          <div className="glass-panel" style={{ border: '1px dashed rgba(138,43,226,0.3)', background: 'rgba(138,43,226,0.03)' }}>
            <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔧 GATEWAY TESTING CONTROLS
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '16px', lineHeight: 1.4 }}>
              As a tester, you can pre-configure the simulated transaction response below to validate both Success and Error layouts.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>SIMULATED RESPONSE</label>
                <select
                  value={paymentSimResult}
                  onChange={e => setPaymentSimResult(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }}
                >
                  <option value="success" style={{ background: '#000' }}>✅ Simulate Success</option>
                  <option value="failure" style={{ background: '#000' }}>❌ Simulate Failure</option>
                </select>
              </div>

              {paymentSimResult === 'failure' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>FAILURE REASON</label>
                  <select
                    value={failureReason}
                    onChange={e => setFailureReason(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }}
                  >
                    <option value="Insufficent Funds" style={{ background: '#000' }}>Insufficient Funds</option>
                    <option value="3D Secure Verification Failed" style={{ background: '#000' }}>3D Secure Failed</option>
                    <option value="Card Expired" style={{ background: '#000' }}>Expired Card</option>
                    <option value="Limit Exceeded" style={{ background: '#000' }}>Limit Exceeded</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '800' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px' }}>
              <img src={event.image} alt={event.title} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '4px', lineHeight: 1.3 }}>{event.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {event.venue || event.address}
                </p>
              </div>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Base Ticket {isGeneralEvent && `(x${guestCount})`}
                </span>
                <span style={{ color: '#fff', fontWeight: '600' }}>
                  ₹{ticketSubtotal.toFixed(2)}
                </span>
              </div>

              {isPubOrCafe && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Table Category Upgrade</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>
                    +₹{upgradeCost.toFixed(2)}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--success)' }}>
                  <span>Discount ({appliedPromo?.code})</span>
                  <span style={{ fontWeight: '700' }}>
                    -₹{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Processing Fee</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>
                  ₹{processingFee.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '700' }}>Grand Total</span>
              <span className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: '900' }}>
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Promo Codes application interface */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  APPLY PROMO CODE
                </span>
                <Tag size={13} color="var(--text-secondary)" />
              </div>

              {!appliedPromo ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. WELCOME50"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => handleApplyPromo()}
                    style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '10px', padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: '700' }}>
                    <Check size={14} /> {appliedPromo.code} Applied
                  </div>
                  <button onClick={handleRemovePromo} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}>
                    <X size={14} />
                  </button>
                </div>
              )}

              {promoError && (
                <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '6px', fontWeight: '600' }}>
                  ⚠️ {promoError}
                </div>
              )}

              {/* Promo chips shortcuts */}
              {!appliedPromo && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  <button onClick={() => handleApplyPromo('WELCOME50')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px 10px', fontSize: '0.72rem', color: '#ffb800', cursor: 'pointer', fontWeight: '700' }}>
                    🎟️ WELCOME50
                  </button>
                  <button onClick={() => handleApplyPromo('LUMINA20')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px 10px', fontSize: '0.72rem', color: '#ffb800', cursor: 'pointer', fontWeight: '700' }}>
                    🎟️ LUMINA20
                  </button>
                  {isPubOrCafe && (
                    <button onClick={() => handleApplyPromo('HAPPYHOUR')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px 10px', fontSize: '0.72rem', color: '#ffb800', cursor: 'pointer', fontWeight: '700' }}>
                      🍺 HAPPYHOUR
                  </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Checkout;

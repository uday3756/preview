import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!event) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <AlertCircle size={48} color="var(--warning)" style={{ margin: '0 auto 20px' }} />
        <h2>No Event Selected</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Please select an event or workshop first.</p>
        <button className="btn-primary" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>Go Back</button>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" style={{ textAlign: 'center', paddingTop: '100px', maxWidth: '600px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 size={80} color="var(--success)" style={{ margin: '0 auto 24px' }} />
        </motion.div>
        <h1 className="page-title text-gradient" style={{ fontSize: '2.5rem' }}>Payment Successful!</h1>
        <p className="page-subtitle" style={{ marginBottom: '40px' }}>Your booking for <strong>{event.title}</strong> is confirmed. A receipt has been sent to your email.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Return to Home</button>
      </motion.div>
    );
  }

  const fee = 5.00;
  const subtotal = parseFloat(event.price.replace('$', ''));
  const total = subtotal + fee;

  return (
    <motion.div className="container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="page-header" style={{ textAlign: 'left', paddingBottom: '20px' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem' }}>Secure <span className="text-gradient">Checkout</span></h1>
      </div>

      <div className="checkout-container">
        <div>
          <div className="glass-panel" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Payment Details</h3>
            
            <div className="payment-methods">
              <div className={`payment-method ${method === 'card' ? 'active' : ''}`} onClick={() => setMethod('card')}>
                <CreditCard size={24} style={{ margin: '0 auto 8px', color: method === 'card' ? 'var(--accent-primary)' : 'inherit' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Credit Card</span>
              </div>
              <div className={`payment-method ${method === 'paypal' ? 'active' : ''}`} onClick={() => setMethod('paypal')}>
                <Wallet size={24} style={{ margin: '0 auto 8px', color: method === 'paypal' ? 'var(--accent-primary)' : 'inherit' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>PayPal</span>
              </div>
            </div>

            <form className="checkout-form" onSubmit={handlePayment}>
              {method === 'card' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" className="form-input" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" className="form-input" placeholder="0000 0000 0000 0000" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input type="text" className="form-input" placeholder="MM/YY" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVC</label>
                      <input type="text" className="form-input" placeholder="123" required />
                    </div>
                  </div>
                </>
              )}
              {method === 'paypal' && (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>You will be redirected to PayPal to complete your purchase securely.</p>
                </div>
              )}
              
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '10px' }} disabled={isProcessing}>
                {isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div className="checkout-summary">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <img src={event.image} alt="Event" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{event.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{event.venue}</p>
              </div>
            </div>
            
            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Ticket Price</span>
              <span>{event.price}</span>
            </div>
            <div className="summary-row" style={{ borderBottom: 'none' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Processing Fee</span>
              <span>${fee.toFixed(2)}</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span className="text-gradient">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;

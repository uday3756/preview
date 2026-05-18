import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Mail, Lock, User, Calendar, MapPin, ArrowRight, Globe, Command } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, signup, loginWithPhone, setupRecaptcha } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setupRecaptcha('recaptcha-container');
      const res = await loginWithPhone(phoneNumber);
      if (res.success) {
        setConfirmationResult(res.confirmationResult);
        setOtpSent(true);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await confirmationResult.confirm(verificationCode);
      const redirectPath = location.state?.redirectTo || '/profile';
      const redirectState = location.state?.event ? { event: location.state.event } : null;
      navigate(redirectPath, { state: redirectState });
    } catch (err) {
      setError('Invalid verification code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        const redirectPath = location.state?.redirectTo || '/profile';
        const redirectState = location.state?.event ? { event: location.state.event } : null;
        navigate(redirectPath, { state: redirectState });
      }
      else setError(res.message);
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }
      const res = await signup(formData);
      if (res.success) {
        const redirectPath = location.state?.redirectTo || '/profile';
        const redirectState = location.state?.event ? { event: location.state.event } : null;
        navigate(redirectPath, { state: redirectState });
      }
      else setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const googleUser = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };
    
    // Simulate login with google info
    const res = await signup(googleUser); 
    if (res.success || res.message === 'Email already exists') {
      // If user exists, just log them in
      await login(googleUser.email, 'google_session'); // Mocking google session
      const redirectPath = location.state?.redirectTo || '/profile';
      const redirectState = location.state?.event ? { event: location.state.event } : null;
      navigate(redirectPath, { state: redirectState });
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at top right, rgba(138, 43, 226, 0.15), transparent), radial-gradient(circle at bottom left, rgba(255, 0, 127, 0.1), transparent)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px',
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #8a2be2, #ff007f)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 10px 20px rgba(138, 43, 226, 0.3)'
            }}
          >
            🎭
          </motion.div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Join Lumina'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Enter your credentials to access your portal' : 'Start your cinematic journey today'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(255, 71, 87, 0.1)',
              color: '#ff4757',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 71, 87, 0.2)'
            }}
          >
            {error}
          </motion.div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button 
            onClick={() => { setAuthMethod('email'); setError(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: authMethod === 'email' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
          >
            Email
          </button>
          <button 
            onClick={() => { setAuthMethod('phone'); setError(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: authMethod === 'phone' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
          >
            Phone
          </button>
        </div>

        {authMethod === 'email' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Form Fields (Name, Email, Password) */}
            {!isLogin && (
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type="text"
                    placeholder="Arjun Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
            )}
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '14px', marginTop: '12px', justifyContent: 'center' }}>
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
            </motion.button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleVerifyOtp : handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                {otpSent ? 'Verification Code' : 'Phone Number'}
              </label>
              <div style={{ position: 'relative' }}>
                {otpSent ? (
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                ) : (
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  />
                )}
              </div>
            </div>
            <div id="recaptcha-container"></div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '14px', marginTop: '12px', justifyContent: 'center' }}>
              {otpSent ? 'Verify OTP' : 'Send OTP'} <ArrowRight size={18} />
            </motion.button>
          </form>
        )}

        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
            theme="filled_black"
            shape="pill"
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontWeight: '700',
              marginLeft: '6px',
              cursor: 'pointer'
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;

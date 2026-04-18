import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const ScrollExpandMedia = ({
  mediaSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  children
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaSrc]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        if(e.cancelable) e.preventDefault();
      } else if (!mediaFullyExpanded) {
        if(e.cancelable) e.preventDefault();
        // Increase sensitivity for mobile, especially when scrolling back
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005; 
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    // Passive false is critical so e.preventDefault() works and cancels native scroll.
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Use the exact original math dimensions
  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={sectionRef} style={{ transition: 'background-color 0.7s ease-in-out', overflowX: 'hidden' }}>
      <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh' }}>
        
        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
          
          <motion.div
            style={{ position: 'absolute', inset: 0, zIndex: 0, height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt='Background'
              style={{ width: '100vw', height: '100vh', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', position: 'relative' }}>
              
              {/* Media Card */}
              <div
                style={{
                  position: 'absolute', zIndex: 0, top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '1rem',
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <video
                    src={mediaSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }} />
                  <motion.div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: '1rem' }}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 10, marginTop: '16px', transition: 'none' }}>
                  {date && (
                    <p style={{ fontSize: '1.5rem', color: '#bfdbfe', transform: `translateX(-${textTranslateX}vw)` }}>
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p style={{ color: '#bfdbfe', fontWeight: '500', textAlign: 'center', transform: `translateX(${textTranslateX}vw)` }}>
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Title texts blending */}
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', width: '100%', position: 'relative', zIndex: 10, flexDirection: 'column', mixBlendMode: 'difference' }}
              >
                <motion.h2
                  style={{ fontSize: isMobileState ? '2.5rem' : '4rem', fontWeight: 'bold', color: '#bfdbfe', transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  style={{ fontSize: isMobileState ? '2.5rem' : '4rem', fontWeight: 'bold', textAlign: 'center', color: '#bfdbfe', transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            {/* Content exactly as the prompt designed it */}
            <motion.section
              style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '40px 20px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>

          </div>
        </div>
      </section>
    </div>
  );
};

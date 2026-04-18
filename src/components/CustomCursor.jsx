import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's a touch device / mobile width
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      // Look for data-cursor attribute or fall back to native interactive elements
      const interactiveElement = target.closest('a, button, [data-cursor]');
      
      if (interactiveElement) {
        setIsHovering(true);
        const text = interactiveElement.getAttribute('data-cursor');
        setCursorText(text || ''); // Empty means it still expands, but shows no text
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    if (!isMobile) {
      window.addEventListener('mousemove', onMouseMove);
      document.documentElement.addEventListener('mouseleave', onMouseLeave);
      document.documentElement.addEventListener('mouseenter', onMouseEnter);
      
      // Inject global CSS to hide default cursor
      const style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.innerHTML = `
        * { cursor: none !important; }
        input, textarea, [contenteditable="true"] { cursor: text !important; }
      `;
      document.head.appendChild(style);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      
      const styleEl = document.getElementById('custom-cursor-style');
      if (styleEl) document.head.removeChild(styleEl);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999, // Ensure it's above everything
        display: isVisible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '800',
        fontSize: '0.8rem',
        letterSpacing: '2px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        willChange: 'transform'
      }}
      animate={{
        x: mousePosition.x - (isHovering ? 45 : 10),
        y: mousePosition.y - (isHovering ? 45 : 10),
        width: isHovering ? 90 : 20,
        height: isHovering ? 90 : 20,
        backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : '#fff',
        backdropFilter: isHovering ? 'blur(4px)' : 'none',
        WebkitBackdropFilter: isHovering ? 'blur(4px)' : 'none', // Safari support
        border: isHovering ? '1px solid rgba(255,255,255,0.4)' : 'none',
        borderRadius: '50%',
        mixBlendMode: isHovering && !cursorText ? 'difference' : 'normal'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.5 }}
    >
      <AnimatePresence>
        {isHovering && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            {cursorText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

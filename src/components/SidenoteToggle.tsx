import React, { useState, useEffect } from 'react';
import { subscribeToVisibility, toggleSidenotes } from './noteState';

export default function SidenoteToggle() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 760);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToVisibility((visible) => {
      setIsVisible(visible);
    });
    return unsubscribe;
  }, []);

  if (!isMobile) return null;

  return (
    <button
      onClick={toggleSidenotes}
      className="sidenote-toggle"
      title={`${isVisible ? 'Hide' : 'Show'} all sidenotes`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isVisible ? (
          <>
            <circle cx="12" cy="12" r="8" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              style={{ fontSize: '10px', fontWeight: 'bold' }}
            >
              1
            </text>
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="8" strokeDasharray="4 4" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              style={{ fontSize: '10px', fontWeight: 'bold' }}
            >
              1
            </text>
          </>
        )}
      </svg>
    </button>
  );
} 
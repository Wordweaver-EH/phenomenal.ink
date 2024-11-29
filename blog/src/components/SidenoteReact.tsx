import React, { useState, useEffect, useRef } from 'react';
import { subscribeToHighlight, setHighlightedNote, subscribeToVisibility } from './noteState';

interface SidenoteProps {
  children: React.ReactNode;
  number: number;
  id?: string;
}

export default function SidenoteReact({ children, number, id = `sn-${number}` }: SidenoteProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const noteRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 760;
      setIsMobile(isMobileView);
      
      if (noteRef.current && numberRef.current) {
        if (isMobileView) {
          // Find the parent paragraph
          let parentParagraph = numberRef.current.closest('p');
          if (!parentParagraph) return;

          // Move the note (but not the number) to the end of the paragraph
          parentParagraph.appendChild(noteRef.current);
          
          noteRef.current.classList.add('mobile-block');
          noteRef.current.classList.remove('mobile');
        } else {
          // In desktop view, move the note right after the number
          if (numberRef.current.nextSibling !== noteRef.current) {
            numberRef.current.after(noteRef.current);
          }
          noteRef.current.classList.remove('mobile-block');
          noteRef.current.classList.add('mobile');
        }
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToHighlight((highlightedId) => {
      setIsHighlighted(highlightedId === id);
    });
    return unsubscribe;
  }, [id]);

  useEffect(() => {
    const unsubscribe = subscribeToVisibility((visible) => {
      setIsVisible(visible);
    });
    return unsubscribe;
  }, []);

  const handleClick = () => {
    if (isMobile) {
      // Mobile behavior
      if (!isVisible) {
        // If sidenotes are hidden, clicking shows this specific note
        setHighlightedNote(id);
        setIsVisible(true);
      } else if (isHighlighted) {
        setHighlightedNote(null);
      } else {
        setHighlightedNote(id);
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Desktop behavior - just toggle highlight
      if (isHighlighted) {
        setHighlightedNote(null);
      } else {
        setHighlightedNote(id);
      }
    }
  };

  return (
    <>
      <sup
        ref={numberRef}
        className="sidenote-number"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {number}
      </sup>
      <span
        ref={noteRef}
        id={id}
        className={`sidenote ${isHighlighted ? 'highlighted' : ''} ${isMobile ? 'mobile' : ''} ${isMobile && !isVisible && !isHighlighted ? 'hidden' : ''}`}
      >
        {number}. {children}
      </span>
    </>
  );
} 
import React, { useState, useEffect, useRef } from 'react';
import { subscribeToHighlight, setHighlightedNote } from './noteState';

interface MarginNoteProps {
  children: React.ReactNode;
  id?: string;
}

export default function MarginNoteReact({ children, id = `mn-${Math.random().toString(36).substr(2, 9)}` }: MarginNoteProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const noteRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 760;
      setIsMobile(isMobileView);
      
      if (noteRef.current) {
        if (isMobileView) {
          // Find the parent paragraph
          let parentParagraph = noteRef.current.closest('p');
          if (!parentParagraph) return;

          // Move the note to the end of the paragraph
          parentParagraph.appendChild(noteRef.current);
          
          noteRef.current.classList.add('mobile-block');
          noteRef.current.classList.remove('mobile');
        } else {
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

  const handleClick = () => {
    if (isHighlighted) {
      setHighlightedNote(null);
    } else {
      setHighlightedNote(id);
      if (isMobile) {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <span
      ref={noteRef}
      id={id}
      onClick={handleClick}
      className={`margin-note ${isHighlighted ? 'highlighted' : ''} ${isMobile ? 'mobile' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  );
} 
import React, { useState, useEffect } from 'react';
import { subscribeToHighlight, setHighlightedNote } from './noteState';

interface SidenoteProps {
  number: number;
  id?: string;
  children: React.ReactNode;
}

const SidenoteReact: React.FC<SidenoteProps> = ({ number, id = `sn-${number}`, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 760);
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMobile) {
      setIsVisible(!isVisible);
    }
    
    // Toggle highlight
    if (isHighlighted) {
      setHighlightedNote(null);
    } else {
      setHighlightedNote(id);
    }
  };

  // Convert children to string if needed and preserve line breaks
  const processContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      return content.split(/\n|<br\s*\/?>/g).map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return content;
  };

  return (
    <>
      <label
        htmlFor={`sidenote-${number}`}
        className="sidenote-number"
        onClick={handleClick}
      >
        {number}
      </label>
      <span
        id={id}
        className={`sidenote ${isMobile && isVisible ? 'mobile' : ''} ${
          isHighlighted ? 'highlighted' : ''
        }`}
      >
        <span className="sidenote-number">{number}</span>
        {' '}
        {processContent(children)}
      </span>
    </>
  );
};

export default SidenoteReact; 
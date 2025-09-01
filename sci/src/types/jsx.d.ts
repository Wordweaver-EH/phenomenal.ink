import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
} 
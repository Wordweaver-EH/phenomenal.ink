export const THEME_KEY = 'phenomenal-theme';

export interface ThemeConfig {
  light: {
    background: string;
    text: string;
    accent: string;
    sideNote: string;
    link: string;
    border: string;
    highlight: string;
    highlightDark: string;
    codeBg: string;
  };
  dark: {
    background: string;
    text: string;
    accent: string;
    sideNote: string;
    link: string;
    border: string;
    highlight: string;
    highlightDark: string;
    codeBg: string;
  };
}

export const themeConfig: ThemeConfig = {
  light: {
    background: '#faf8f1',
    text: '#222',
    accent: '#a00000',
    sideNote: '#666',
    link: '#a00000',
    border: '#ddd',
    highlight: 'rgba(160, 0, 0, 0.1)',
    highlightDark: 'rgba(160, 0, 0, 0.15)',
    codeBg: '#f3f1ea'
  },
  dark: {
    background: '#1a1a1a',
    text: '#e6e6e6',
    accent: '#ff6b6b',
    sideNote: '#a0a0a0',
    link: '#ff6b6b',
    border: '#333',
    highlight: 'rgba(255, 107, 107, 0.2)',
    highlightDark: 'rgba(255, 107, 107, 0.25)',
    codeBg: '#252525'
  }
}; 
import { THEME_KEY } from '../config/theme';

export type Theme = 'light' | 'dark';

// Get theme from localStorage or system preference
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document and notify other windows
export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  // Broadcast theme change to other windows/tabs
  const event = new CustomEvent('phenomenal-theme-change', { detail: { theme } });
  window.dispatchEvent(event);
}

// Toggle between light and dark themes
export function toggleTheme() {
  const current = getTheme();
  const next: Theme = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
}

// Initialize theme system
export function initTheme() {
  if (typeof window === 'undefined') return;

  // Apply initial theme
  applyTheme(getTheme());

  // Listen for theme changes from other windows/tabs
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY) {
      const newTheme = event.newValue as Theme;
      if (newTheme === 'light' || newTheme === 'dark') {
        document.documentElement.dataset.theme = newTheme;
      }
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
} 
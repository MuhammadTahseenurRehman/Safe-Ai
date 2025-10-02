import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

// Initialize theme and apply to DOM immediately
const initializeTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    const theme = (stored as Theme) || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply theme to DOM immediately to prevent flash
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    return theme;
  }
  return 'dark';
};

// Global theme state
let globalTheme: Theme = initializeTheme();

// Global listeners for theme changes
const themeListeners = new Set<(theme: Theme) => void>();

// Update DOM and notify listeners
const updateTheme = (newTheme: Theme) => {
  globalTheme = newTheme;
  
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  // Notify all listeners
  themeListeners.forEach(listener => listener(newTheme));
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(globalTheme);

  useEffect(() => {
    // Add this component as a listener
    const listener = (newTheme: Theme) => {
      setCurrentTheme(newTheme);
    };
    
    themeListeners.add(listener);
    
    // Cleanup listener on unmount
    return () => {
      themeListeners.delete(listener);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    updateTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = globalTheme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
  };
}

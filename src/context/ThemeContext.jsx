import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Start with light mode

  // Initialize and apply theme
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('medmap_theme');
    
    // Remove dark class first (default to light)
    root.classList.remove('dark');
    
    // Apply stored preference or default to light
    if (stored === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      root.classList.remove('dark');
      setIsDark(false);
      // Set default to light if not set
      if (!stored) {
        localStorage.setItem('medmap_theme', 'light');
      }
    }
  }, []);

  // Apply theme whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('medmap_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('medmap_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      const root = document.documentElement;
      
      // Immediately update the DOM
      if (newValue) {
        root.classList.add('dark');
        localStorage.setItem('medmap_theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('medmap_theme', 'light');
      }
      
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

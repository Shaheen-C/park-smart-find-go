
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'auto';
  });

  const getAutoTheme = (): 'light' | 'dark' => {
    const now = new Date();
    const hour = now.getHours();
    // Dark theme between 6 PM (18:00) and 6 AM (06:00)
    return hour >= 18 || hour < 6 ? 'dark' : 'light';
  };

  const effectiveTheme = theme === 'auto' ? getAutoTheme() : theme;

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme, effectiveTheme]);

  // Auto-update theme every minute when in auto mode
  useEffect(() => {
    if (theme === 'auto') {
      const interval = setInterval(() => {
        const newAutoTheme = getAutoTheme();
        if (newAutoTheme === 'dark') {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// context/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Preferences {
  language: string;
  currency: string;
  timezone: string;
  autoAccept: boolean;
  emailFrequency: string;
  theme: string;
}

interface ThemeContextType {
  theme: string;
  changeTheme: (newTheme: string) => void;
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>('light');
  const [preferences, setPreferences] = useState<Preferences>({
    language: 'English',
    currency: 'KSh',
    timezone: 'GMT+3',
    autoAccept: true,
    emailFrequency: 'daily',
    theme: 'light'
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Get preferences from localStorage
    const savedPreferences = localStorage.getItem('appPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences: Preferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
        setTheme(parsedPreferences.theme);
        document.documentElement.setAttribute('data-theme', parsedPreferences.theme);
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update theme in preferences and localStorage
    const updatedPreferences = { ...preferences, theme: newTheme };
    setPreferences(updatedPreferences);
    localStorage.setItem('appPreferences', JSON.stringify(updatedPreferences));
  };

  const updatePreferences = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('appPreferences', JSON.stringify(newPreferences));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      preferences, 
      setPreferences: updatePreferences 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
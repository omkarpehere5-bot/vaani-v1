import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'futuristic-neon' | 'minimal-dark' | 'high-contrast';
export type UserMode = 'blind' | 'low-vision' | 'standard';

export interface ThemeSettings {
  themeMode: ThemeMode;
  userMode: UserMode;
  enableAnimations: boolean;
  enableGlow: boolean;
  soundEffects: boolean;
  voiceFeedback: boolean;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  setUserMode: (mode: UserMode) => void;
  setThemeMode: (theme: ThemeMode) => void;
  resetToDefaults: () => void;
}

const defaultTheme: ThemeSettings = {
  themeMode: 'futuristic-neon',
  userMode: 'standard',
  enableAnimations: true,
  enableGlow: true,
  soundEffects: true,
  voiceFeedback: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('vaani.theme');
    const savedUserMode = localStorage.getItem('vaani.userMode');
    
    if (savedTheme || savedUserMode) {
      setTheme(prev => ({
        ...prev,
        themeMode: (savedTheme as ThemeMode) || prev.themeMode,
        userMode: (savedUserMode as UserMode) || prev.userMode,
      }));
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-futuristic-neon', 'theme-minimal-dark', 'theme-high-contrast');
    root.classList.remove('user-mode-blind', 'user-mode-low-vision', 'user-mode-standard');
    
    // Add new theme classes
    root.classList.add(`theme-${theme.themeMode}`);
    root.classList.add(`user-mode-${theme.userMode}`);
    
    // Apply feature flags
    root.classList.toggle('animations-enabled', theme.enableAnimations);
    root.classList.toggle('glow-enabled', theme.enableGlow);
    
    // Save to localStorage
    localStorage.setItem('vaani.theme', theme.themeMode);
    localStorage.setItem('vaani.userMode', theme.userMode);
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const setUserMode = (mode: UserMode) => {
    // Set theme based on user mode
    let themeMode: ThemeMode = 'futuristic-neon';
    
    switch (mode) {
      case 'blind':
        themeMode = 'minimal-dark';
        break;
      case 'low-vision':
        themeMode = 'high-contrast';
        break;
      case 'standard':
        themeMode = 'futuristic-neon';
        break;
    }
    
    setTheme(prev => ({
      ...prev,
      userMode: mode,
      themeMode,
      enableAnimations: mode === 'standard',
    }));
  };

  const setThemeMode = (themeMode: ThemeMode) => {
    setTheme(prev => ({ ...prev, themeMode }));
  };

  const resetToDefaults = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, setUserMode, setThemeMode, resetToDefaults }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

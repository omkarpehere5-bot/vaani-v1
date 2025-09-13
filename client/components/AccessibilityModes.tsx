import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AccessibilityModes {
  standard: boolean;
  lowVision: boolean;
  screenReader: boolean;
  motorFriendly: boolean;
  cognitiveLite: boolean;
  hearingImpaired: boolean;
}

export interface AccessibilitySettings {
  modes: AccessibilityModes;
  fontSize: number;
  lineSpacing: number;
  focusThickness: number;
  reduceMotion: boolean;
  highContrast: 'none' | 'blackYellow' | 'whiteBlack';
  dyslexiaFriendly: boolean;
  voiceSpeed: number;
  captionsEnabled: boolean;
  scanMode: boolean;
  dwellClick: boolean;
  bigControls: boolean;
  language: 'en' | 'hi' | 'mr';
  colorBlindFilter: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
}

const defaultSettings: AccessibilitySettings = {
  modes: {
    standard: true,
    lowVision: false,
    screenReader: false,
    motorFriendly: false,
    cognitiveLite: false,
    hearingImpaired: false,
  },
  fontSize: 18,
  lineSpacing: 1.6,
  focusThickness: 3,
  reduceMotion: false,
  highContrast: 'none',
  dyslexiaFriendly: false,
  voiceSpeed: 1.0,
  captionsEnabled: false,
  scanMode: false,
  dwellClick: false,
  bigControls: false,
  language: 'en',
  colorBlindFilter: 'none',
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  setMode: (mode: keyof AccessibilityModes) => void;
  resetToDefaults: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--line-height', settings.lineSpacing.toString());
    root.style.setProperty('--focus-thickness', `${settings.focusThickness}px`);
    
    // High contrast themes
    root.classList.remove('high-contrast-black-yellow', 'high-contrast-white-black');
    if (settings.highContrast === 'blackYellow') {
      root.classList.add('high-contrast-black-yellow');
    } else if (settings.highContrast === 'whiteBlack') {
      root.classList.add('high-contrast-white-black');
    }
    
    // Accessibility modes
    root.classList.toggle('low-vision-mode', settings.modes.lowVision);
    root.classList.toggle('screen-reader-mode', settings.modes.screenReader);
    root.classList.toggle('motor-friendly-mode', settings.modes.motorFriendly);
    root.classList.toggle('cognitive-lite-mode', settings.modes.cognitiveLite);
    root.classList.toggle('hearing-impaired-mode', settings.modes.hearingImpaired);
    root.classList.toggle('big-controls', settings.bigControls);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    root.classList.toggle('dyslexia-friendly', settings.dyslexiaFriendly);
    
    // Color blind filters
    root.classList.remove('deuteranopia-filter', 'protanopia-filter', 'tritanopia-filter');
    if (settings.colorBlindFilter !== 'none') {
      root.classList.add(`${settings.colorBlindFilter}-filter`);
    }
    
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const setMode = (mode: keyof AccessibilityModes) => {
    // First reset to defaults, then apply the new mode
    const resetSettings = { ...defaultSettings };

    const newModes = Object.keys(resetSettings.modes).reduce((acc, key) => {
      acc[key as keyof AccessibilityModes] = key === mode;
      return acc;
    }, {} as AccessibilityModes);

    resetSettings.modes = newModes;

    // Apply mode-specific presets
    switch (mode) {
      case 'standard':
        // Standard mode uses all default settings
        setSettings(resetSettings);
        break;
      case 'lowVision':
        setSettings({
          ...resetSettings,
          fontSize: 20,
          focusThickness: 4,
          bigControls: true,
          highContrast: 'blackYellow',
        });
        break;
      case 'screenReader':
        setSettings({
          ...resetSettings,
          reduceMotion: true,
          captionsEnabled: true,
        });
        break;
      case 'motorFriendly':
        setSettings({
          ...resetSettings,
          bigControls: true,
          dwellClick: true,
          focusThickness: 4,
        });
        break;
      case 'cognitiveLite':
        setSettings({
          ...resetSettings,
          reduceMotion: true,
          fontSize: 20,
          lineSpacing: 1.8,
        });
        break;
      case 'hearingImpaired':
        setSettings({
          ...resetSettings,
          captionsEnabled: true,
        });
        break;
      default:
        setSettings(resetSettings);
        break;
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, setMode, resetToDefaults }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  timezone: string;
  
  // Professional Information
  occupation: string;
  company: string;
  experience: string;
  
  // Preferences
  preferredLanguage: string;
  voiceSpeed: 'slow' | 'normal' | 'fast';
  voicePitch: 'low' | 'normal' | 'high';
  
  // Accessibility Settings
  isVisuallyImpaired: boolean;
  useScreenReader: boolean;
  useHighContrast: boolean;
  useLargeText: boolean;
  useVoiceNavigation: boolean;
  alwaysListening: boolean;
  
  // Interests and Customization
  interests: string[];
  favoriteTopics: string;
  customCommands: string;
  
  // Privacy Settings
  dataCollection: boolean;
  voiceRecording: boolean;
  personalizedAds: boolean;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isListening: boolean;
  currentGreeting: string;
  screenReader: {
    isEnabled: boolean;
    speak: (text: string) => void;
    stop: () => void;
  };
  voiceCommands: {
    isEnabled: boolean;
    startListening: () => void;
    stopListening: () => void;
    addCustomCommand: (command: string, action: () => void) => void;
  };
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  completeProfile: (profile: UserProfile) => void;
  getPersonalizedGreeting: () => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [customCommands, setCustomCommands] = useState<Map<string, () => void>>(new Map());

  // Initialize speech APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }

      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true; // needed to detect wake word quickly
        recognition.lang = 'en-US';

        const wakeRegex = /\b(?:hey|hi|ok|okay|yo)\s+(?:vaani|vani|vani\b|vaanee)\b/i;

        recognition.onresult = (event: any) => {
          // Build full transcript from results
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          const txt = transcript.toLowerCase().trim();

          // If wake word detected and not currently in active listening mode, trigger start
          if (!isListening && wakeRegex.test(txt)) {
            try {
              // Acknowledge and start active listening
              startVoiceListening();
              // Optionally give a short beep or speak
              speak("Yes?");
            } catch (e) {
              console.warn('Failed to start listening on wake word', e);
            }
            return;
          }

          // Only process full commands when active listening is on and result is final
          const last = event.results[event.results.length - 1];
          if (isListening && last.isFinal) {
            const finalTranscript = txt;
            handleVoiceCommand(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          // Try to keep the wake/background recognizer running
          try {
            recognition.start();
          } catch (e) {
            console.warn('Could not restart recognition onend', e);
            setIsListening(false);
          }
        };

        setSpeechRecognition(recognition);

        // Start background recognition to listen for wake words
        try {
          recognition.start();
        } catch (e) {
          // ignore startup errors (e.g., permission issues)
        }
      }
    }
  }, []);

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('vaaniUserProfile');
    const savedAuth = localStorage.getItem('vaaniAuthenticated');
    const savedEmail = localStorage.getItem('vaaniUserEmail');

    if (savedAuth === 'true') {
      setIsAuthenticated(true);

      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setUser(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Create basic profile if parsing fails
          if (savedEmail) {
            const basicProfile = {
              ...getDefaultProfile(),
              email: savedEmail
            };
            setUser(basicProfile);
          }
        }
      } else if (savedEmail) {
        // Create basic profile with saved email and temp name if available
        const tempName = localStorage.getItem('vaaniTempUserName');
        const nameParts = tempName ? tempName.split(' ') : [];
        const basicProfile = {
          ...getDefaultProfile(),
          email: savedEmail,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        };
        setUser(basicProfile);
        // Clean up temp name
        if (tempName) {
          localStorage.removeItem('vaaniTempUserName');
        }
      }
    }
  }, []);

  // Start always listening if enabled
  useEffect(() => {
    if (user?.alwaysListening && speechRecognition && isAuthenticated) {
      startVoiceListening();
    } else if (speechRecognition && isListening) {
      stopVoiceListening();
    }
  }, [user?.alwaysListening, speechRecognition, isAuthenticated]);

  // Parse custom commands
  useEffect(() => {
    if (user?.customCommands) {
      const commands = new Map();
      const lines = user.customCommands.split('\n');
      lines.forEach(line => {
        const [command, action] = line.split(' -> ');
        if (command && action) {
          commands.set(command.toLowerCase().trim(), () => {
            // Handle different action types
            if (action.startsWith('http')) {
              window.open(action, '_blank');
            } else if (action.includes(':') && action.includes('/')) {
              // File path
              speak(`Opening ${action}`);
              // In a real app, you'd use Electron APIs to open files
            } else {
              // Custom action
              speak(action);
            }
          });
        }
      });
      setCustomCommands(commands);
    }
  }, [user?.customCommands]);

  const speak = (text: string) => {
    if (speechSynthesis && user?.useScreenReader) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply user preferences
      switch (user.voiceSpeed) {
        case 'slow': utterance.rate = 0.7; break;
        case 'fast': utterance.rate = 1.3; break;
        default: utterance.rate = 1.0;
      }
      
      switch (user.voicePitch) {
        case 'low': utterance.pitch = 0.7; break;
        case 'high': utterance.pitch = 1.3; break;
        default: utterance.pitch = 1.0;
      }
      
      utterance.lang = user.preferredLanguage || 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  const startVoiceListening = () => {
    if (speechRecognition && !isListening) {
      setIsListening(true);
      try {
        speechRecognition.start();
      } catch (e) {
        // recognition may already be running; that's fine
      }
      speak("Voice commands activated. I'm listening.");
    } else if (speechRecognition && isListening) {
      // already listening
    }
  };

  const stopVoiceListening = () => {
    if (speechRecognition && isListening) {
      setIsListening(false);
      try { speechRecognition.stop(); } catch (e) {}
    }
  };

  const handleVoiceCommand = (command: string) => {
    // Check custom commands first
    if (customCommands.has(command)) {
      customCommands.get(command)!();
      return;
    }

    // Built-in commands
    if (command.includes('open') && command.includes('file')) {
      speak("File manager opened");
      // In a real app, open file manager
    } else if (command.includes('open') && command.includes('calculator')) {
      speak("Calculator opened");
      // In a real app, open calculator
    } else if (command.includes('read screen')) {
      readCurrentScreen();
    } else if (command.includes('stop listening')) {
      stopVoiceListening();
      speak("Voice commands deactivated");
    } else if (command.includes('start listening')) {
      startVoiceListening();
    } else if (command.includes('what time')) {
      const time = new Date().toLocaleTimeString();
      speak(`The current time is ${time}`);
    } else if (command.includes('what date')) {
      const date = new Date().toLocaleDateString();
      speak(`Today is ${date}`);
    } else {
      speak("Command not recognized. Try saying 'open file', 'open calculator', 'read screen', or 'what time'.");
    }
  };

  const readCurrentScreen = () => {
    // Read current page content
    const headings = document.querySelectorAll('h1, h2, h3');
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input, textarea');

    let content = "Current screen content: ";
    
    if (headings.length > 0) {
      content += `Headings: ${Array.from(headings).map(h => h.textContent).join(', ')}. `;
    }
    
    if (buttons.length > 0) {
      content += `Buttons: ${Array.from(buttons).map(b => b.textContent || b.getAttribute('aria-label')).filter(Boolean).join(', ')}. `;
    }
    
    if (inputs.length > 0) {
      content += `Input fields: ${Array.from(inputs).map(i => i.getAttribute('placeholder') || i.getAttribute('aria-label')).filter(Boolean).join(', ')}.`;
    }

    speak(content);
  };

  const getPersonalizedGreeting = (): string => {
    if (!user || !isAuthenticated) return "Hello! I'm Vaani, your voice assistant.";

    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    const name = user.firstName || 'there';
    return `${timeGreeting}, ${name}!`;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, validate credentials with backend
    if (email && password) {
      setIsAuthenticated(true);
      localStorage.setItem('vaaniAuthenticated', 'true');
      localStorage.setItem('vaaniUserEmail', email);

      // Load existing profile if available
      const savedProfile = localStorage.getItem('vaaniUserProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setUser(profile);
          // Welcome back message
          setTimeout(() => {
            speak(`Welcome back, ${profile.firstName || 'user'}!`);
          }, 1500);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      } else {
        // Create basic profile with email and temp name if available
        const tempName = localStorage.getItem('vaaniTempUserName');
        const nameParts = tempName ? tempName.split(' ') : [];
        const basicProfile = {
          ...getDefaultProfile(),
          email: email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        };
        setUser(basicProfile);
        // Clean up temp name
        localStorage.removeItem('vaaniTempUserName');
      }

      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    stopVoiceListening();
    localStorage.removeItem('vaaniAuthenticated');
    localStorage.removeItem('vaaniUserProfile');
  };

  const updateProfile = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('vaaniUserProfile', JSON.stringify(profile));
  };

  const completeProfile = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('vaaniUserProfile', JSON.stringify(profile));
    localStorage.setItem('vaaniProfileComplete', 'true');

    // Welcome message
    setTimeout(() => {
      speak(`Welcome ${profile.firstName}! Your profile has been set up successfully.`);
    }, 1000);
  };

  const addCustomCommand = (command: string, action: () => void) => {
    setCustomCommands(prev => new Map(prev.set(command.toLowerCase(), action)));
  };

  const getDefaultProfile = (): UserProfile => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    timezone: 'UTC-5',
    occupation: '',
    company: '',
    experience: '',
    preferredLanguage: 'en',
    voiceSpeed: 'normal' as const,
    voicePitch: 'normal' as const,
    isVisuallyImpaired: false,
    useScreenReader: false,
    useHighContrast: false,
    useLargeText: false,
    useVoiceNavigation: false,
    alwaysListening: false,
    interests: [],
    favoriteTopics: '',
    customCommands: '',
    dataCollection: true,
    voiceRecording: true,
    personalizedAds: false,
  });

  const isProfileComplete = user && user.firstName && user.lastName && user.email && localStorage.getItem('vaaniProfileComplete') === 'true';

  const value: UserContextType = {
    user,
    isAuthenticated,
    isProfileComplete: !!isProfileComplete,
    isListening,
    currentGreeting: getPersonalizedGreeting(),
    screenReader: {
      isEnabled: user?.useScreenReader || false,
      speak,
      stop: stopSpeaking,
    },
    voiceCommands: {
      isEnabled: user?.useVoiceNavigation || false,
      startListening: startVoiceListening,
      stopListening: stopVoiceListening,
      addCustomCommand,
    },
    login,
    logout,
    updateProfile,
    completeProfile,
    getPersonalizedGreeting,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

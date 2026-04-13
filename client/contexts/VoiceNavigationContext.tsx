import React, { createContext, useContext, ReactNode, useEffect, useRef, useState } from 'react';

interface VoiceNavigationContextType {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  registerCommand: (pattern: RegExp, action: () => void, label: string) => () => void;
}

const VoiceNavigationContext = createContext<VoiceNavigationContextType | undefined>(undefined);

export function VoiceNavigationProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const commandsRef = useRef<Array<{ pattern: RegExp; action: () => void; label: string }>>([]);

  // Initialize speech APIs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          processCommand(finalTranscript);
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Provide voice feedback for error
        if (event.error === 'no-speech') {
          speak('Sorry, I did not hear that. Please try again.');
        } else if (event.error === 'network') {
          speak('There seems to be a network issue. Please check your connection.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const processCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();

    // Check registered commands
    for (const cmd of commandsRef.current) {
      if (cmd.pattern.test(normalizedCommand)) {
        cmd.action();
        return;
      }
    }

    // If no command matched, dispatch event that components can listen to
    window.dispatchEvent(
      new CustomEvent('voice-command-unrecognized', { detail: normalizedCommand })
    );
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string, options?: { rate?: number; pitch?: number; lang?: string }) => {
    if (!synthesisRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1;
    utterance.lang = options?.lang ?? 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event: any) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    synthesisRef.current.cancel();
    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const registerCommand = (pattern: RegExp, action: () => void, label: string) => {
    commandsRef.current.push({ pattern, action, label });

    // Return unregister function
    return () => {
      commandsRef.current = commandsRef.current.filter(cmd => cmd.pattern !== pattern);
    };
  };

  return (
    <VoiceNavigationContext.Provider
      value={{
        isListening,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        registerCommand,
      }}
    >
      {children}
    </VoiceNavigationContext.Provider>
  );
}

export function useVoiceNavigation() {
  const context = useContext(VoiceNavigationContext);
  if (context === undefined) {
    throw new Error('useVoiceNavigation must be used within a VoiceNavigationProvider');
  }
  return context;
}

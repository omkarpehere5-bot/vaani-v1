import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceCommand {
  pattern: RegExp;
  action: () => void;
  label: string;
}

export function useVoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const commandsRef = useRef<VoiceCommand[]>([]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
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
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const processCommand = useCallback((command: string) => {
    const normalizedCommand = command.toLowerCase().trim();

    for (const cmd of commandsRef.current) {
      if (cmd.pattern.test(normalizedCommand)) {
        cmd.action();
        return;
      }
    }

    // Speak unrecognized command
    speak(`Sorry, I didn't recognize that command. Try saying "open settings" or "help".`);
  }, []);

  const addCommand = useCallback((pattern: RegExp, action: () => void, label: string) => {
    commandsRef.current.push({ pattern, action, label });
  }, []);

  const removeCommand = useCallback((pattern: RegExp) => {
    commandsRef.current = commandsRef.current.filter(cmd => cmd.pattern !== pattern);
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    addCommand,
    removeCommand,
    speak,
  };
}

// Utility function to set up common voice commands
export function useCommonVoiceCommands() {
  const navigation = useVoiceNavigation();

  useEffect(() => {
    // Settings
    navigation.addCommand(
      /open settings|show settings/,
      () => {
        navigation.speak('Opening settings');
        // Dispatch custom event for components to listen to
        window.dispatchEvent(new CustomEvent('voice-command', { detail: 'open-settings' }));
      },
      'Open Settings'
    );

    // Help
    navigation.addCommand(
      /help|what can i do|commands/,
      () => {
        navigation.speak('You can say: open settings, start listening, stop listening, read screen, or repeat');
        window.dispatchEvent(new CustomEvent('voice-command', { detail: 'help' }));
      },
      'Help'
    );

    // Start/Stop listening
    navigation.addCommand(
      /start listening|activate/,
      () => {
        navigation.speak('Voice navigation activated');
        window.dispatchEvent(new CustomEvent('voice-command', { detail: 'start-listening' }));
      },
      'Start Listening'
    );

    navigation.addCommand(
      /stop listening|deactivate/,
      () => {
        navigation.speak('Voice navigation deactivated');
        window.dispatchEvent(new CustomEvent('voice-command', { detail: 'stop-listening' }));
      },
      'Stop Listening'
    );

    // Read screen
    navigation.addCommand(
      /read screen|read the screen|read page/,
      () => {
        navigation.speak('Reading page content');
        readScreenContent();
        window.dispatchEvent(new CustomEvent('voice-command', { detail: 'read-screen' }));
      },
      'Read Screen'
    );

    return () => {
      navigation.removeCommand(/open settings|show settings/);
      navigation.removeCommand(/help|what can i do|commands/);
      navigation.removeCommand(/start listening|activate/);
      navigation.removeCommand(/stop listening|deactivate/);
      navigation.removeCommand(/read screen|read the screen|read page/);
    };
  }, [navigation]);

  return navigation;
}

function readScreenContent() {
  const text: string[] = [];

  // Get main heading
  const heading = document.querySelector('h1, h2, h3');
  if (heading) {
    text.push(`${heading.textContent}`);
  }

  // Get main content
  const main = document.querySelector('main, [role="main"]');
  if (main) {
    const paragraphs = main.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
      if (index < 3) {
        // Limit to first 3 paragraphs
        text.push(p.textContent || '');
      }
    });
  }

  // Get available buttons
  const buttons = document.querySelectorAll('button, [role="button"]');
  if (buttons.length > 0) {
    const buttonLabels: string[] = [];
    buttons.forEach((btn) => {
      const label = btn.textContent || btn.getAttribute('aria-label') || '';
      if (label) {
        buttonLabels.push(label);
      }
    });

    if (buttonLabels.length > 0) {
      text.push(`Available buttons: ${buttonLabels.slice(0, 5).join(', ')}`);
    }
  }

  if (text.length > 0) {
    const speech = text.join('. ');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(speech);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }
}

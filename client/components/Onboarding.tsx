import React, { useState, useEffect } from 'react';
import { useTheme, type UserMode } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Eye, EyeOff, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'welcome' | 'selection' | 'voice-setup' | 'complete'>('welcome');
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { setUserMode } = useTheme();

  // Speak text using Web Speech API
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Auto-play welcome message
    if (step === 'welcome') {
      setTimeout(() => {
        speak(
          'Welcome to Vaani. I am your AI voice assistant, optimized for everyone. ' +
          'In the next few steps, I will help you choose your preferred interface mode. ' +
          'Press Continue to begin, or listen for voice guidance.'
        );
      }, 800);
    }
  }, [step]);

  const handleModeSelect = (mode: UserMode) => {
    setSelectedMode(mode);
    setUserMode(mode);
    
    const modeDescriptions: Record<UserMode, string> = {
      blind: 'You have selected Blind User Mode. This mode is optimized for voice-first interaction with minimal visual clutter.',
      'low-vision': 'You have selected Low Vision Mode. This mode features large text, high contrast, and bold elements for easier reading.',
      standard: 'You have selected Standard Mode. Enjoy a futuristic, animated interface with glassmorphism effects and visual feedback.',
    };
    
    speak(modeDescriptions[mode]);
    setStep('voice-setup');
  };

  const handleComplete = () => {
    speak('Setup complete! Welcome to Vaani. Your preferences have been saved.');
    localStorage.setItem('vaani.onboarding-complete', 'true');
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Welcome Step */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-96 p-8 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Vaani
                  </div>
                </motion.div>

                <h1 className="text-2xl font-bold text-white">Welcome</h1>
                <p className="text-gray-300 text-center">
                  Let&apos;s set up your personalized AI assistant experience
                </p>
              </div>

              <Button
                onClick={() => setStep('selection')}
                className="w-full py-6 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                aria-label="Continue to mode selection"
              >
                Continue
              </Button>

              <p className="text-xs text-gray-400 text-center">
                {isPlaying && (
                  <motion.span animate={{ opacity: [0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    🔊 Speaking...
                  </motion.span>
                )}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Mode Selection Step */}
        {step === 'selection' && (
          <motion.div
            key="selection"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-2xl p-8 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Choose Your Mode
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blind User Mode */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleModeSelect('blind')}
                  className={`p-6 rounded-lg transition-all duration-300 text-left ${
                    selectedMode === 'blind'
                      ? 'bg-cyan-600 border-2 border-cyan-400 ring-4 ring-cyan-500/50'
                      : 'bg-slate-700 border-2 border-slate-600 hover:border-cyan-400'
                  }`}
                  aria-label="Blind User Mode - Voice-first interface"
                  aria-pressed={selectedMode === 'blind'}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Volume2 className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Blind Mode</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Voice-first interface with audio cues and minimal visual elements
                  </p>
                </motion.button>

                {/* Low Vision Mode */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleModeSelect('low-vision')}
                  className={`p-6 rounded-lg transition-all duration-300 text-left ${
                    selectedMode === 'low-vision'
                      ? 'bg-cyan-600 border-2 border-cyan-400 ring-4 ring-cyan-500/50'
                      : 'bg-slate-700 border-2 border-slate-600 hover:border-cyan-400'
                  }`}
                  aria-label="Low Vision Mode - High contrast and large text"
                  aria-pressed={selectedMode === 'low-vision'}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Low Vision Mode</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    High contrast themes with large fonts and bold UI elements
                  </p>
                </motion.button>

                {/* Standard Mode */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleModeSelect('standard')}
                  className={`p-6 rounded-lg transition-all duration-300 text-left ${
                    selectedMode === 'standard'
                      ? 'bg-cyan-600 border-2 border-cyan-400 ring-4 ring-cyan-500/50'
                      : 'bg-slate-700 border-2 border-slate-600 hover:border-cyan-400'
                  }`}
                  aria-label="Standard Mode - Futuristic animated interface"
                  aria-pressed={selectedMode === 'standard'}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Standard Mode</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Futuristic UI with animations, glassmorphism, and visual effects
                  </p>
                </motion.button>
              </div>

              {selectedMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 mt-6"
                >
                  <Button
                    onClick={() => setSelectedMode(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('voice-setup')}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Voice Setup Step */}
        {step === 'voice-setup' && (
          <motion.div
            key="voice-setup"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-96 p-8 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <h2 className="text-2xl font-bold text-white text-center">Voice Setup</h2>

              <div className="space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Volume2 className="w-12 h-12 text-white" />
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse" />
                  </div>
                </motion.div>

                <p className="text-center text-gray-300">
                  Testing your voice feedback system...
                </p>

                <Button
                  onClick={() => speak('Voice system is working correctly')}
                  variant="outline"
                  className="w-full"
                >
                  Test Voice
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('selection')}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Complete Setup
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-96 p-8 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-center">
              <motion.div
                animate={{ scale: [0, 1], rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">✨</div>
              </motion.div>

              <h2 className="text-2xl font-bold text-white">All Set!</h2>
              <p className="text-gray-300">
                Your Vaani assistant is ready. Let&apos;s explore what you can do together.
              </p>

              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Start Using Vaani
              </Button>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Onboarding;

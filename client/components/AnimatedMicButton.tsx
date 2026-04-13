import React, { useEffect, useState } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Microphone } from 'lucide-react';
import { motion } from 'framer-motion';

type MicState = 'idle' | 'listening' | 'processing' | 'speaking';

interface AnimatedMicButtonProps {
  onStateChange?: (state: MicState) => void;
  className?: string;
}

const AnimatedMicButton: React.FC<AnimatedMicButtonProps> = ({ onStateChange, className = '' }) => {
  const { isListening, startListening, stopListening, isSpeaking } = useVoiceNavigation();
  const { theme } = useTheme();
  const [micState, setMicState] = useState<MicState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let newState: MicState = 'idle';

    if (isSpeaking) {
      newState = 'speaking';
    } else if (isProcessing) {
      newState = 'processing';
    } else if (isListening) {
      newState = 'listening';
    }

    setMicState(newState);
    onStateChange?.(newState);
  }, [isListening, isProcessing, isSpeaking, onStateChange]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  // Determine colors based on theme and mode
  const getColors = () => {
    if (theme.userMode === 'blind') {
      return {
        base: '#000000',
        glow: '#00f0ff',
        glowShadow: 'rgba(0, 240, 255, 0.6)',
        idle: '#1a3a4a',
        listening: '#ff006e',
        processing: '#00f0ff',
        speaking: '#b000ff',
      };
    }

    if (theme.userMode === 'low-vision') {
      return {
        base: '#000000',
        glow: '#ffff00',
        glowShadow: 'rgba(255, 255, 0, 0.8)',
        idle: '#1a1a00',
        listening: '#ffff00',
        processing: '#ffff00',
        speaking: '#ffff00',
      };
    }

    // Standard futuristic mode
    return {
      base: 'rgba(10, 14, 39, 0.8)',
      glow: '#00f0ff',
      glowShadow: 'rgba(0, 240, 255, 0.5)',
      idle: '#1a3a4a',
      listening: '#ff006e',
      processing: '#0080ff',
      speaking: '#b000ff',
    };
  };

  const colors = getColors();

  // Animation variants
  const containerVariants = {
    idle: {
      scale: 1,
      boxShadow: `0 0 20px ${colors.idle}`,
    },
    listening: {
      scale: 1.1,
      boxShadow: `0 0 40px ${colors.listening}, inset 0 0 20px ${colors.listening}`,
    },
    processing: {
      scale: [1, 1.05, 1],
      boxShadow: [
        `0 0 20px ${colors.processing}`,
        `0 0 40px ${colors.processing}`,
        `0 0 20px ${colors.processing}`,
      ],
      transition: { duration: 1.5, repeat: Infinity },
    },
    speaking: {
      scale: [1, 1.15, 1],
      boxShadow: [
        `0 0 30px ${colors.speaking}`,
        `0 0 60px ${colors.speaking}`,
        `0 0 30px ${colors.speaking}`,
      ],
      transition: { duration: 0.8, repeat: Infinity },
    },
  };

  const buttonVariants = {
    idle: { opacity: 1 },
    listening: {
      opacity: [1, 0.8, 1],
      transition: { duration: 0.8, repeat: Infinity },
    },
    processing: {
      rotate: [0, 360],
      transition: { duration: 2, repeat: Infinity, ease: 'linear' },
    },
    speaking: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, repeat: Infinity },
    },
  };

  const waveVariants = {
    idle: { scale: 0, opacity: 0 },
    listening: {
      scale: [1, 1.3],
      opacity: [1, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    processing: {
      scale: [1, 1.5],
      opacity: [1, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    speaking: {
      scale: [1, 1.4],
      opacity: [1, 0],
      transition: { duration: 0.6, repeat: Infinity },
    },
  };

  // Voice feedback for state changes
  useEffect(() => {
    if (theme.userMode === 'blind' && theme.voiceFeedback) {
      const messages: Record<MicState, string> = {
        idle: 'Microphone ready. Press to start listening.',
        listening: 'Listening. Speak now.',
        processing: 'Processing your voice.',
        speaking: 'Processing your request.',
      };
      // Uncomment to enable voice feedback
      // speak(messages[micState]);
    }
  }, [micState, theme.userMode, theme.voiceFeedback]);

  return (
    <motion.button
      onClick={handleToggle}
      className={`relative rounded-full focus:outline-none focus-visible:ring-4 ${className}`}
      style={{
        width: theme.userMode === 'blind' ? '120px' : '100px',
        height: theme.userMode === 'blind' ? '120px' : '100px',
        backgroundColor: colors.base,
      }}
      variants={containerVariants}
      initial="idle"
      animate={micState}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
      aria-label={`Voice input - Currently ${micState}`}
      aria-pressed={isListening}
      title={isListening ? 'Stop listening' : 'Start listening'}
    >
      {/* Pulsing background waves */}
      {theme.userMode !== 'low-vision' && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: colors.glowShadow,
              backgroundColor: 'transparent',
            }}
            variants={waveVariants}
            animate={micState}
          />
          <motion.div
            className="absolute inset-0 rounded-full border opacity-50"
            style={{
              borderColor: colors.glowShadow,
              backgroundColor: 'transparent',
            }}
            variants={{
              ...waveVariants,
              listening: {
                ...waveVariants.listening,
                transition: { ...waveVariants.listening.transition, delay: 0.2 },
              },
              processing: {
                ...waveVariants.processing,
                transition: { ...waveVariants.processing.transition, delay: 0.2 },
              },
              speaking: {
                ...waveVariants.speaking,
                transition: { ...waveVariants.speaking.transition, delay: 0.1 },
              },
            }}
            animate={micState}
          />
        </>
      )}

      {/* Main mic button content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-full"
        variants={buttonVariants}
        animate={micState}
      >
        <Microphone
          size={theme.userMode === 'blind' ? 48 : 40}
          className="text-white"
          strokeWidth={2}
        />
      </motion.div>

      {/* Status text for blind mode */}
      {theme.userMode === 'blind' && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-white font-bold bg-black/50 rounded-b-full py-1">
          {micState === 'idle' ? '●' : micState === 'listening' ? '⚡' : '⟳'}
        </div>
      )}

      {/* Accessibility label */}
      <span className="sr-only">
        {isListening ? 'Stop voice input' : 'Start voice input'}. Current state: {micState}.
      </span>
    </motion.button>
  );
};

export default AnimatedMicButton;

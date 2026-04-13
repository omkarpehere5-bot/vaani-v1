import React, { useEffect, useState } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

interface VoiceFeedbackSystemProps {
  onAction?: (action: string) => void;
}

const VoiceFeedbackSystem: React.FC<VoiceFeedbackSystemProps> = ({ onAction }) => {
  const { speak } = useVoiceNavigation();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  // Public API for showing feedback
  useEffect(() => {
    const handleFeedback = (event: CustomEvent) => {
      showFeedback(event.detail.text, event.detail.type || 'info', event.detail.duration || 3000);
    };

    window.addEventListener('show-voice-feedback' as any, handleFeedback);
    return () => window.removeEventListener('show-voice-feedback' as any, handleFeedback);
  }, []);

  // Show feedback message
  const showFeedback = (text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
    const id = Math.random().toString(36);
    const message: FeedbackMessage = { id, text, type, duration };

    setMessages(prev => [...prev, message]);

    // Speak the message if voice feedback is enabled
    if (theme.voiceFeedback) {
      speak(text, { rate: 0.9 });
    }

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
      }, duration);
    }
  };

  // Expose function globally for component integration
  useEffect(() => {
    (window as any).showVoiceFeedback = showFeedback;
    return () => {
      delete (window as any).showVoiceFeedback;
    };
  }, [theme.voiceFeedback]);

  // Get colors based on message type and theme
  const getMessageStyle = (type: string) => {
    if (theme.userMode === 'low-vision') {
      return {
        background: '#000000',
        border: '4px solid #ffff00',
        color: '#ffff00',
        textShadow: '0 0 10px rgba(255, 255, 0, 0.5)',
      };
    }

    if (theme.userMode === 'blind') {
      return {
        background: '#1a3a4a',
        border: '3px solid #00f0ff',
        color: '#ffffff',
      };
    }

    const styles: Record<string, Record<string, string>> = {
      success: {
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.5)',
        color: '#86efac',
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
      },
      error: {
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        color: '#fca5a5',
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      warning: {
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.5)',
        color: '#fcd34d',
        boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      info: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        color: '#93c5fd',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      },
    };

    return styles[type] || styles.info;
  };

  // Animation variants
  const messageVariants = {
    initial: { x: -400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
  };

  return (
    <div
      className="fixed bottom-6 left-6 right-6 md:right-auto md:left-6 md:max-w-md z-40"
      role="region"
      aria-label="Voice feedback messages"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {messages.map(message => (
          <motion.div
            key={message.id}
            className="mb-3 p-4 rounded-lg backdrop-blur-sm"
            style={getMessageStyle(message.type) as any}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            layout
          >
            <div className="flex items-center gap-3">
              {/* Icon based on type */}
              <div className="flex-shrink-0">
                {message.type === 'success' && '✓'}
                {message.type === 'error' && '✕'}
                {message.type === 'warning' && '⚠'}
                {message.type === 'info' && 'ℹ'}
              </div>

              {/* Message text */}
              <div className="flex-1 text-sm font-medium">{message.text}</div>

              {/* Progress indicator */}
              {message.duration > 0 && (
                <motion.div
                  className="flex-shrink-0 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: 'currentColor',
                    opacity: 0.5,
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Progress bar */}
            {message.duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 rounded-b-lg"
                style={{
                  background: 'currentColor',
                  opacity: 0.3,
                }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: message.duration / 1000, ease: 'linear' }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default VoiceFeedbackSystem;

// Utility function to trigger feedback from anywhere in the app
export const triggerVoiceFeedback = (
  text: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration = 3000
) => {
  window.dispatchEvent(
    new CustomEvent('show-voice-feedback', {
      detail: { text, type, duration },
    })
  );
};

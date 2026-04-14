import React, { useEffect, useState, useCallback } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface Confirmation {
  id: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  timeout?: number;
}

interface ContextualUIBehaviorProps {
  onSuggestionTriggered?: (suggestion: Suggestion) => void;
  onConfirmationResponse?: (confirmed: boolean) => void;
}

/**
 * Component that provides contextual suggestions and confirmations
 * based on user actions and voice commands
 */
const ContextualUIBehavior: React.FC<ContextualUIBehaviorProps> = ({
  onSuggestionTriggered,
  onConfirmationResponse,
}) => {
  const { speak, registerCommand } = useVoiceNavigation();
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Register voice commands for confirmations
  useEffect(() => {
    const unregisterYes = registerCommand(
      /yes|yep|yeah|confirm|ok|okay|sure|go ahead/,
      () => {
        if (confirmation) {
          confirmation.onConfirm();
          setConfirmation(null);
          onConfirmationResponse?.(true);
        }
      },
      'Confirm'
    );

    const unregisterNo = registerCommand(
      /no|nope|cancel|stop|nevermind|don't|dont/,
      () => {
        if (confirmation) {
          confirmation.onCancel();
          setConfirmation(null);
          onConfirmationResponse?.(false);
        }
      },
      'Cancel'
    );

    return () => {
      unregisterYes();
      unregisterNo();
    };
  }, [registerCommand, confirmation, onConfirmationResponse]);

  // Auto-clear suggestions after timeout
  useEffect(() => {
    if (suggestions.length === 0) return;

    const timer = setTimeout(() => {
      setSuggestions([]);
    }, 8000);

    return () => clearTimeout(timer);
  }, [suggestions]);

  // Auto-clear confirmation after timeout
  useEffect(() => {
    if (!confirmation || !confirmation.timeout) return;

    const timer = setTimeout(() => {
      setConfirmation(null);
    }, confirmation.timeout);

    return () => clearTimeout(timer);
  }, [confirmation]);

  // Public API functions
  const addSuggestion = useCallback((suggestion: Suggestion) => {
    setSuggestions(prev => {
      // Avoid duplicates
      if (prev.some(s => s.id === suggestion.id)) return prev;
      return [...prev, suggestion];
    });

    // Speak the suggestion if voice feedback is enabled
    if (theme.voiceFeedback) {
      speak(`Suggestion: ${suggestion.text}`);
    }
  }, [speak, theme.voiceFeedback]);

  const showConfirmation = useCallback(
    (conf: Confirmation) => {
      setConfirmation(conf);

      // Speak the confirmation message
      if (theme.voiceFeedback) {
        speak(`${conf.message} Say yes or no.`);
      }
    },
    [speak, theme.voiceFeedback]
  );

  const highlightElement = useCallback((elementId: string) => {
    setHighlightedElement(elementId);
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightedElement(null);
  }, []);

  // Expose functions globally
  useEffect(() => {
    (window as any).contextualUI = {
      addSuggestion,
      showConfirmation,
      highlightElement,
      clearHighlight,
      clearSuggestions: () => setSuggestions([]),
    };

    return () => {
      delete (window as any).contextualUI;
    };
  }, [addSuggestion, showConfirmation, highlightElement, clearHighlight]);

  // Get colors based on theme
  const getStyles = () => {
    if (theme.userMode === 'low-vision') {
      return {
        suggestionBg: '#000000',
        suggestionBorder: '4px solid #ffff00',
        suggestionText: '#ffff00',
        confirmationBg: '#000000',
        confirmationBorder: '4px solid #ffff00',
        confirmationText: '#ffff00',
      };
    }

    if (theme.userMode === 'blind') {
      return {
        suggestionBg: 'rgba(26, 58, 74, 0.95)',
        suggestionBorder: '2px solid rgba(0, 240, 255, 0.6)',
        suggestionText: '#00f0ff',
        confirmationBg: 'rgba(26, 58, 74, 0.95)',
        confirmationBorder: '2px solid rgba(0, 240, 255, 0.6)',
        confirmationText: '#ffffff',
      };
    }

    return {
      suggestionBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
      suggestionBorder: '1px solid rgba(59, 130, 246, 0.5)',
      suggestionText: '#93c5fd',
      confirmationBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
      confirmationBorder: '1px solid rgba(245, 158, 11, 0.5)',
      confirmationText: '#fcd34d',
    };
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Suggestions Container */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            className="fixed top-6 right-6 max-w-sm space-y-3 pointer-events-auto"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                className="w-full p-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3"
                style={{
                  background: styles.suggestionBg,
                  border: styles.suggestionBorder,
                  color: styles.suggestionText,
                }}
                onClick={() => {
                  suggestion.action();
                  onSuggestionTriggered?.(suggestion);
                  setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Lightbulb size={20} />
                <span className="font-medium">{suggestion.text}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmation && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={confirmation.onCancel}
          >
            <motion.div
              className="p-6 rounded-xl max-w-md text-center"
              style={{
                background: styles.confirmationBg,
                border: styles.confirmationBorder,
                color: styles.confirmationText,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertCircle size={32} className="mx-auto mb-4" />

              <h3
                className="font-bold text-lg mb-4"
                style={{
                  fontSize: theme.userMode === 'low-vision' ? '24px' : '18px',
                }}
              >
                {confirmation.message}
              </h3>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    confirmation.onCancel();
                    setConfirmation(null);
                    onConfirmationResponse?.(false);
                  }}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: theme.userMode === 'low-vision' ? '#000000' : 'rgba(0, 0, 0, 0.3)',
                    border:
                      theme.userMode === 'low-vision'
                        ? '3px solid #ffff00'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                    color: theme.userMode === 'low-vision' ? '#ffff00' : 'inherit',
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => {
                    confirmation.onConfirm();
                    setConfirmation(null);
                    onConfirmationResponse?.(true);
                  }}
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: theme.userMode === 'low-vision' ? '#ffff00' : 'rgba(59, 130, 246, 0.5)',
                    border:
                      theme.userMode === 'low-vision'
                        ? '3px solid #ffff00'
                        : '1px solid rgba(59, 130, 246, 0.8)',
                    color: theme.userMode === 'low-vision' ? '#000000' : 'inherit',
                  }}
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlighted element indicator */}
      {highlightedElement && (
        <motion.div
          className="fixed pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            boxShadow: `0 0 20px ${theme.userMode === 'low-vision' ? '#ffff00' : '#00f0ff'}`,
          }}
        />
      )}
    </div>
  );
};

export default ContextualUIBehavior;

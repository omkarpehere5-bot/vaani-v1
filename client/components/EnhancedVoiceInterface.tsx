import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import BlindModeInterface from './BlindModeInterface';
import LowVisionModeInterface from './LowVisionModeInterface';
import FuturisticModeInterface from './FuturisticModeInterface';
import EnhancedSettingsDashboard from './EnhancedSettingsDashboard';
import AIThinkingAnimation from './AIThinkingAnimation';
import VoiceFeedbackSystem from './VoiceFeedbackSystem';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedVoiceInterfaceProps {
  isProcessing?: boolean;
  processingMessage?: string;
}

const EnhancedVoiceInterface: React.FC<EnhancedVoiceInterfaceProps> = ({
  isProcessing = false,
  processingMessage = 'Processing your request...',
}) => {
  const { theme } = useTheme();
  const { registerCommand, speak } = useVoiceNavigation();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Register global voice commands
  useEffect(() => {
    const unregisterSettings = registerCommand(
      /open settings|show settings|settings/,
      () => {
        speak('Opening settings');
        setShowSettings(true);
      },
      'Open Settings'
    );

    const unregisterHelp = registerCommand(
      /help|how to use|what can i do|commands/,
      () => {
        const helpText = theme.userMode === 'blind'
          ? 'Say: open settings, read page, or speak your query'
          : theme.userMode === 'low-vision'
            ? 'Press buttons to interact or speak your commands'
            : 'Click the microphone button or speak your query';

        speak(helpText);
        setShowHelp(true);
      },
      'Help'
    );

    return () => {
      unregisterSettings();
      unregisterHelp();
    };
  }, [registerCommand, speak, theme.userMode]);

  // Handle help modal
  useEffect(() => {
    if (showHelp) {
      const timer = setTimeout(() => setShowHelp(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showHelp]);

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Voice Feedback System - overlay at bottom */}
      <VoiceFeedbackSystem />

      {/* AI Thinking Animation */}
      <AnimatePresence>
        {isProcessing && (
          <AIThinkingAnimation isVisible={isProcessing} message={processingMessage} />
        )}
      </AnimatePresence>

      {/* Settings Dashboard */}
      <AnimatePresence>
        {showSettings && (
          <EnhancedSettingsDashboard onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* Mode-specific interface rendering */}
      <AnimatePresence mode="wait">
        {theme.userMode === 'blind' ? (
          <BlindModeInterface
            key="blind"
            onSettingsClick={() => setShowSettings(true)}
            onHelpClick={() => setShowHelp(true)}
          />
        ) : theme.userMode === 'low-vision' ? (
          <LowVisionModeInterface
            key="low-vision"
            onSettingsClick={() => setShowSettings(true)}
            onHelpClick={() => setShowHelp(true)}
          />
        ) : (
          <FuturisticModeInterface
            key="futuristic"
            onSettingsClick={() => setShowSettings(true)}
            onHelpClick={() => setShowHelp(true)}
          />
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              className="p-8 rounded-xl max-w-md text-center"
              style={{
                background: theme.userMode === 'low-vision'
                  ? 'linear-gradient(135deg, #000000 0%, #1a1a00 100%)'
                  : theme.userMode === 'blind'
                    ? 'linear-gradient(135deg, #000000 0%, #1a2a3a 100%)'
                    : 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(26, 31, 58, 0.9) 100%)',
                border: theme.userMode === 'low-vision'
                  ? '4px solid #ffff00'
                  : '1px solid rgba(0, 240, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="font-bold mb-4"
                style={{
                  fontSize: theme.userMode === 'low-vision' ? '28px' : '24px',
                  color: theme.userMode === 'low-vision' ? '#ffff00' : '#00f0ff',
                }}
              >
                Help
              </h2>

              <div
                style={{
                  fontSize: theme.userMode === 'low-vision' ? '18px' : '14px',
                  color: theme.userMode === 'low-vision' ? '#ffff00' : '#ffffff',
                  lineHeight: '1.8',
                }}
                className="space-y-2"
              >
                {theme.userMode === 'blind' ? (
                  <>
                    <p>Say "open settings" - Open settings panel</p>
                    <p>Say "read page" - Hear page content</p>
                    <p>Say "help" - Hear this help message</p>
                  </>
                ) : theme.userMode === 'low-vision' ? (
                  <>
                    <p>PRESS HELP - View this message</p>
                    <p>PRESS SETTINGS - Open settings</p>
                    <p>PRESS MIC - Start voice input</p>
                  </>
                ) : (
                  <>
                    <p>Click the microphone button to speak</p>
                    <p>Say "open settings" to change preferences</p>
                    <p>Say "help" to hear this message again</p>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 px-6 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: theme.userMode === 'low-vision' ? '#ffff00' : '#00f0ff',
                  color: theme.userMode === 'low-vision' ? '#000000' : '#000000',
                  fontSize: theme.userMode === 'low-vision' ? '18px' : '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedVoiceInterface;

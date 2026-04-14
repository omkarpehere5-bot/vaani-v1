import React, { useEffect } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedMicButton from './AnimatedMicButton';
import AnimatedVoiceWaveform from './AnimatedVoiceWaveform';
import { motion } from 'framer-motion';

interface BlindModeInterfaceProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

const BlindModeInterface: React.FC<BlindModeInterfaceProps> = ({
  onSettingsClick,
  onHelpClick,
}) => {
  const { registerCommand, speak, isListening } = useVoiceNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    // Register voice commands specific to blind mode
    const unregisterSettings = registerCommand(
      /open settings|settings/,
      () => {
        speak('Opening settings panel');
        onSettingsClick();
      },
      'Open Settings'
    );

    const unregisterHelp = registerCommand(
      /help|what can i do|commands|how to use/,
      () => {
        speak('You can say: open settings, read page, start listening, stop listening');
        onHelpClick();
      },
      'Help'
    );

    return () => {
      unregisterSettings();
      unregisterHelp();
    };
  }, [registerCommand, speak, onSettingsClick, onHelpClick]);

  // Initial greeting
  useEffect(() => {
    if (theme.voiceFeedback) {
      setTimeout(() => {
        speak('Blind mode activated. Press the large button to start listening, or say help for commands.');
      }, 500);
    }
  }, []);

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-8 p-4 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main mic button - large and centered */}
      <div className="flex flex-col items-center gap-6">
        <AnimatedMicButton />

        {/* Status message for screen readers */}
        <div className="sr-only" role="status" aria-live="assertive">
          {isListening ? 'Listening - speak now' : 'Press button to start listening'}
        </div>
      </div>

      {/* Waveform visualization (minimal visual noise) */}
      {isListening && (
        <motion.div
          className="w-full max-w-xs"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
        >
          <AnimatedVoiceWaveform barCount={12} isActive={isListening} />
        </motion.div>
      )}

      {/* Quick actions - voice-only hints */}
      <div className="sr-only">
        <nav role="navigation" aria-label="Voice commands">
          <ul>
            <li>Say "open settings" to open settings panel</li>
            <li>Say "help" to hear available commands</li>
            <li>Say "read page" to hear page content</li>
            <li>Say "start listening" to activate voice mode</li>
            <li>Say "stop listening" to deactivate voice mode</li>
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default BlindModeInterface;

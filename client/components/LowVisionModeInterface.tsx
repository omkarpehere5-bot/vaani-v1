import React, { useEffect, useState } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedMicButton from './AnimatedMicButton';
import AnimatedVoiceWaveform from './AnimatedVoiceWaveform';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface LowVisionModeInterfaceProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

const LowVisionModeInterface: React.FC<LowVisionModeInterfaceProps> = ({
  onSettingsClick,
  onHelpClick,
}) => {
  const { registerCommand, speak, isListening } = useVoiceNavigation();
  const { theme } = useTheme();
  const [lastCommand, setLastCommand] = useState('');

  useEffect(() => {
    const unregisterSettings = registerCommand(
      /open settings|settings/,
      () => {
        speak('Opening settings');
        setLastCommand('Settings');
        onSettingsClick();
      },
      'Open Settings'
    );

    const unregisterHelp = registerCommand(
      /help|commands/,
      () => {
        speak('Available commands: Settings, Help, Read Page');
        setLastCommand('Help');
        onHelpClick();
      },
      'Help'
    );

    return () => {
      unregisterSettings();
      unregisterHelp();
    };
  }, [registerCommand, speak, onSettingsClick, onHelpClick]);

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-8 p-8"
      style={{
        backgroundColor: '#000000',
        color: '#ffff00',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with high contrast */}
      <motion.div
        className="text-center space-y-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: '48px',
            color: '#ffff00',
            textShadow: '2px 2px 0 #000000, -2px -2px 0 #000000',
          }}
        >
          VAANI
        </h1>
        <p
          className="font-bold"
          style={{
            fontSize: '28px',
            color: '#ffff00',
            textShadow: '1px 1px 0 #000000',
          }}
        >
          Voice Assistant
        </p>
      </motion.div>

      {/* Main mic button */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <AnimatedMicButton className="mb-4" />

        {/* Status with large text */}
        <div
          className="text-center font-bold p-4 border-4 border-yellow-300"
          style={{
            fontSize: '24px',
            backgroundColor: '#000000',
            color: '#ffff00',
            minWidth: '250px',
          }}
        >
          {isListening ? '🎤 LISTENING' : '○ READY'}
        </div>
      </motion.div>

      {/* Waveform */}
      {isListening && (
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatedVoiceWaveform barCount={16} isActive={isListening} />
        </motion.div>
      )}

      {/* Quick action buttons - HIGH CONTRAST */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button
          onClick={onHelpClick}
          className="h-24 text-2xl font-bold border-4 border-yellow-300"
          style={{
            backgroundColor: '#000000',
            color: '#ffff00',
            borderColor: '#ffff00',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffff00';
            (e.currentTarget as HTMLButtonElement).style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffff00';
          }}
        >
          HELP
        </Button>

        <Button
          onClick={onSettingsClick}
          className="h-24 text-2xl font-bold border-4 border-yellow-300"
          style={{
            backgroundColor: '#000000',
            color: '#ffff00',
            borderColor: '#ffff00',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffff00';
            (e.currentTarget as HTMLButtonElement).style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffff00';
          }}
        >
          SETTINGS
        </Button>
      </div>

      {/* Last command feedback */}
      {lastCommand && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 p-4 border-4 border-yellow-300 font-bold text-center"
          style={{
            backgroundColor: '#000000',
            color: '#ffff00',
            fontSize: '18px',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {lastCommand}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LowVisionModeInterface;

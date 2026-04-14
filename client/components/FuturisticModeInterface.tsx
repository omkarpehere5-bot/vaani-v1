import React, { useEffect, useState } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedMicButton from './AnimatedMicButton';
import AnimatedVoiceWaveform from './AnimatedVoiceWaveform';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle, Zap, Wand2 } from 'lucide-react';

interface FuturisticModeInterfaceProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

const FuturisticModeInterface: React.FC<FuturisticModeInterfaceProps> = ({
  onSettingsClick,
  onHelpClick,
}) => {
  const { registerCommand, speak, isListening, isSpeaking } = useVoiceNavigation();
  const { theme } = useTheme();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    const unregisterSettings = registerCommand(
      /open settings|settings/,
      () => {
        speak('Opening settings');
        onSettingsClick();
      },
      'Open Settings'
    );

    const unregisterHelp = registerCommand(
      /help|commands/,
      () => {
        speak('You can say: open settings, help, or start typing');
        onHelpClick();
      },
      'Help'
    );

    return () => {
      unregisterSettings();
      unregisterHelp();
    };
  }, [registerCommand, speak, onSettingsClick, onHelpClick]);

  // Container variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, type: 'spring', stiffness: 100 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  // Glassmorphic button component
  const GlassButton = ({
    icon: Icon,
    label,
    onClick,
    id,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    id: string;
  }) => (
    <motion.button
      className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300"
      style={{
        background: hoveredButton === id
          ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(176, 0, 255, 0.3))'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(10px)',
        boxShadow: hoveredButton === id
          ? '0 8px 32px rgba(0, 240, 255, 0.2)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onMouseEnter={() => setHoveredButton(id)}
      onMouseLeave={() => setHoveredButton(null)}
    >
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ y: hoveredButton === id ? -3 : 0 }}
          className="text-cyan-400"
        >
          {Icon}
        </motion.div>
        <span className="font-semibold text-white text-sm">{label}</span>
      </div>

      {/* Glow effect on hover */}
      {hoveredButton === id && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15), transparent)',
            pointerEvents: 'none',
          }}
          layoutId={`glow-${id}`}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-12 p-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Animated header */}
      <motion.div
        className="text-center space-y-4"
        variants={itemVariants}
        custom={0}
      >
        <motion.h1
          className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          VAANI
        </motion.h1>
        <p className="text-gray-300 text-lg">Your AI Voice Assistant</p>
      </motion.div>

      {/* Main mic button */}
      <motion.div
        className="flex flex-col items-center gap-6"
        variants={itemVariants}
        custom={1}
      >
        <div className="relative">
          <AnimatedMicButton />

          {/* Orbiting particles */}
          {theme.enableAnimations && (
            <>
              <motion.div
                className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-cyan-400"
                animate={{
                  x: Math.cos(0) * 80,
                  y: Math.sin(0) * 80,
                  rotate: 360,
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-purple-400"
                animate={{
                  x: Math.cos(Math.PI * 0.66) * 80,
                  y: Math.sin(Math.PI * 0.66) * 80,
                  rotate: -360,
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-blue-400"
                animate={{
                  x: Math.cos(Math.PI * 1.33) * 80,
                  y: Math.sin(Math.PI * 1.33) * 80,
                  rotate: 360,
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
            </>
          )}
        </div>

        {/* Status indicator */}
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-cyan-400 text-sm font-medium">
            {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}
          </span>
        </motion.div>
      </motion.div>

      {/* Waveform visualization */}
      {(isListening || isSpeaking) && (
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
        >
          <AnimatedVoiceWaveform barCount={24} isActive={isListening || isSpeaking} />
        </motion.div>
      )}

      {/* Quick action buttons */}
      <motion.div
        className="grid grid-cols-2 gap-6 w-full max-w-lg"
        variants={itemVariants}
        custom={2}
      >
        <GlassButton
          icon={<Settings size={24} />}
          label="Settings"
          onClick={onSettingsClick}
          id="settings"
        />
        <GlassButton
          icon={<HelpCircle size={24} />}
          label="Help"
          onClick={onHelpClick}
          id="help"
        />
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        className="flex gap-4 justify-center text-xs text-gray-400"
        variants={itemVariants}
        custom={3}
      >
        <motion.div
          className="flex items-center gap-1"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap size={14} />
          Fast Response
        </motion.div>
        <motion.div
          className="flex items-center gap-1"
          animate={{ x: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        >
          <Wand2 size={14} />
          Smart Voice
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FuturisticModeInterface;

import React, { useEffect, useState } from 'react';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface AnimatedVoiceWaveformProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
}

const AnimatedVoiceWaveform: React.FC<AnimatedVoiceWaveformProps> = ({
  isActive = true,
  barCount = 20,
  className = '',
}) => {
  const { isListening, isSpeaking } = useVoiceNavigation();
  const { theme } = useTheme();
  const [audioData, setAudioData] = useState<number[]>(Array(barCount).fill(0.3));

  // Simulate audio data
  useEffect(() => {
    if (!isActive || (!isListening && !isSpeaking)) return;

    const interval = setInterval(() => {
      setAudioData(
        Array(barCount)
          .fill(0)
          .map(() => Math.random() * 0.8 + 0.2)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isListening, isSpeaking, barCount]);

  // Get colors based on theme
  const getWaveColor = () => {
    if (theme.userMode === 'low-vision') return '#ffff00';
    if (theme.userMode === 'blind') return '#00f0ff';

    if (isSpeaking) return '#b000ff';
    if (isListening) return '#ff006e';
    return '#0080ff';
  };

  const waveColor = getWaveColor();

  // Animation variants for bars
  const barVariants = (index: number) => ({
    initial: { scaleY: 0.3, opacity: 0.5 },
    animate: {
      scaleY: isActive && (isListening || isSpeaking) ? audioData[index] : 0.3,
      opacity: isActive && (isListening || isSpeaking) ? 1 : 0.5,
    },
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  });

  // Container animation
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      className={`flex items-end justify-center gap-1 ${className}`}
      style={{
        height: '60px',
        minWidth: '100%',
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="status"
      aria-label={
        isListening
          ? 'Voice input waveform - listening'
          : isSpeaking
            ? 'Voice output waveform - speaking'
            : 'Voice waveform - idle'
      }
    >
      {/* Animated bars */}
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="rounded-full flex-1"
          style={{
            backgroundColor: waveColor,
            minHeight: '4px',
            filter: theme.enableGlow ? `drop-shadow(0 0 8px ${waveColor})` : 'none',
          }}
          variants={barVariants(index)}
          animate="animate"
          transition={{
            duration: 0.1 + (index * 0.01),
            ease: 'easeInOut',
            repeat: isActive ? Infinity : 0,
          }}
        />
      ))}

      {/* Glow effect for futuristic mode */}
      {theme.userMode === 'standard' && theme.enableGlow && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            backgroundColor: waveColor,
            opacity: 0.1,
            pointerEvents: 'none',
          }}
          animate={{
            opacity: isListening || isSpeaking ? 0.2 : 0.05,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedVoiceWaveform;

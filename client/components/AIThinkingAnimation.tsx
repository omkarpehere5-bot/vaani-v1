import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface AIThinkingAnimationProps {
  isVisible: boolean;
  message?: string;
}

const AIThinkingAnimation: React.FC<AIThinkingAnimationProps> = ({
  isVisible,
  message = 'Processing...',
}) => {
  const { theme } = useTheme();

  if (!isVisible) return null;

  // Get colors based on theme
  const getColor = () => {
    if (theme.userMode === 'low-vision') return '#ffff00';
    if (theme.userMode === 'blind') return '#00f0ff';
    return '#00f0ff';
  };

  const color = getColor();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        {/* Animated thinking dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 10px ${color}`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Message text */}
        <motion.div
          className="text-center"
          style={{ color: 'white' }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="font-semibold text-lg">{message}</p>
          <p className="text-sm text-gray-400 mt-2">AI is thinking...</p>
        </motion.div>

        {/* Orbiting circles for futuristic feel */}
        {theme.userMode === 'standard' && (
          <div className="relative w-24 h-24">
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-purple-400/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-blue-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AIThinkingAnimation;

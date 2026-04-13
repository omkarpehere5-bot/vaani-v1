import React, { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface ModeSpecificUIProps {
  children: ReactNode;
}

/**
 * Container that applies mode-specific styling and layout
 * Automatically adapts UI based on selected user mode
 */
const ModeSpecificUI: React.FC<ModeSpecificUIProps> = ({ children }) => {
  const { theme } = useTheme();

  // Blind Mode Layout - Voice-first, minimal visual clutter
  if (theme.userMode === 'blind') {
    return (
      <motion.div
        className="user-mode-blind w-full h-full flex flex-col items-center justify-center gap-4 p-4"
        style={{
          backgroundColor: '#000000',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hide visual elements but keep for screen readers */}
        <div className="sr-only">Blind user mode activated. Voice navigation enabled.</div>

        {/* Large central zone for touch interaction */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm gap-6">
          {children}
        </div>

        {/* Accessibility help text */}
        <div className="fixed bottom-4 left-4 right-4 text-center text-white text-sm sr-only">
          Use voice commands: "open settings", "help", "start listening", "stop listening"
        </div>
      </motion.div>
    );
  }

  // Low Vision Mode Layout - High contrast, large elements
  if (theme.userMode === 'low-vision') {
    return (
      <motion.div
        className="user-mode-low-vision w-full h-full flex flex-col items-center justify-center gap-8 p-6"
        style={{
          backgroundColor: '#000000',
          color: '#ffff00',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* High contrast container */}
        <div className="w-full flex flex-col items-center justify-center gap-8">
          {children}
        </div>

        {/* Accessibility indicator */}
        <div className="fixed bottom-4 left-4 right-4 p-4 border-4 border-yellow-300 bg-black text-yellow-300 text-center font-bold">
          HIGH CONTRAST MODE ACTIVE
        </div>
      </motion.div>
    );
  }

  // Standard Mode Layout - Futuristic, animated, glassmorphic
  return (
    <motion.div
      className="user-mode-standard w-full h-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background for futuristic feel */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1929 100%)',
        }}
      />

      {/* Animated particle effect */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(176, 0, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(0, 100, 255, 0.05) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Glassmorphic content container */}
      <motion.div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6 p-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {children}
      </motion.div>

      {/* Floating accent elements (non-interactive) */}
      {theme.enableAnimations && (
        <>
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl z-0"
            style={{
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl z-0"
            style={{
              background: 'radial-gradient(circle, rgba(176, 0, 255, 0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default ModeSpecificUI;

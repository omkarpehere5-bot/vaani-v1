import React, { ReactNode, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useVoiceNavigation } from '@/contexts/VoiceNavigationContext';
import EnhancedVoiceInterface from './EnhancedVoiceInterface';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInterfaceWrapperProps {
  children: ReactNode;
  isProcessing?: boolean;
  processingMessage?: string;
  useEnhancedInterface?: boolean;
}

/**
 * Wrapper component that can render either:
 * 1. The traditional app interface (children)
 * 2. The new EnhancedVoiceInterface
 * Based on user preferences and mode
 */
const VoiceInterfaceWrapper: React.FC<VoiceInterfaceWrapperProps> = ({
  children,
  isProcessing = false,
  processingMessage = 'Processing...',
  useEnhancedInterface = true,
}) => {
  const { theme } = useTheme();
  const { registerCommand } = useVoiceNavigation();
  const [useEnhanced, setUseEnhanced] = useState(useEnhancedInterface);

  // Register command to toggle interface
  useEffect(() => {
    const unregister = registerCommand(
      /switch interface|toggle interface|use default|use enhanced|classic mode|modern mode/,
      () => {
        setUseEnhanced(!useEnhanced);
      },
      'Toggle Interface'
    );

    return unregister;
  }, [registerCommand, useEnhanced]);

  // In blind or low vision mode, always use enhanced interface
  const shouldUseEnhanced =
    useEnhanced && (theme.userMode === 'blind' || theme.userMode === 'low-vision');

  return (
    <AnimatePresence mode="wait">
      {shouldUseEnhanced ? (
        <motion.div
          key="enhanced"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <EnhancedVoiceInterface
            isProcessing={isProcessing}
            processingMessage={processingMessage}
          />
        </motion.div>
      ) : (
        <motion.div
          key="traditional"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceInterfaceWrapper;

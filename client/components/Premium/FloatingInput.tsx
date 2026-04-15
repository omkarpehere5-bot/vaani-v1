import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onVoiceClick: () => void;
  isListening?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const FloatingInput = React.forwardRef<HTMLDivElement, FloatingInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onVoiceClick,
      isListening = false,
      isLoading = false,
      placeholder = 'Ask Vaani...',
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    return (
      <motion.div
        ref={ref}
        className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Floating glass container */}
        <div className="relative group">
          <div
            className={cn(
              'relative rounded-full bg-gradient-to-r from-white/10 via-white/8 to-white/10',
              'border border-white/20 backdrop-blur-2xl shadow-glass',
              'transition-all duration-300',
              isListening && 'border-cyan-400/50 shadow-glow-md'
            )}
          >
            {/* Input area */}
            <div className="flex items-center gap-3 px-6 py-4">
              {/* Voice button */}
              <motion.button
                onClick={onVoiceClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex-shrink-0 p-2 rounded-full transition-all duration-300',
                  isListening
                    ? 'bg-cyan-500/30 text-cyan-300 shadow-glow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <motion.div
                  animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
                >
                  <Mic size={20} />
                </motion.div>
              </motion.button>

              {/* Text input */}
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />

              {/* Send button */}
              <motion.button
                onClick={onSubmit}
                disabled={isLoading || !value.trim()}
                whileHover={value.trim() ? { scale: 1.1 } : { scale: 1 }}
                whileTap={value.trim() ? { scale: 0.95 } : { scale: 1 }}
                className={cn(
                  'flex-shrink-0 p-2 rounded-full transition-all duration-300',
                  value.trim()
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-glow-md hover:shadow-glow-lg'
                    : 'text-white/40 bg-white/5'
                )}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  <Send size={18} />
                </motion.div>
              </motion.button>
            </div>

            {/* Animated border glow on focus */}
            <div className="absolute inset-0 rounded-full pointer-events-none">
              <div
                className={cn(
                  'absolute inset-0 rounded-full',
                  'opacity-0 group-focus-within:opacity-100',
                  'bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0',
                  'transition-opacity duration-300 blur-lg'
                )}
              />
            </div>
          </div>

          {/* Floating glow effect */}
          {isListening && (
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl -z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export default FloatingInput;

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Volume2, Copy, Trash2 } from 'lucide-react';

interface GlassChatBubbleProps {
  message: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
  isLoading?: boolean;
  onVoicePlay?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const GlassChatBubble: React.FC<GlassChatBubbleProps> = ({
  message,
  role,
  timestamp,
  isLoading = false,
  onVoicePlay,
  onCopy,
  onDelete,
  showActions = false,
}) => {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn('flex gap-3 mb-4', isAssistant ? 'justify-start' : 'justify-end')}
    >
      <div className={cn('flex flex-col gap-2 max-w-xs lg:max-w-2xl', isAssistant ? 'items-start' : 'items-end')}>
        {/* Chat bubble */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            'relative px-4 py-3 rounded-2xl backdrop-blur-md border transition-all duration-300 group',
            isAssistant
              ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20 text-white shadow-glass hover:shadow-glass-lg hover:border-cyan-400/30'
              : 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400/50 text-white shadow-glow-md'
          )}
        >
          {/* Content */}
          {isLoading ? (
            <div className="space-y-2">
              <motion.div
                className="h-3 bg-gradient-to-r from-white/20 to-transparent rounded"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-3 bg-gradient-to-r from-white/20 to-transparent rounded"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-3 w-2/3 bg-gradient-to-r from-white/20 to-transparent rounded"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message}</p>
          )}

          {/* Glow effect for assistant messages */}
          {isAssistant && (
            <div className="absolute inset-0 rounded-2xl shadow-inner-glow pointer-events-none" />
          )}
        </motion.div>

        {/* Timestamp */}
        {timestamp && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-white/40 px-2"
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </motion.span>
        )}

        {/* Action buttons */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isAssistant && onVoicePlay && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onVoicePlay}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-white/60 hover:text-cyan-300 transition-all"
                title="Play audio"
              >
                <Volume2 size={16} />
              </motion.button>
            )}

            {onCopy && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCopy}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-white/60 hover:text-cyan-300 transition-all"
                title="Copy message"
              >
                <Copy size={16} />
              </motion.button>
            )}

            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/60 hover:text-red-300 transition-all"
                title="Delete message"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GlassChatBubble;

import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import FloatingSidebar from './FloatingSidebar';
import FloatingInput from './FloatingInput';
import { MessageSquare, Settings, HelpCircle, History, Zap, Globe } from 'lucide-react';

interface PremiumLayoutProps {
  children: ReactNode;
  onInput?: (text: string) => void;
  onVoiceClick?: () => void;
  isListening?: boolean;
  isLoading?: boolean;
  onSettingsClick?: () => void;
  onHistoryClick?: () => void;
}

const PremiumLayout: React.FC<PremiumLayoutProps> = ({
  children,
  onInput,
  onVoiceClick,
  isListening = false,
  isLoading = false,
  onSettingsClick,
  onHistoryClick,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      id: 'chat',
      label: 'New Chat',
      icon: <MessageSquare size={20} />,
      onClick: () => console.log('New chat'),
      active: true,
    },
    {
      id: 'history',
      label: 'History',
      icon: <History size={20} />,
      onClick: onHistoryClick || (() => {}),
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: <Zap size={20} />,
      onClick: () => console.log('Explore'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      onClick: onSettingsClick || (() => {}),
    },
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onInput?.(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-premium-darker via-premium-dark to-[#0f1929] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 right-20 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Floating Sidebar */}
        <FloatingSidebar items={navItems} onToggle={setIsSidebarOpen} />

        {/* Top status bar */}
        <motion.div
          className="h-16 px-6 flex items-center justify-between border-b border-white/10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-white/60">
              {isListening ? 'Listening...' : isLoading ? 'Processing...' : 'Ready'}
            </span>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4 text-white/60">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span className="text-xs">Online</span>
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">{children}</div>

        {/* Floating Input */}
        <FloatingInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          onVoiceClick={onVoiceClick || (() => {})}
          isListening={isListening}
          isLoading={isLoading}
        />
      </div>

      {/* Ambient floating particles (optional) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumLayout;

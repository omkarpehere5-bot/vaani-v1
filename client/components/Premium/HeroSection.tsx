import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AIOrb from './AIOrb';
import GlassCard from './GlassCard';
import InteractiveTile from './InteractiveTile';
import { Sparkles, Zap, Brain, Globe } from 'lucide-react';

interface HeroSectionProps {
  aiState?: 'idle' | 'listening' | 'processing' | 'speaking';
  userName?: string;
  onQuickAction?: (action: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  aiState = 'idle',
  userName = 'User',
  onQuickAction,
}) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setTime(new Date());
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickActions = [
    {
      icon: <Brain size={28} />,
      title: 'Analyze',
      description: 'Get insights on any topic',
      id: 'analyze',
    },
    {
      icon: <Globe size={28} />,
      title: 'Search',
      description: 'Find information online',
      id: 'search',
    },
    {
      icon: <Zap size={28} />,
      title: 'Create',
      description: 'Generate content instantly',
      id: 'create',
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Enhance',
      description: 'Improve your text',
      id: 'enhance',
    },
  ];

  return (
    <motion.div
      className="w-full space-y-12 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-8 pt-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            <motion.span
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%'] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              {greeting}, {userName}
            </motion.span>
          </h1>

          <motion.p
            className="text-lg text-white/60"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — How can I help you today?
          </motion.p>
        </motion.div>

        {/* AI Orb */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
        >
          <AIOrb state={aiState} size="lg" />
        </motion.div>

        {/* Status message */}
        <motion.div
          className="text-sm text-white/50 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {aiState === 'idle' && 'Ready to assist'}
          {aiState === 'listening' && 'Listening to you...'}
          {aiState === 'processing' && 'Thinking...'}
          {aiState === 'speaking' && 'Speaking...'}
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, staggerChildren: 0.1 }}
      >
        {quickActions.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <InteractiveTile
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={() => onQuickAction?.(action.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Info Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Tips Card */}
        <GlassCard variant="subtle">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles size={20} />
              Pro Tips
            </h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li>• Use voice commands for hands-free control</li>
              <li>• Ask follow-up questions to refine results</li>
              <li>• Save your favorite responses for later</li>
            </ul>
          </div>
        </GlassCard>

        {/* Features Card */}
        <GlassCard variant="subtle">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
              <Zap size={20} />
              Features
            </h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li>✓ Real-time voice interaction</li>
              <li>✓ Advanced AI reasoning</li>
              <li>✓ Multi-language support</li>
            </ul>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;

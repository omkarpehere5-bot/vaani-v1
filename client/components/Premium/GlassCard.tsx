import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'subtle';
  hover?: boolean;
  glow?: 'blue' | 'cyan' | 'purple' | 'none';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      hover = true,
      glow = 'cyan',
      ...motionProps
    },
    ref
  ) => {
    const baseStyles =
      'relative rounded-2xl border backdrop-blur-md transition-all duration-300';

    const variants = {
      default: 'bg-white/5 border-white/10 shadow-glass',
      interactive: 'bg-white/8 border-white/20 shadow-glass hover:shadow-glass-lg',
      subtle:
        'bg-white/3 border-white/5 shadow-sm hover:shadow-glass',
    };

    const glowStyles = {
      blue: 'hover:shadow-glow-blue',
      cyan: 'hover:shadow-glow-cyan hover:border-cyan-400/30',
      purple: 'hover:shadow-glow-purple hover:border-purple-400/30',
      none: '',
    };

    const hoverStyles = hover
      ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:translate-y-[-2px]'
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, glowStyles[glow], className)}
        whileHover={hover ? { y: -2 } : undefined}
        whileTap={hover ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        {...motionProps}
      >
        <div className="relative z-10">{children}</div>

        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-2xl shadow-inner-glow pointer-events-none" />
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;

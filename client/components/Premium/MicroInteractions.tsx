import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Ripple Effect - Click ripple animation
 */
export const RippleEffect: React.FC<{
  x: number;
  y: number;
  duration?: number;
}> = ({ x, y, duration = 0.6 }) => (
  <motion.div
    className="fixed pointer-events-none rounded-full bg-white/30"
    initial={{ x, y, scale: 0, opacity: 1 }}
    animate={{ scale: 4, opacity: 0 }}
    transition={{ duration }}
    style={{
      width: 2,
      height: 2,
      transform: 'translate(-50%, -50%)',
    }}
  />
);

interface RippleContainerProps {
  children: React.ReactNode;
  onRipple?: (x: number, y: number) => void;
}

export const RippleContainer: React.FC<RippleContainerProps> = ({ children, onRipple }) => {
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    if (onRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onRipple(x, y);

      const id = Math.random().toString();
      setRipples((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
  };

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      {ripples.map((ripple) => (
        <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
    </div>
  );
};

/**
 * Success Animation - Checkmark animation
 */
export const SuccessAnimation: React.FC<{ show: boolean }> = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="text-cyan-400"
        >
          <motion.circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ strokeDasharray: 220, strokeDashoffset: 220 }}
            animate={{ strokeDasharray: 220, strokeDashoffset: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M 25 40 L 35 50 L 55 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: 60, strokeDashoffset: 60 }}
            animate={{ strokeDasharray: 60, strokeDashoffset: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.svg>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * Loading Spinner - Animated spinner
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeMap = { sm: 20, md: 40, lg: 60 };
  const sz = sizeMap[size];

  return (
    <motion.svg
      width={sz}
      height={sz}
      viewBox="0 0 50 50"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <motion.circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ strokeDasharray: 125, strokeDashoffset: 125 }}
        animate={{ strokeDasharray: 125, strokeDashoffset: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 1)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

/**
 * Shake Animation - Error shake effect
 */
export const ShakeContainer: React.FC<{
  children: React.ReactNode;
  trigger?: boolean;
}> = ({ children, trigger = false }) => (
  <motion.div
    animate={
      trigger
        ? { x: [-10, 10, -10, 10, 0] }
        : { x: 0 }
    }
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

/**
 * Pulse Effect - Subtle breathing animation
 */
export const PulseEffect: React.FC<{ children: React.ReactNode; intensity?: number }> = ({
  children,
  intensity = 0.2,
}) => (
  <motion.div
    animate={{ scale: [1, 1 + intensity, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

/**
 * Glow Pulse - Breathing glow effect
 */
interface GlowPulseProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'blue';
  intensity?: number;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  children,
  color = 'cyan',
  intensity = 1,
}) => {
  const colorMap = {
    cyan: '0 0 20px rgba(6, 182, 212, 0.4)',
    purple: '0 0 20px rgba(168, 85, 247, 0.4)',
    blue: '0 0 20px rgba(59, 130, 246, 0.4)',
  };

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 10px rgba(6, 182, 212, ${0.1 * intensity})`,
          colorMap[color],
          `0 0 10px rgba(6, 182, 212, ${0.1 * intensity})`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Skeleton Loading - Shimmer skeleton
 */
interface SkeletonProps {
  count?: number;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 3,
  width = 'w-full',
  height = 'h-4',
}) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className={`${width} ${height} rounded bg-gradient-to-r from-white/10 via-white/20 to-white/10`}
        animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          backgroundSize: '200% 100%',
        }}
      />
    ))}
  </div>
);

/**
 * Floating Animation - Floating motion
 */
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  duration?: number;
  distance?: number;
}> = ({ children, duration = 3, distance = 20 }) => (
  <motion.div
    animate={{ y: [0, -distance, 0] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

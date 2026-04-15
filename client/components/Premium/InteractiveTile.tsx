import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InteractiveTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

const InteractiveTile: React.FC<InteractiveTileProps> = ({
  icon,
  title,
  description,
  onClick,
  className,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotationX = ((y - centerY) / centerY) * 10;
    const rotationY = ((x - centerX) / centerX) * -10;

    setRotateX(rotationX);
    setRotateY(rotationY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative h-48 p-6 rounded-2xl cursor-pointer',
        'bg-gradient-to-br from-white/10 via-white/5 to-transparent',
        'border border-white/20 backdrop-blur-md',
        'shadow-glass hover:shadow-glass-lg',
        'transition-all duration-300 group',
        'overflow-hidden',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      } as any}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          className="text-cyan-400 group-hover:text-cyan-300 transition-colors"
        >
          {icon}
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: 'none' }}
      />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl border border-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default InteractiveTile;

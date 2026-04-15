import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveLayoutProps {
  children: ReactNode;
  layoutMode?: 'mobile' | 'tablet' | 'desktop';
}

/**
 * Responsive mobile-first layout
 */
export const ResponsiveMobileLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-screen">
    {/* Mobile bottom navigation */}
    <motion.div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/50 to-transparent border-t border-white/10 px-4 py-3 flex justify-around">
      {/* Navigation items will be rendered here */}
    </motion.div>

    {/* Mobile content */}
    <div className="flex-1 overflow-y-auto pb-24 md:pb-0">{children}</div>
  </div>
);

/**
 * Responsive tablet layout
 */
export const ResponsiveTabletLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="hidden md:flex lg:hidden h-screen gap-4 p-4">
    {/* Sidebar for tablet */}
    <motion.aside
      className="w-48 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-md p-4"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      {/* Tablet sidebar content */}
    </motion.aside>

    {/* Main content */}
    <div className="flex-1 overflow-y-auto">{children}</div>
  </div>
);

/**
 * Responsive desktop layout
 */
export const ResponsiveDesktopLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="hidden lg:flex h-screen gap-6 p-6">
    {/* Wide sidebar */}
    <motion.aside
      className="w-64 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-md p-6 overflow-y-auto"
      initial={{ x: -150, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      {/* Desktop sidebar content */}
    </motion.aside>

    {/* Main content area */}
    <div className="flex-1 overflow-y-auto">{children}</div>
  </div>
);

/**
 * Adaptive container that changes based on screen size
 */
interface AdaptiveContainerProps {
  children: ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}

export const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  children,
  mobile,
  tablet,
  desktop,
}) => (
  <>
    {/* Mobile view */}
    <div className="md:hidden">{mobile || children}</div>

    {/* Tablet view */}
    <div className="hidden md:block lg:hidden">{tablet || children}</div>

    {/* Desktop view */}
    <div className="hidden lg:block">{desktop || children}</div>
  </>
);

/**
 * Responsive grid
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
}) => {
  const gridClass = `grid gap-${gap} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

  return (
    <motion.div
      className={gridClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Responsive drawer/sheet for mobile
 */
interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'bottom';
}

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'left',
}) => {
  const positionVariants = {
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
    },
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
    },
    bottom: {
      hidden: { y: '100%' },
      visible: { y: 0 },
    },
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <motion.div
        className="fixed z-50 md:hidden"
        style={{
          [position === 'left' || position === 'right' ? 'top' : 'bottom']: 0,
          [position]: 0,
          [position === 'bottom' ? 'left' : position]: 0,
          [position === 'bottom' ? 'right' : position]: 0,
          maxHeight: position === 'bottom' ? '80vh' : '100vh',
        }}
        variants={positionVariants}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-full h-full bg-gradient-to-b from-white/10 to-white/5 border-t border-white/20 backdrop-blur-2xl rounded-t-3xl overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  );
};

/**
 * Responsive font sizing
 */
interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className = '',
  size = 'base',
}) => {
  const sizeMap = {
    sm: 'text-xs md:text-sm lg:text-base',
    base: 'text-sm md:text-base lg:text-lg',
    lg: 'text-base md:text-lg lg:text-xl',
    xl: 'text-lg md:text-xl lg:text-2xl',
    '2xl': 'text-xl md:text-2xl lg:text-3xl',
    '3xl': 'text-2xl md:text-3xl lg:text-4xl',
    '4xl': 'text-3xl md:text-4xl lg:text-5xl',
    '5xl': 'text-4xl md:text-5xl lg:text-6xl',
  };

  return <span className={`${sizeMap[size]} ${className}`}>{children}</span>;
};

/**
 * Responsive padding
 */
export const withResponsivePadding = (baseClass: string) => {
  return `p-4 md:p-6 lg:p-8 ${baseClass}`;
};

/**
 * Responsive margin
 */
export const withResponsiveMargin = (baseClass: string) => {
  return `m-2 md:m-4 lg:m-6 ${baseClass}`;
};

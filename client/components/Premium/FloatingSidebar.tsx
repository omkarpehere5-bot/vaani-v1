import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, Settings, HelpCircle, History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

interface FloatingSidebarProps {
  items: NavItem[];
  onToggle?: (isOpen: boolean) => void;
}

const FloatingSidebar: React.FC<FloatingSidebarProps> = ({ items, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle?.(!isOpen);
  };

  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-50 p-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-glass"
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleToggle}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-40 w-64 h-screen pt-24 px-4 overflow-y-auto"
          >
            {/* Glass container */}
            <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-2xl shadow-glass-lg p-6 space-y-4 min-h-full">
              {/* Header */}
              <motion.div
                variants={itemVariants}
                custom={0}
                className="mb-8 pb-4 border-b border-white/10"
              >
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                    <MessageSquare size={24} className="text-cyan-400" />
                  </motion.div>
                  Vaani
                </h2>
              </motion.div>

              {/* Navigation items */}
              <nav className="space-y-2">
                {items.map((item, i) => (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    custom={i + 1}
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                      item.active
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 text-white shadow-glow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                    )}
                  >
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={item.active ? 'text-cyan-300' : 'text-white/60 group-hover:text-cyan-300'}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Footer */}
              <motion.div variants={itemVariants} custom={items.length + 2} className="mt-auto pt-4 border-t border-white/10">
                <div className="text-xs text-white/40 space-y-2">
                  <p>Version 2.0</p>
                  <p>Premium Interface</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSidebar;

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface AIOrbProps {
  state?: 'idle' | 'listening' | 'processing' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
}

const AIOrb: React.FC<AIOrbProps> = ({ state = 'idle', size = 'lg' }) => {
  const sizeMap = {
    sm: { container: 64, icon: 24, rings: 3 },
    md: { container: 96, icon: 32, rings: 4 },
    lg: { container: 140, icon: 48, rings: 5 },
  };

  const config = sizeMap[size];

  // Generate random waveform data for visualization
  const waveData = useMemo(() => {
    if (state !== 'listening' && state !== 'speaking') {
      return Array(12).fill(0.3);
    }
    return Array(12)
      .fill(0)
      .map(() => Math.random() * 0.7 + 0.2);
  }, [state]);

  // State-based styling
  const getStateStyles = () => {
    switch (state) {
      case 'listening':
        return {
          glowColor: 'from-cyan-500 to-blue-500',
          pulseShadow: '0 0 40px rgba(6, 182, 212, 0.6)',
          textColor: 'text-cyan-300',
        };
      case 'processing':
        return {
          glowColor: 'from-purple-500 to-indigo-500',
          pulseShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
          textColor: 'text-purple-300',
        };
      case 'speaking':
        return {
          glowColor: 'from-indigo-500 to-cyan-500',
          pulseShadow: '0 0 50px rgba(99, 102, 241, 0.6)',
          textColor: 'text-indigo-300',
        };
      default:
        return {
          glowColor: 'from-blue-500/30 to-cyan-500/30',
          pulseShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
          textColor: 'text-blue-200',
        };
    }
  };

  const styles = getStateStyles();

  const ringAnimations = [
    { duration: 3, delay: 0 },
    { duration: 4, delay: 0.2 },
    { duration: 5, delay: 0.4 },
    { duration: 3.5, delay: 0.1 },
    { duration: 4.5, delay: 0.3 },
  ];

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="relative" style={{ width: config.container, height: config.container }}>
        {/* Animated rings */}
        {state !== 'idle' &&
          ringAnimations.map((ring, i) => (
            <motion.div
              key={i}
              className={`absolute inset-0 rounded-full border border-gradient-to-r ${styles.glowColor}`}
              style={{
                borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`,
              }}
              animate={{ scale: [0.8, 1.2], opacity: [0.8, 0] }}
              transition={{
                duration: ring.duration,
                delay: ring.delay,
                repeat: Infinity,
              }}
            />
          ))}

        {/* Central orb */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${styles.glowColor} flex items-center justify-center`}
          style={{
            boxShadow: styles.pulseShadow,
          }}
          animate={
            state === 'idle'
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    `0 0 20px rgba(59, 130, 246, 0.2)`,
                    `0 0 30px rgba(59, 130, 246, 0.4)`,
                    `0 0 20px rgba(59, 130, 246, 0.2)`,
                  ],
                }
              : state === 'listening'
                ? {
                    boxShadow: [
                      `0 0 20px ${styles.pulseShadow}`,
                      `0 0 40px ${styles.pulseShadow}`,
                      `0 0 20px ${styles.pulseShadow}`,
                    ],
                  }
                : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Icon */}
          <motion.div
            animate={
              state === 'processing' ? { rotate: 360 } : state === 'speaking' ? { scale: [1, 1.1, 1] } : {}
            }
            transition={{
              duration: state === 'processing' ? 3 : 1,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={styles.textColor}
          >
            <Brain size={config.icon} />
          </motion.div>
        </motion.div>

        {/* Waveform visualization */}
        {(state === 'listening' || state === 'speaking') && (
          <div className="absolute inset-0 flex items-center justify-center gap-0.5">
            {waveData.map((height, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-full bg-gradient-to-t ${styles.glowColor}`}
                style={{
                  height: `${height * 100}%`,
                  minHeight: '2px',
                  boxShadow: `0 0 10px ${styles.pulseShadow}`,
                }}
                animate={{ scaleY: [height, height * 0.5, height] }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Outer glow */}
        {state !== 'idle' && (
          <motion.div
            className={`absolute -inset-4 rounded-full bg-gradient-to-r ${styles.glowColor} blur-2xl opacity-30`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default AIOrb;

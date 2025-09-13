import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    // Create animated gradient orbs
    const createOrb = (index: number) => {
      const orb = document.createElement('div');
      orb.className = `absolute rounded-full opacity-20 blur-3xl animate-pulse`;
      
      // Different sizes and colors for variety
      const sizes = ['w-32 h-32', 'w-48 h-48', 'w-64 h-64', 'w-40 h-40'];
      const colors = [
        'bg-blue-500/30',
        'bg-purple-500/30', 
        'bg-indigo-500/30',
        'bg-cyan-500/30',
        'bg-violet-500/30'
      ];
      
      orb.className += ` ${sizes[index % sizes.length]} ${colors[index % colors.length]}`;
      
      // Random initial position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      orb.style.left = `${x}%`;
      orb.style.top = `${y}%`;
      
      // Smooth floating animation
      orb.style.animation = `float-${index} ${15 + Math.random() * 10}s ease-in-out infinite`;
      
      return orb;
    };

    // Create multiple orbs
    const orbs = Array.from({ length: 5 }, (_, i) => createOrb(i));
    orbs.forEach(orb => background.appendChild(orb));

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-0 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(20px, -30px) scale(1.1); }
        50% { transform: translate(-15px, 20px) scale(0.9); }
        75% { transform: translate(25px, 10px) scale(1.05); }
      }
      @keyframes float-1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-25px, 20px) scale(0.95); }
        50% { transform: translate(30px, -15px) scale(1.1); }
        75% { transform: translate(-10px, -25px) scale(1.05); }
      }
      @keyframes float-2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(15px, 25px) scale(1.08); }
        50% { transform: translate(-20px, -10px) scale(0.92); }
        75% { transform: translate(35px, -20px) scale(1.03); }
      }
      @keyframes float-3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-30px, -15px) scale(1.06); }
        50% { transform: translate(20px, 25px) scale(0.94); }
        75% { transform: translate(-5px, 15px) scale(1.02); }
      }
      @keyframes float-4 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(25px, -20px) scale(0.98); }
        50% { transform: translate(-30px, 30px) scale(1.12); }
        75% { transform: translate(10px, -35px) scale(1.04); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      orbs.forEach(orb => orb.remove());
      style.remove();
    };
  }, []);

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 60% 20%, rgba(79, 70, 229, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 30% 80%, rgba(34, 211, 238, 0.08) 0%, transparent 50%)
        `,
      }}
      aria-hidden="true"
    />
  );
}

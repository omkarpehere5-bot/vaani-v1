import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface PerformanceMetrics {
  isLowEndDevice: boolean;
  shouldReduceMotion: boolean;
  shouldDisableLazyLoad: boolean;
  fps: number;
}

/**
 * Hook to detect device performance and adjust animations accordingly
 * Automatically disables heavy animations on low-end devices
 */
export function usePerformanceOptimization(): PerformanceMetrics {
  const { updateTheme } = useTheme();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isLowEndDevice: false,
    shouldReduceMotion: false,
    shouldDisableLazyLoad: false,
    fps: 60,
  });

  const fpsRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setMetrics(prev => ({
        ...prev,
        shouldReduceMotion: true,
      }));
      updateTheme({ enableAnimations: false });
    }
  }, [updateTheme]);

  // Monitor FPS and device performance
  useEffect(() => {
    let animationFrameId: number;

    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // Update FPS every 500ms
      if (delta >= 500) {
        const fps = Math.round(frameCountRef.current / (delta / 1000));
        fpsRef.current = fps;

        // If FPS is too low, disable animations
        if (fps < 30) {
          setMetrics(prev => ({
            ...prev,
            isLowEndDevice: true,
            shouldReduceMotion: true,
            fps,
          }));
          updateTheme({ enableAnimations: false, enableGlow: false });
        }

        lastTimeRef.current = now;
        frameCountRef.current = 0;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Start FPS monitoring
    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateTheme]);

  // Check device capabilities
  useEffect(() => {
    // Check available memory (if supported)
    const checkDeviceMemory = async () => {
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        if (memory && memory < 4) {
          setMetrics(prev => ({
            ...prev,
            isLowEndDevice: true,
          }));
          updateTheme({ enableAnimations: false, enableGlow: false });
        }
      }

      // Check effective connection type
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection && connection.effectiveType === '4g') {
          // Slow connection, consider optimizing
        }
      }
    };

    checkDeviceMemory();
  }, [updateTheme]);

  return metrics;
}

/**
 * Hook to lazy load components
 * Useful for loading heavy components only when needed
 */
export function useLazyLoad(callback: () => void, deps: any[] = []) {
  const { theme } = useTheme();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If animations are disabled (low-end device), load immediately
    if (!theme.enableAnimations) {
      callback();
      return;
    }

    // Otherwise use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [...deps, theme.enableAnimations]);
}

/**
 * Hook to memoize motion variants based on device performance
 * Returns simplified variants for low-end devices
 */
export function useMotionVariants(
  fullVariants: any,
  simplifiedVariants?: any
) {
  const { enableAnimations } = useTheme().theme;

  if (!enableAnimations && simplifiedVariants) {
    return simplifiedVariants;
  }

  return fullVariants;
}

/**
 * Hook to safely use animations with fallback
 * Returns animation config that's safe for all devices
 */
export function useAdaptiveAnimation(
  animationConfig: any,
  duration: number = 0.3
) {
  const { enableAnimations } = useTheme().theme;

  if (!enableAnimations) {
    return {
      ...animationConfig,
      duration: 0,
      transition: { duration: 0 },
    };
  }

  return animationConfig;
}

/**
 * Hook to debounce heavy operations
 * Useful for preventing performance issues from rapid interactions
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to throttle function calls
 * Useful for expensive operations that shouldn't run too frequently
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef(0);
  const lastValueRef = useRef<any>();

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        lastValueRef.current = callback(...args);
      }

      return lastValueRef.current;
    },
    [callback, delay]
  ) as T;
}

/**
 * Hook to memoize expensive computations
 * Useful for complex calculations that shouldn't be recalculated every render
 */
export function useMemoComputation<T>(
  computeFn: () => T,
  deps: any[]
): T {
  const memoRef = useRef<T | undefined>();
  const depsRef = useRef<any[]>(deps);

  const hasDepsChanged = (newDeps: any[]) => {
    if (!depsRef.current || depsRef.current.length !== newDeps.length) {
      return true;
    }

    return !depsRef.current.every((dep, i) => Object.is(dep, newDeps[i]));
  };

  if (hasDepsChanged(deps)) {
    memoRef.current = computeFn();
    depsRef.current = deps;
  }

  return memoRef.current!;
}

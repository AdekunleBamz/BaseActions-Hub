'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface AnimationOptions {
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
  onComplete?: () => void;
}

type AnimationState = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Spring animation hook
 */
export function useSpring(
  target: number,
  config: { stiffness?: number; damping?: number; mass?: number } = {}
) {
  const { stiffness = 100, damping = 10, mass = 1 } = config;
  
  const [value, setValue] = useState(target);
  const velocityRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.064);
      lastTime = currentTime;

      const displacement = value - target;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocityRef.current;
      const acceleration = (springForce + dampingForce) / mass;

      velocityRef.current += acceleration * deltaTime;
      const newValue = value + velocityRef.current * deltaTime;

      if (Math.abs(displacement) < 0.001 && Math.abs(velocityRef.current) < 0.001) {
        setValue(target);
        velocityRef.current = 0;
        return;
      }

      setValue(newValue);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, stiffness, damping, mass, value]);

  return value;
}

/**
 * Number animation hook
 */
export function useAnimatedNumber(
  end: number,
  options: AnimationOptions = {}
) {
  const { duration = 1000, easing = 'ease-out', delay = 0, onComplete } = options;

  const [value, setValue] = useState(0);
  const [state, setState] = useState<AnimationState>('idle');
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const frameRef = useRef<number>();

  const easingFunctions: Record<string, (t: number) => number> = {
    linear: (t) => t,
    ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'ease-in': (t) => t * t,
    'ease-out': (t) => t * (2 - t),
    'ease-in-out': (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  };

  const start = useCallback(() => {
    startValueRef.current = value;
    startTimeRef.current = null;
    setState('running');

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;
      
      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);
      const newValue = startValueRef.current + (end - startValueRef.current) * easedProgress;
      
      setValue(newValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setState('completed');
        onComplete?.();
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [value, end, duration, easing, delay, onComplete]);

  const reset = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    setValue(0);
    setState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { value, state, start, reset };
}

/**
 * Staggered animation hook for lists
 */
export function useStaggeredAnimation(
  itemCount: number,
  options: { delayPerItem?: number; initialDelay?: number } = {}
) {
  const { delayPerItem = 50, initialDelay = 0 } = options;
  
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(() => {
    setVisibleItems(new Set());
    setIsComplete(false);

    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, i]));
        if (i === itemCount - 1) {
          setIsComplete(true);
        }
      }, initialDelay + i * delayPerItem);
    }
  }, [itemCount, delayPerItem, initialDelay]);

  const isVisible = useCallback(
    (index: number) => visibleItems.has(index),
    [visibleItems]
  );

  const getDelay = useCallback(
    (index: number) => initialDelay + index * delayPerItem,
    [initialDelay, delayPerItem]
  );

  return { start, isVisible, isComplete, getDelay };
}

/**
 * CSS animation class toggle hook
 */
export function useAnimationClass(
  baseClass: string,
  animateClass: string,
  options: { duration?: number; autoTrigger?: boolean } = {}
) {
  const { duration = 300, autoTrigger = false } = options;
  
  const [isAnimating, setIsAnimating] = useState(autoTrigger);

  const trigger = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }, [duration]);

  const className = isAnimating ? `${baseClass} ${animateClass}` : baseClass;

  return { className, trigger, isAnimating };
}

export { useSpring as default };

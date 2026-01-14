// Animation utility functions and keyframe helpers

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  scaleInBounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
  },
  slideInFromTop: {
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-100%" },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  },
} as const;

export type AnimationPreset = keyof typeof ANIMATION_PRESETS;

// CSS keyframe animation strings
export const CSS_ANIMATIONS = {
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  spin: "spin 1s linear infinite",
  bounce: "bounce 1s infinite",
  float: "float 3s ease-in-out infinite",
  glow: "glow 2s ease-in-out infinite",
  shimmer: "shimmer 2s linear infinite",
  shake: "shake 0.5s ease-in-out",
  wiggle: "wiggle 1s ease-in-out infinite",
  heartbeat: "heartbeat 1.5s ease-in-out infinite",
};

// Keyframe definitions for CSS
export const CSS_KEYFRAMES = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}
`;

// Stagger animation helper for lists
export function getStaggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}

// Create stagger animation props
export function createStaggerAnimation(
  index: number,
  baseDelay = 0.1,
  preset: AnimationPreset = "fadeInUp"
) {
  return {
    ...ANIMATION_PRESETS[preset],
    transition: { delay: getStaggerDelay(index, baseDelay) },
  };
}

// Duration presets
export const DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
} as const;

// Easing presets
export const EASINGS = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const;

// Transition helper
export function createTransition(
  property: string | string[] = "all",
  duration: keyof typeof DURATIONS | number = "normal",
  easing: keyof typeof EASINGS = "easeInOut"
): string {
  const props = Array.isArray(property) ? property : [property];
  const dur = typeof duration === "number" ? duration : DURATIONS[duration];
  const ease = EASINGS[easing];

  return props.map((p) => `${p} ${dur}ms ${ease}`).join(", ");
}

// Animation state types
export type AnimationState = "idle" | "entering" | "entered" | "exiting" | "exited";

// Reduced motion check
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Get animation with reduced motion fallback
export function getAccessibleAnimation<T>(
  animation: T,
  reducedMotionFallback: Partial<T> = {}
): T | Partial<T> {
  if (prefersReducedMotion()) {
    return { ...animation, ...reducedMotionFallback };
  }
  return animation;
}

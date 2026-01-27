'use client';

import React, { useState, useEffect, useRef } from 'react';

// Fade In Animation
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  className = '',
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translate3d(0, 20px, 0)';
      case 'down': return 'translate3d(0, -20px, 0)';
      case 'left': return 'translate3d(20px, 0, 0)';
      case 'right': return 'translate3d(-20px, 0, 0)';
      default: return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Scale In Animation
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, duration = 400, className = '' }: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Stagger Children Animation
interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, staggerDelay = 100, className = '' }: StaggerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>{child}</FadeIn>
      ))}
    </div>
  );
}

// Slide In Animation
interface SlideInProps {
  children: React.ReactNode;
  direction: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction,
  delay = 0,
  duration = 500,
  className = '',
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-100%)';
      case 'right': return 'translateX(100%)';
      case 'top': return 'translateY(-100%)';
      case 'bottom': return 'translateY(100%)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: isVisible ? 'translateX(0) translateY(0)' : getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Pulse Animation
interface PulseProps {
  children: React.ReactNode;
  className?: string;
}

export function Pulse({ children, className = '' }: PulseProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
}

// Spin Animation
interface SpinProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export function Spin({ children, duration = 1000, className = '' }: SpinProps) {
  return (
    <div
      className={className}
      style={{
        animation: `spin ${duration}ms linear infinite`,
      }}
    >
      {children}
    </div>
  );
}

// Bounce Animation
interface BounceProps {
  children: React.ReactNode;
  className?: string;
}

export function Bounce({ children, className = '' }: BounceProps) {
  return (
    <div className={`animate-bounce ${className}`}>
      {children}
    </div>
  );
}

// Float Animation
interface FloatProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function Float({ children, duration = 3000, distance = 10, className = '' }: FloatProps) {
  return (
    <div
      className={className}
      style={{
        animation: `float ${duration}ms ease-in-out infinite`,
      }}
    >
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-${distance}px); }
        }
      `}</style>
      {children}
    </div>
  );
}

// Shimmer Effect
interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Shimmer({ className = '', width = '100%', height = '20px' }: ShimmerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-gray-800 ${className}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          animation: 'shimmer 2s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Typewriter Effect
interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, delay = 50, className = '', onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Counter Animation
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function Counter({
  from = 0,
  to,
  duration = 2000,
  className = '',
  formatter = (v) => v.toLocaleString(),
}: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            setCount(Math.floor(from + (to - from) * eased));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {formatter(count)}
    </span>
  );
}

// Reveal on Scroll
interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

export function Reveal({ children, className = '' }: RevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        className="absolute inset-0 bg-blue-500"
        style={{
          transform: isRevealed ? 'scaleX(0)' : 'scaleX(1)',
          transformOrigin: 'right',
          transition: 'transform 0.6s ease-out',
        }}
      />
      <div
        style={{
          opacity: isRevealed ? 1 : 0,
          transition: 'opacity 0.3s ease-out 0.3s',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Parallax Effect
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        const elementTop = rect.top + scrolled;
        const relativeScroll = scrolled - elementTop + window.innerHeight;
        setOffset(relativeScroll * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div style={{ transform: `translateY(${offset}px)` }}>{children}</div>
    </div>
  );
}

// Glow Effect
interface GlowProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  className?: string;
}

export function Glow({ children, color = '#3b82f6', size = 20, className = '' }: GlowProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        filter: `drop-shadow(0 0 ${size}px ${color})`,
      }}
    >
      {children}
    </div>
  );
}

// Morphing Background
interface MorphBgProps {
  colors?: string[];
  duration?: number;
  className?: string;
}

export function MorphBg({
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  duration = 10000,
  className = '',
}: MorphBgProps) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        animation: `morphBg ${duration}ms ease infinite`,
      }}
    >
      <style jsx>{`
        @keyframes morphBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

// Ripple Effect
interface RippleProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Ripple({ children, color = 'rgba(255, 255, 255, 0.3)', className = '' }: RippleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const addRipple = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onClick={addRipple}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            backgroundColor: color,
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(40);
            opacity: 0;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

export default {
  FadeIn,
  ScaleIn,
  Stagger,
  SlideIn,
  Pulse,
  Spin,
  Bounce,
  Float,
  Shimmer,
  Typewriter,
  Counter,
  Reveal,
  Parallax,
  Glow,
  MorphBg,
  Ripple,
};

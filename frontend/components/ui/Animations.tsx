"use client";

import { useEffect, useState, useRef } from "react";

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down";
  className?: string;
}

/**
 * ParallaxContainer - Simple parallax scroll effect
 */
export function ParallaxContainer({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
}: ParallaxContainerProps) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollY = -rect.top;
        const multiplier = direction === "up" ? -1 : 1;
        setOffset(scrollY * speed * multiplier);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translateY(${offset}px)`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * MouseParallax - Parallax based on mouse movement
 */
interface MouseParallaxProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MouseParallax({
  children,
  strength = 20,
  className = "",
}: MouseParallaxProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = ((e.clientX - centerX) / rect.width) * strength;
        const y = ((e.clientY - centerY) / rect.height) * strength;
        
        setPosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength]);

  return (
    <div ref={containerRef} className={className}>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * FadeIn - Fade in animation on scroll
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  distance = 30,
  className = "",
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

  const getInitialTransform = () => {
    switch (direction) {
      case "up": return `translateY(${distance}px)`;
      case "down": return `translateY(-${distance}px)`;
      case "left": return `translateX(${distance}px)`;
      case "right": return `translateX(-${distance}px)`;
      default: return "none";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getInitialTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * SlideIn - Slide in animation
 */
interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  duration = 500,
  className = "",
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
      case "left": return "translateX(-100%)";
      case "right": return "translateX(100%)";
      case "up": return "translateY(-100%)";
      case "down": return "translateY(100%)";
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={ref}
        style={{
          transform: isVisible ? "none" : getTransform(),
          transition: `transform ${duration}ms ease-out ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * ScaleIn - Scale in animation
 */
interface ScaleInProps {
  children: React.ReactNode;
  initialScale?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({
  children,
  initialScale = 0.9,
  delay = 0,
  duration = 400,
  className = "",
}: ScaleInProps) {
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
        transform: isVisible ? "scale(1)" : `scale(${initialScale})`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stagger - Stagger children animations
 */
interface StaggerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, staggerDelay = 100, className = "" }: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

/**
 * Pulse animation component
 */
interface PulseProps {
  children: React.ReactNode;
  duration?: number;
  scale?: number;
  className?: string;
}

export function Pulse({ children, duration = 2, scale = 1.05, className = "" }: PulseProps) {
  return (
    <div
      className={className}
      style={{
        animation: `pulse-custom ${duration}s ease-in-out infinite`,
      }}
    >
      <style jsx>{`
        @keyframes pulse-custom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${scale}); }
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * FloatingAnimation - Gentle floating effect
 */
interface FloatingProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export function Floating({ children, amplitude = 10, duration = 3, className = "" }: FloatingProps) {
  return (
    <div
      className={className}
      style={{
        animation: `floating ${duration}s ease-in-out infinite`,
      }}
    >
      <style jsx>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${amplitude}px); }
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * TypeWriter - Typewriter text effect
 */
interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  className?: string;
}

export function TypeWriter({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  className = "",
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span className={`${isTyping ? "animate-pulse" : ""}`}>|</span>
      )}
    </span>
  );
}

/**
 * CountUp animation
 */
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime: number;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(start + (end - start) * eased);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  );
}

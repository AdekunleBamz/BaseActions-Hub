'use client';

import React, { useState, useEffect } from 'react';

// Bottom Sheet (Mobile)
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
}: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const heightClasses = {
    auto: 'max-h-[90vh]',
    half: 'h-1/2',
    full: 'h-[90vh]',
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-gray-900 rounded-t-3xl transition-transform duration-300 ${
          heightClasses[height]
        } ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}

// Pull to Refresh
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function PullToRefresh({ children, onRefresh, className = '' }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      const startY = e.touches[0].clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const distance = Math.max(0, currentY - startY);
        setPullDistance(Math.min(distance, threshold * 1.5));
      };

      const handleTouchEnd = async () => {
        if (pullDistance >= threshold && !isRefreshing) {
          setIsRefreshing(true);
          await onRefresh();
          setIsRefreshing(false);
        }
        setPullDistance(0);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  return (
    <div className={`relative ${className}`} onTouchStart={handleTouchStart}>
      {/* Pull indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 transition-opacity"
        style={{
          top: pullDistance / 3,
          opacity: pullDistance / threshold,
        }}
      >
        <div
          className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={{
            transform: `rotate(${pullDistance * 2}deg)`,
          }}
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance / 2}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Swipe Actions
interface SwipeActionsProps {
  children: React.ReactNode;
  leftAction?: {
    label: string;
    icon?: React.ReactNode;
    color: string;
    onAction: () => void;
  };
  rightAction?: {
    label: string;
    icon?: React.ReactNode;
    color: string;
    onAction: () => void;
  };
}

export function SwipeActions({ children, leftAction, rightAction }: SwipeActionsProps) {
  const [offset, setOffset] = useState(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      let newOffset = currentX - startX;

      if (!rightAction && newOffset < 0) newOffset = 0;
      if (!leftAction && newOffset > 0) newOffset = 0;

      setOffset(Math.max(-threshold * 1.5, Math.min(threshold * 1.5, newOffset)));
    };

    const handleTouchEnd = () => {
      if (offset >= threshold && leftAction) {
        leftAction.onAction();
      } else if (offset <= -threshold && rightAction) {
        rightAction.onAction();
      }
      setOffset(0);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action */}
      {leftAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-center px-4"
          style={{
            backgroundColor: leftAction.color,
            width: Math.abs(offset),
            opacity: offset > 0 ? 1 : 0,
          }}
        >
          {leftAction.icon || <span className="text-white font-medium">{leftAction.label}</span>}
        </div>
      )}

      {/* Right action */}
      {rightAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-center px-4"
          style={{
            backgroundColor: rightAction.color,
            width: Math.abs(offset),
            opacity: offset < 0 ? 1 : 0,
          }}
        >
          {rightAction.icon || <span className="text-white font-medium">{rightAction.label}</span>}
        </div>
      )}

      {/* Content */}
      <div
        onTouchStart={handleTouchStart}
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? 'transform 0.3s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Floating Action Button
interface FABProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  extended?: boolean;
}

export function FAB({
  icon,
  onClick,
  label,
  position = 'bottom-right',
  extended = false,
}: FABProps) {
  const positions = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positions[position]} z-30 ${
        extended ? 'px-6' : 'w-14'
      } h-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-white transition-all active:scale-95`}
    >
      {icon}
      {extended && label && <span className="font-medium">{label}</span>}
    </button>
  );
}

// Touch Feedback
interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export function TouchFeedback({ children, className = '', onPress }: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`transition-transform duration-100 ${
        isPressed ? 'scale-95 opacity-70' : ''
      } ${className}`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        onPress?.();
      }}
      onTouchCancel={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}

// Haptic Button (visual feedback only - actual haptic requires native API)
interface HapticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'danger';
  className?: string;
}

export function HapticButton({
  children,
  onClick,
  variant = 'default',
  className = '',
}: HapticButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    default: 'bg-gray-800 text-white',
    primary: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
  };

  return (
    <button
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-100 ${
        variants[variant]
      } ${isPressed ? 'scale-95' : 'hover:scale-105'} ${className}`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Mobile Navigation (Gesture-based)
interface GestureNavProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  children: React.ReactNode;
  threshold?: number;
}

export function GestureNav({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  children,
  threshold = 50,
}: GestureNavProps) {
  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold && onSwipeRight) onSwipeRight();
        if (deltaX < -threshold && onSwipeLeft) onSwipeLeft();
      } else {
        if (deltaY > threshold && onSwipeDown) onSwipeDown();
        if (deltaY < -threshold && onSwipeUp) onSwipeUp();
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div onTouchStart={handleTouchStart}>
      {children}
    </div>
  );
}

// Mobile Card Stack
interface CardStackProps {
  cards: React.ReactNode[];
  onSwipe?: (direction: 'left' | 'right', index: number) => void;
}

export function CardStack({ cards, onSwipe }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const threshold = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      setOffset(currentX - startX);
    };

    const handleTouchEnd = () => {
      if (offset > threshold) {
        onSwipe?.('right', currentIndex);
        setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
      } else if (offset < -threshold) {
        onSwipe?.('left', currentIndex);
        setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
      }
      setOffset(0);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="relative h-96">
      {cards.slice(currentIndex, currentIndex + 3).map((card, i) => (
        <div
          key={currentIndex + i}
          className="absolute inset-0 rounded-2xl bg-gray-800"
          style={{
            transform: i === 0
              ? `translateX(${offset}px) rotate(${offset / 20}deg)`
              : `scale(${1 - i * 0.05}) translateY(${i * 10}px)`,
            zIndex: 3 - i,
            opacity: 1 - i * 0.2,
            transition: i === 0 && offset === 0 ? 'transform 0.3s' : 'none',
          }}
          onTouchStart={i === 0 ? handleTouchStart : undefined}
        >
          {card}
        </div>
      ))}
    </div>
  );
}

// Safe Area Wrapper
interface SafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function SafeArea({ children, className = '' }: SafeAreaProps) {
  return (
    <div
      className={className}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {children}
    </div>
  );
}

export default {
  BottomSheet,
  PullToRefresh,
  SwipeActions,
  FAB,
  TouchFeedback,
  HapticButton,
  GestureNav,
  CardStack,
  SafeArea,
};

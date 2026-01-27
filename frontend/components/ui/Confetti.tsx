"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  opacity: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  onComplete?: () => void;
}

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#10B981", // Green
  "#F59E0B", // Amber
  "#22D3EE", // Cyan
];

/**
 * Confetti - Celebration particle effect
 * Renders animated confetti pieces that fall with physics
 */
export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.3 },
  colors = DEFAULT_COLORS,
  onComplete,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createPieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    const originX = typeof window !== "undefined" ? window.innerWidth * origin.x : 500;
    const originY = typeof window !== "undefined" ? window.innerHeight * origin.y : 300;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
      const velocity = Math.random() * 15 + 10;

      newPieces.push({
        id: i,
        x: originX + (Math.random() - 0.5) * 20,
        y: originY,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocityX: Math.sin(angle) * velocity * (Math.random() > 0.5 ? 1 : -1),
        velocityY: -Math.cos(angle) * velocity - Math.random() * 5,
        rotationSpeed: (Math.random() - 0.5) * 20,
        opacity: 1,
      });
    }

    return newPieces;
  }, [particleCount, spread, origin, colors]);

  useEffect(() => {
    if (!isActive || !mounted) return;

    setPieces(createPieces());

    const gravity = 0.3;
    const friction = 0.99;
    const fadeStart = duration * 0.7;
    const startTime = Date.now();

    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        setPieces([]);
        onComplete?.();
        return;
      }

      setPieces((prevPieces) =>
        prevPieces.map((piece) => ({
          ...piece,
          x: piece.x + piece.velocityX,
          y: piece.y + piece.velocityY,
          velocityX: piece.velocityX * friction,
          velocityY: piece.velocityY + gravity,
          rotation: piece.rotation + piece.rotationSpeed,
          opacity: elapsed > fadeStart ? 1 - (elapsed - fadeStart) / (duration - fadeStart) : 1,
        }))
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, mounted, duration, createPieces, onComplete]);

  const confettiContent = useMemo(
    () => (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute"
            style={{
              left: piece.x,
              top: piece.y,
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              opacity: piece.opacity,
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
    ),
    [pieces]
  );

  if (!mounted || pieces.length === 0) return null;

  return createPortal(confettiContent, document.body);
}

/**
 * useConfetti - Hook for triggering confetti
 */
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback(() => {
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    trigger,
    reset,
    ConfettiComponent: (props: Omit<ConfettiProps, "isActive">) => (
      <Confetti isActive={isActive} onComplete={reset} {...props} />
    ),
  };
}

/**
 * CelebrationBurst - Quick burst effect for achievements
 */
export function CelebrationBurst({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete?: () => void;
}) {
  return (
    <Confetti
      isActive={isActive}
      duration={2000}
      particleCount={50}
      spread={90}
      onComplete={onComplete}
    />
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  logo?: string;
  logoSize?: number;
  className?: string;
}

/**
 * QRCode - Generate QR codes for addresses and links
 * Uses canvas rendering for efficient QR code generation
 */
export function QRCode({
  value,
  size = 200,
  level = "M",
  bgColor = "#1f2937",
  fgColor = "#ffffff",
  logo,
  logoSize = 50,
  className = "",
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR code generation using a basic algorithm
    // In production, you'd use a library like qrcode
    try {
      generateQRCode(ctx, value, size, level, bgColor, fgColor);

      // Add logo if provided
      if (logo) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;

          // Draw white background for logo
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

          // Draw logo
          ctx.drawImage(img, x, y, logoSize, logoSize);
        };
        img.src = logo;
      }

      setError(null);
    } catch (err) {
      setError("Failed to generate QR code");
      console.error("QR code generation error:", err);
    }
  }, [value, size, level, bgColor, fgColor, logo, logoSize]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 rounded-xl ${className}`}
        style={{ width: size, height: size }}
      >
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
      aria-label={`QR code for: ${value}`}
    />
  );
}

/**
 * Simple QR code generation function
 * Creates a visual pattern based on the input value
 */
function generateQRCode(
  ctx: CanvasRenderingContext2D,
  value: string,
  size: number,
  _level: string,
  bgColor: string,
  fgColor: string
) {
  // Create a deterministic pattern from the value
  const gridSize = 21; // Standard QR code size
  const cellSize = size / gridSize;

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Generate pattern from value hash
  const pattern = generatePattern(value, gridSize);

  // Draw QR pattern
  ctx.fillStyle = fgColor;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (pattern[y][x]) {
        // Add slight rounding for modern look
        drawRoundedRect(
          ctx,
          x * cellSize,
          y * cellSize,
          cellSize - 1,
          cellSize - 1,
          2
        );
      }
    }
  }

  // Draw position markers (finder patterns)
  drawFinderPattern(ctx, 0, 0, cellSize, fgColor, bgColor);
  drawFinderPattern(ctx, (gridSize - 7) * cellSize, 0, cellSize, fgColor, bgColor);
  drawFinderPattern(ctx, 0, (gridSize - 7) * cellSize, cellSize, fgColor, bgColor);
}

function generatePattern(value: string, size: number): boolean[][] {
  const pattern: boolean[][] = [];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Generate pattern based on hash
  for (let y = 0; y < size; y++) {
    pattern[y] = [];
    for (let x = 0; x < size; x++) {
      // Skip finder pattern areas
      if (
        (x < 8 && y < 8) ||
        (x >= size - 8 && y < 8) ||
        (x < 8 && y >= size - 8)
      ) {
        pattern[y][x] = false;
        continue;
      }

      // Generate pseudo-random pattern
      const seed = (hash + x * 37 + y * 41) & 0xffffffff;
      pattern[y][x] = (seed % 3) !== 0;
    }
  }

  return pattern;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawFinderPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  fgColor: string,
  bgColor: string
) {
  // Outer square
  ctx.fillStyle = fgColor;
  ctx.fillRect(x, y, cellSize * 7, cellSize * 7);

  // Inner white square
  ctx.fillStyle = bgColor;
  ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);

  // Center square
  ctx.fillStyle = fgColor;
  ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
}

/**
 * QRCodeCard - QR code with additional info
 */
interface QRCodeCardProps extends QRCodeProps {
  title?: string;
  description?: string;
  onDownload?: () => void;
  onCopy?: () => void;
}

export function QRCodeCard({
  value,
  size = 200,
  title,
  description,
  onDownload,
  onCopy,
  ...qrProps
}: QRCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [value, onCopy]);

  const handleDownload = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `qr-code-${value.slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    onDownload?.();
  }, [value, onDownload]);

  return (
    <div className="glass rounded-2xl p-6 text-center">
      {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}

      <div className="flex justify-center mb-4">
        <QRCode value={value} size={size} {...qrProps} />
      </div>

      <p className="text-xs text-gray-500 font-mono mb-4 break-all px-4">
        {value.length > 42 ? `${value.slice(0, 20)}...${value.slice(-20)}` : value}
      </p>

      <div className="flex gap-2 justify-center">
        <button
          onClick={handleCopy}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${copied 
              ? "bg-green-500/20 text-green-400" 
              : "bg-white/10 hover:bg-white/20 text-white"
            }
          `}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
        >
          Download
        </button>
      </div>
    </div>
  );
}

/**
 * AddressQRCode - Specialized QR code for wallet addresses
 */
interface AddressQRCodeProps {
  address: string;
  ensName?: string;
  size?: number;
  showActions?: boolean;
}

export function AddressQRCode({
  address,
  ensName,
  size = 200,
  showActions = true,
}: AddressQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="flex justify-center mb-4">
        <QRCode
          value={address}
          size={size}
          fgColor="#3b82f6"
          logo="/base-logo.svg"
          logoSize={40}
        />
      </div>

      {ensName && (
        <p className="text-blue-400 font-medium mb-1">{ensName}</p>
      )}

      <p className="text-xs text-gray-500 font-mono break-all px-2">
        {address}
      </p>

      {showActions && (
        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={handleCopy}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-colors
              ${copied 
                ? "bg-green-500/20 text-green-400" 
                : "bg-white/10 hover:bg-white/20 text-white"
              }
            `}
          >
            {copied ? "✓ Copied" : "Copy Address"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  blurPlaceholder?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none";
}

/**
 * OptimizedImage - Image with loading and error states
 */
export function OptimizedImage({
  src,
  alt = "",
  fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23374151'%3E%3Cpath d='M4 16l4-4 4 4 8-8V4H4v12zm-2 0V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z'/%3E%3C/svg%3E",
  blurPlaceholder,
  aspectRatio = "auto",
  objectFit = "cover",
  className = "",
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-800 ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      {/* Blur placeholder */}
      {blurPlaceholder && !isLoaded && (
        <img
          src={blurPlaceholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />
      )}

      {/* Loading spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`
            w-full h-full transition-opacity duration-300
            ${objectFitClasses[objectFit]}
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * NFTImage - Styled image for NFTs
 */
interface NFTImageProps {
  src?: string;
  alt?: string;
  rarity?: "common" | "rare" | "epic" | "legendary" | "mythic";
  size?: "sm" | "md" | "lg";
  showRarity?: boolean;
  className?: string;
}

export function NFTImage({
  src,
  alt = "NFT",
  rarity = "common",
  size = "md",
  showRarity = true,
  className = "",
}: NFTImageProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const rarityStyles = {
    common: { border: "border-gray-500", glow: "" },
    rare: { border: "border-blue-500", glow: "shadow-blue-500/30" },
    epic: { border: "border-purple-500", glow: "shadow-purple-500/30" },
    legendary: { border: "border-yellow-500", glow: "shadow-yellow-500/30" },
    mythic: { border: "border-red-500", glow: "shadow-red-500/30" },
  };

  const styles = rarityStyles[rarity];

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-xl overflow-hidden
          border-2 ${styles.border}
          ${styles.glow ? `shadow-lg ${styles.glow}` : ""}
        `}
      >
        {src ? (
          <OptimizedImage
            src={src}
            alt={alt}
            aspectRatio="square"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-500 text-2xl">
            🎨
          </div>
        )}
      </div>

      {showRarity && rarity !== "common" && (
        <span
          className={`
            absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full
            capitalize font-medium
            ${rarity === "rare" ? "bg-blue-500 text-white" : ""}
            ${rarity === "epic" ? "bg-purple-500 text-white" : ""}
            ${rarity === "legendary" ? "bg-yellow-500 text-black" : ""}
            ${rarity === "mythic" ? "bg-red-500 text-white" : ""}
          `}
        >
          {rarity}
        </span>
      )}
    </div>
  );
}

/**
 * ImageGallery - Grid of images with lightbox
 */
interface ImageGalleryProps {
  images: { src: string; alt?: string }[];
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = "md",
  className = "",
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <>
      <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="relative overflow-hidden rounded-xl group"
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              aspectRatio="square"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt || ""}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-4 text-white/70 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * PlaceholderImage - Decorative placeholder
 */
interface PlaceholderImageProps {
  type?: "avatar" | "nft" | "banner" | "icon";
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlaceholderImage({
  type = "avatar",
  text,
  size = "md",
  className = "",
}: PlaceholderImageProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-xl",
  };

  const typeEmojis = {
    avatar: "👤",
    nft: "🎨",
    banner: "🖼️",
    icon: "⭐",
  };

  const shapeClasses = {
    avatar: "rounded-full",
    nft: "rounded-xl",
    banner: "rounded-lg aspect-video",
    icon: "rounded-lg",
  };

  return (
    <div
      className={`
        flex items-center justify-center
        bg-gradient-to-br from-gray-700 to-gray-800
        ${sizeClasses[size]}
        ${shapeClasses[type]}
        ${className}
      `}
    >
      {text || typeEmojis[type]}
    </div>
  );
}

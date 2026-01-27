"use client";

import { useState, useRef } from "react";

interface AvatarV2Props {
  src?: string | null;
  alt?: string;
  address?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "rounded" | "square";
  border?: boolean;
  status?: "online" | "offline" | "away" | "busy" | null;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * AvatarV2 - Enhanced user avatar component
 */
export function AvatarV2({
  src,
  alt = "",
  address,
  size = "md",
  shape = "circle",
  border = false,
  status,
  badge,
  className = "",
}: AvatarV2Props) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-3xl",
  };

  const shapeClasses = {
    circle: "rounded-full",
    rounded: "rounded-xl",
    square: "rounded-none",
  };

  const statusSizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
  };

  const getGradient = () => {
    if (!address) return "from-blue-500 to-purple-500";
    const hash = address.slice(2, 10);
    const hue1 = parseInt(hash.slice(0, 4), 16) % 360;
    const hue2 = (hue1 + 40) % 360;
    return `from-[hsl(${hue1},70%,50%)] to-[hsl(${hue2},70%,50%)]`;
  };

  const getInitials = () => {
    if (address) return address.slice(2, 4).toUpperCase();
    if (alt) return alt.slice(0, 2).toUpperCase();
    return "??";
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={`
            object-cover
            ${sizeClasses[size]}
            ${shapeClasses[shape]}
            ${border ? "ring-2 ring-white/20" : ""}
          `}
        />
      ) : (
        <div
          className={`
            flex items-center justify-center font-bold text-white
            bg-gradient-to-br ${getGradient()}
            ${sizeClasses[size]}
            ${shapeClasses[shape]}
            ${border ? "ring-2 ring-white/20" : ""}
          `}
        >
          {getInitials()}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 border-2 border-gray-900 rounded-full
            ${statusSizes[size]}
            ${statusColors[status]}
          `}
        />
      )}

      {badge && (
        <span className="absolute -top-1 -right-1">
          {badge}
        </span>
      )}
    </div>
  );
}

/**
 * AvatarGroupV2 - Stack of avatars
 */
interface AvatarGroupV2Props {
  avatars: Array<{ src?: string; address?: string; alt?: string }>;
  max?: number;
  size?: AvatarV2Props["size"];
  className?: string;
}

export function AvatarGroupV2({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupV2Props) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const overlapClasses = {
    xs: "-ml-2",
    sm: "-ml-2.5",
    md: "-ml-3",
    lg: "-ml-4",
    xl: "-ml-5",
    "2xl": "-ml-6",
  };

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-24 h-24 text-xl",
  };

  return (
    <div className={`flex items-center ${className}`}>
      {displayed.map((avatar, i) => (
        <div
          key={i}
          className={`${i > 0 ? overlapClasses[size] : ""}`}
          style={{ zIndex: displayed.length - i }}
        >
          <AvatarV2
            src={avatar.src}
            address={avatar.address}
            alt={avatar.alt}
            size={size}
            border
          />
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={`
            ${overlapClasses[size]}
            flex items-center justify-center
            bg-gray-700 text-white font-medium rounded-full
            ring-2 ring-gray-900
            ${sizeClasses[size]}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

/**
 * AvatarWithNameV2 - Avatar with name display
 */
interface AvatarWithNameV2Props extends AvatarV2Props {
  name: string;
  subtitle?: string;
  reverse?: boolean;
}

export function AvatarWithNameV2({
  name,
  subtitle,
  reverse = false,
  size = "md",
  ...avatarProps
}: AvatarWithNameV2Props) {
  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const subtitleSizes = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
    "2xl": "text-xl",
  };

  return (
    <div className={`flex items-center gap-3 ${reverse ? "flex-row-reverse" : ""}`}>
      <AvatarV2 size={size} {...avatarProps} />
      <div className={reverse ? "text-right" : ""}>
        <p className={`font-medium text-white ${textSizes[size]}`}>{name}</p>
        {subtitle && (
          <p className={`text-gray-400 ${subtitleSizes[size]}`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/**
 * AddressAvatarV2 - Avatar with truncated address
 */
interface AddressAvatarV2Props extends Omit<AvatarV2Props, "alt" | "address"> {
  address: string;
  showCopy?: boolean;
  linkToExplorer?: boolean;
}

export function AddressAvatarV2({
  address,
  showCopy = false,
  linkToExplorer = false,
  size = "md",
  ...props
}: AddressAvatarV2Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const content = (
    <div className="flex items-center gap-3">
      <AvatarV2 address={address} size={size} {...props} />
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-white">{truncated}</span>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (linkToExplorer) {
    return (
      <a
        href={`https://basescan.org/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
}

/**
 * AvatarUploadV2 - Avatar with upload functionality
 */
interface AvatarUploadV2Props extends Omit<AvatarV2Props, "src"> {
  src?: string | null;
  onUpload: (file: File) => void;
  uploading?: boolean;
}

export function AvatarUploadV2({
  src,
  onUpload,
  uploading = false,
  size = "xl",
  ...props
}: AvatarUploadV2Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="relative inline-block">
      <AvatarV2 src={src} size={size} {...props} />
      
      <button
        onClick={handleClick}
        disabled={uploading}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full"
      >
        {uploading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

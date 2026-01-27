"use client";

import React, { useState } from "react";

// ============================================================================
// BUTTON V2
// ============================================================================

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "gradient";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonV2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: "default" | "full" | "none";
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40",
  secondary: "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
  outline: "border-2 border-gray-300 hover:border-primary-500 hover:text-primary-500 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:text-primary-400 bg-transparent",
  ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300",
  danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg shadow-red-500/25",
  success: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg shadow-green-500/25",
  gradient: "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-lg shadow-primary-500/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs gap-1",
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
  xl: "px-6 py-3 text-lg gap-2.5",
};

const roundedStyles = {
  default: "rounded-xl",
  full: "rounded-full",
  none: "rounded-none",
};

export function ButtonV2({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = "default",
  disabled,
  className = "",
  children,
  ...props
}: ButtonV2Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

// ============================================================================
// ICON BUTTON V2
// ============================================================================

interface IconButtonV2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: "default" | "full";
  label: string;
}

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-14 h-14",
};

export function IconButtonV2({
  icon,
  variant = "ghost",
  size = "md",
  rounded = "default",
  label,
  className = "",
  ...props
}: IconButtonV2Props) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${iconSizeStyles[size]}
        ${rounded === "full" ? "rounded-full" : "rounded-xl"}
        ${className}
      `}
    >
      {icon}
    </button>
  );
}

// ============================================================================
// BUTTON GROUP
// ============================================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  attached?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function ButtonGroup({
  children,
  attached = false,
  orientation = "horizontal",
  className = "",
}: ButtonGroupProps) {
  if (attached) {
    return (
      <div
        role="group"
        className={`
          inline-flex ${orientation === "vertical" ? "flex-col" : ""}
          [&>button]:rounded-none
          [&>button:first-child]:${orientation === "vertical" ? "rounded-t-xl" : "rounded-l-xl"}
          [&>button:last-child]:${orientation === "vertical" ? "rounded-b-xl" : "rounded-r-xl"}
          [&>button:not(:last-child)]:${orientation === "vertical" ? "border-b-0" : "border-r-0"}
          ${className}
        `}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      role="group"
      className={`
        inline-flex gap-2 ${orientation === "vertical" ? "flex-col" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ============================================================================
// TOGGLE BUTTON
// ============================================================================

interface ToggleButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: "default" | "outline";
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

export function ToggleButton({
  pressed = false,
  onPressedChange,
  variant = "default",
  size = "md",
  children,
  className = "",
}: ToggleButtonProps) {
  const baseStyles = variant === "outline"
    ? "border-2"
    : "";

  const pressedStyles = pressed
    ? "bg-primary-500 text-white border-primary-500"
    : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";

  return (
    <button
      type="button"
      role="switch"
      aria-pressed={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${baseStyles}
        ${pressedStyles}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ============================================================================
// TOGGLE BUTTON GROUP
// ============================================================================

interface ToggleOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ToggleButtonGroupProps {
  options: ToggleOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function ToggleButtonGroup({
  options,
  value,
  onChange,
  multiple = false,
  size = "md",
  fullWidth = false,
  className = "",
}: ToggleButtonGroupProps) {
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div
      role="group"
      className={`
        inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          onClick={() => handleSelect(option.value)}
          className={`
            inline-flex items-center justify-center font-medium rounded-lg
            transition-all duration-200 ease-out gap-1.5
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${fullWidth ? "flex-1" : ""}
            ${sizeStyles[size]}
            ${
              selectedValues.includes(option.value)
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }
          `}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// SPLIT BUTTON
// ============================================================================

interface SplitButtonProps {
  children: React.ReactNode;
  options: { label: string; onClick: () => void }[];
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick: () => void;
  className?: string;
}

export function SplitButton({
  children,
  options,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-flex ${className}`}>
      <ButtonV2
        variant={variant}
        size={size}
        onClick={onClick}
        className="rounded-r-none"
      >
        {children}
      </ButtonV2>
      <ButtonV2
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-l-none border-l border-white/20 px-2"
        aria-label="More options"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </ButtonV2>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CONNECT WALLET BUTTON
// ============================================================================

interface ConnectWalletButtonProps {
  connected?: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect?: () => void;
  loading?: boolean;
  size?: ButtonSize;
  className?: string;
}

export function ConnectWalletButton({
  connected = false,
  address,
  onConnect,
  onDisconnect,
  loading = false,
  size = "md",
  className = "",
}: ConnectWalletButtonProps) {
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  if (connected && address) {
    return (
      <ButtonV2
        variant="secondary"
        size={size}
        onClick={onDisconnect}
        className={className}
        leftIcon={
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
        }
      >
        {shortAddress}
      </ButtonV2>
    );
  }

  return (
    <ButtonV2
      variant="gradient"
      size={size}
      onClick={onConnect}
      loading={loading}
      loadingText="Connecting..."
      className={className}
      leftIcon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      }
    >
      Connect Wallet
    </ButtonV2>
  );
}

// ============================================================================
// SOCIAL BUTTONS
// ============================================================================

type SocialPlatform = "twitter" | "discord" | "telegram" | "farcaster" | "github" | "email";

interface SocialButtonProps {
  platform: SocialPlatform;
  href?: string;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: "filled" | "outline" | "ghost";
  showLabel?: boolean;
  className?: string;
}

const socialConfig: Record<SocialPlatform, { label: string; color: string; icon: React.ReactNode }> = {
  twitter: {
    label: "Twitter",
    color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  discord: {
    label: "Discord",
    color: "bg-[#5865F2] hover:bg-[#4752c4]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  telegram: {
    label: "Telegram",
    color: "bg-[#0088cc] hover:bg-[#006daa]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  farcaster: {
    label: "Farcaster",
    color: "bg-[#8A63D2] hover:bg-[#7250b8]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3v18h18V3H3zm14.25 14.25h-2.5V9.5h-5.5v7.75h-2.5V6.75h10.5v10.5z" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    color: "bg-[#333] hover:bg-[#24292e] dark:bg-[#24292e] dark:hover:bg-[#333]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  email: {
    label: "Email",
    color: "bg-gray-600 hover:bg-gray-700",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
};

export function SocialButton({
  platform,
  href,
  onClick,
  size = "md",
  variant = "filled",
  showLabel = true,
  className = "",
}: SocialButtonProps) {
  const config = socialConfig[platform];

  const buttonStyles =
    variant === "filled"
      ? `${config.color} text-white`
      : variant === "outline"
      ? "border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-300"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";

  const content = (
    <>
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </>
  );

  const commonProps = {
    className: `inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ${buttonStyles} ${sizeStyles[size]} ${className}`,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} {...commonProps}>
      {content}
    </button>
  );
}

export default ButtonV2;

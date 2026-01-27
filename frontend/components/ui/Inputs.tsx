"use client";

import React, { forwardRef, useState, useEffect } from "react";

// ============================================================================
// TEXT INPUT V2
// ============================================================================

interface TextInputV2Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled" | "flushed";
  fullWidth?: boolean;
}

const inputSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
};

export const TextInputV2 = forwardRef<HTMLInputElement, TextInputV2Props>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftElement,
      rightElement,
      leftAddon,
      rightAddon,
      size = "md",
      variant = "outline",
      fullWidth = false,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const variantStyles = {
      outline: `
        border-2 rounded-xl
        ${error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : success
          ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
          : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20"
        }
        bg-white dark:bg-gray-900
      `,
      filled: `
        border-2 border-transparent rounded-xl
        bg-gray-100 dark:bg-gray-800
        focus:bg-white dark:focus:bg-gray-900
        ${error
          ? "focus:border-red-500"
          : success
          ? "focus:border-green-500"
          : "focus:border-primary-500"
        }
      `,
      flushed: `
        border-0 border-b-2 rounded-none px-0
        ${error
          ? "border-red-500"
          : success
          ? "border-green-500"
          : "border-gray-200 dark:border-gray-700 focus:border-primary-500"
        }
        bg-transparent
      `,
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex">
          {leftAddon && (
            <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border-2 border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-gray-500 dark:text-gray-400 text-sm">
              {leftAddon}
            </div>
          )}
          <div className="relative flex-1">
            {leftElement && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {leftElement}
              </div>
            )}
            <input
              ref={ref}
              id={inputId}
              disabled={disabled}
              className={`
                w-full transition-all duration-200
                focus:outline-none focus:ring-4
                disabled:opacity-50 disabled:cursor-not-allowed
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                text-gray-900 dark:text-white
                ${variantStyles[variant]}
                ${inputSizes[size]}
                ${leftElement ? "pl-10" : ""}
                ${rightElement ? "pr-10" : ""}
                ${leftAddon ? "rounded-l-none" : ""}
                ${rightAddon ? "rounded-r-none" : ""}
                ${className}
              `}
              {...props}
            />
            {rightElement && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {rightElement}
              </div>
            )}
          </div>
          {rightAddon && (
            <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 border-2 border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl text-gray-500 dark:text-gray-400 text-sm">
              {rightAddon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={`mt-1.5 text-sm ${
              error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
TextInputV2.displayName = "TextInputV2";

// ============================================================================
// TEXTAREA V2
// ============================================================================

interface TextAreaV2Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
  autoGrow?: boolean;
  maxHeight?: number;
  showCount?: boolean;
  fullWidth?: boolean;
}

export const TextAreaV2 = forwardRef<HTMLTextAreaElement, TextAreaV2Props>(
  (
    {
      label,
      helperText,
      error,
      resize = "vertical",
      autoGrow = false,
      maxHeight = 300,
      showCount = false,
      fullWidth = false,
      maxLength,
      className = "",
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value || "");
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
      if (autoGrow) {
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
      }
      onChange?.(e);
    };

    const charCount = String(internalValue).length;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 text-sm
            border-2 rounded-xl transition-all duration-200
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            text-gray-900 dark:text-white
            bg-white dark:bg-gray-900
            ${error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20"
            }
            ${resize === "none" ? "resize-none" : ""}
            ${resize === "vertical" ? "resize-y" : ""}
            ${resize === "horizontal" ? "resize-x" : ""}
            ${resize === "both" ? "resize" : ""}
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {(error || helperText) && (
            <p className={`text-sm ${error ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
              {error || helperText}
            </p>
          )}
          {showCount && (
            <p className={`text-sm ml-auto ${
              maxLength && charCount >= maxLength ? "text-red-500" : "text-gray-400"
            }`}>
              {charCount}{maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);
TextAreaV2.displayName = "TextAreaV2";

// ============================================================================
// NUMBER INPUT
// ============================================================================

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  showStepper?: boolean;
  step?: number;
  precision?: number;
  fullWidth?: boolean;
}

export function NumberInput({
  label,
  error,
  size = "md",
  showStepper = true,
  step = 1,
  precision = 0,
  fullWidth = false,
  min,
  max,
  value,
  onChange,
  className = "",
  id,
  ...props
}: NumberInputProps) {
  const [internalValue, setInternalValue] = useState<number>(
    typeof value === "string" ? parseFloat(value) || 0 : (value as number) || 0
  );
  const inputId = id || `number-${Math.random().toString(36).substr(2, 9)}`;

  const clamp = (val: number): number => {
    let clamped = val;
    if (min !== undefined) clamped = Math.max(clamped, Number(min));
    if (max !== undefined) clamped = Math.min(clamped, Number(max));
    return Number(clamped.toFixed(precision));
  };

  const handleIncrement = () => {
    const newValue = clamp(internalValue + step);
    setInternalValue(newValue);
  };

  const handleDecrement = () => {
    const newValue = clamp(internalValue - step);
    setInternalValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setInternalValue(clamp(val));
    }
    onChange?.(e);
  };

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative flex">
        {showStepper && (
          <button
            type="button"
            onClick={handleDecrement}
            className="px-3 bg-gray-100 dark:bg-gray-800 border-2 border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        )}
        <input
          type="number"
          id={inputId}
          value={internalValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={`
            flex-1 text-center
            border-2 transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            text-gray-900 dark:text-white
            bg-white dark:bg-gray-900
            border-gray-200 dark:border-gray-700
            ${showStepper ? "rounded-none" : "rounded-xl"}
            ${inputSizes[size]}
            ${className}
          `}
          {...props}
        />
        {showStepper && (
          <button
            type="button"
            onClick={handleIncrement}
            className="px-3 bg-gray-100 dark:bg-gray-800 border-2 border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============================================================================
// PASSWORD INPUT
// ============================================================================

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  fullWidth?: boolean;
}

export function PasswordInput({
  label,
  error,
  showStrength = false,
  fullWidth = false,
  value,
  className = "",
  id,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (showStrength && typeof value === "string") {
      let score = 0;
      if (value.length >= 8) score++;
      if (value.length >= 12) score++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^a-zA-Z0-9]/.test(value)) score++;
      setStrength(Math.min(score, 4));
    }
  }, [value, showStrength]);

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={inputId}
          value={value}
          className={`
            w-full px-4 py-2.5 pr-12 text-sm
            border-2 rounded-xl transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            text-gray-900 dark:text-white
            bg-white dark:bg-gray-900
            ${error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 dark:border-gray-700"
            }
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < strength ? strengthColors[strength - 1] : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Password strength: {strength > 0 ? strengthLabels[strength - 1] : "Too short"}
          </p>
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ============================================================================
// SEARCH INPUT
// ============================================================================

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function SearchInput({
  onSearch,
  onClear,
  loading = false,
  size = "md",
  fullWidth = false,
  value,
  onChange,
  className = "",
  ...props
}: SearchInputProps) {
  const handleClear = () => {
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(String(value || ""));
    }
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {loading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className={`
          w-full pl-10 pr-10
          border-2 border-gray-200 dark:border-gray-700 rounded-xl
          bg-white dark:bg-gray-900
          focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          text-gray-900 dark:text-white
          transition-all duration-200
          ${inputSizes[size]}
          ${className}
        `}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// OTP INPUT
// ============================================================================

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  error = false,
  disabled = false,
  className = "",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split("").slice(0, length));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setOtp(value.split("").slice(0, length));
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange?.(otpString);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.length === length) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newOtp = pastedData.split("");
    while (newOtp.length < length) newOtp.push("");
    setOtp(newOtp);
    onChange?.(newOtp.join(""));
    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-14 text-center text-xl font-bold
            border-2 rounded-xl transition-all duration-200
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            text-gray-900 dark:text-white
            bg-white dark:bg-gray-900
            ${error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20"
            }
          `}
        />
      ))}
    </div>
  );
}

export default TextInputV2;

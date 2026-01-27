"use client";

import { useState, forwardRef } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "ghost";
}

/**
 * Input - Styled input component
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = "md",
      variant = "default",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const sizeClasses = {
      sm: "h-9 text-sm px-3",
      md: "h-11 text-base px-4",
      lg: "h-14 text-lg px-5",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const variantClasses = {
      default: `
        bg-white/5 border border-white/10
        ${error
          ? "border-red-500/50"
          : isFocused
            ? "border-blue-500/50 bg-white/10"
            : "hover:bg-white/[0.07]"
        }
      `,
      filled: `
        bg-gray-800/80 border-none
        ${error
          ? "ring-2 ring-red-500/30"
          : isFocused
            ? "bg-gray-700/80 ring-2 ring-blue-500/30"
            : "hover:bg-gray-800"
        }
      `,
      ghost: `
        bg-transparent border-b border-white/10 rounded-none
        ${error ? "border-red-500" : isFocused ? "border-blue-500" : "hover:border-white/20"}
      `,
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            className={`block ${labelSizes[size]} font-medium text-gray-300 mb-1.5`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full rounded-xl transition-all duration-200
              text-white placeholder-gray-500
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={`mt-1.5 text-sm ${error ? "text-red-400" : "text-gray-500"}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * TextArea - Styled textarea component
 */
interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "ghost";
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      showCount = false,
      maxLength,
      resize = "vertical",
      size = "md",
      variant = "default",
      className = "",
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const charCount = String(value || "").length;

    const sizeClasses = {
      sm: "min-h-[80px] text-sm p-3",
      md: "min-h-[120px] text-base p-4",
      lg: "min-h-[160px] text-lg p-5",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const variantClasses = {
      default: `
        bg-white/5 border border-white/10
        ${error
          ? "border-red-500/50"
          : isFocused
            ? "border-blue-500/50 bg-white/10"
            : "hover:bg-white/[0.07]"
        }
      `,
      filled: `
        bg-gray-800/80 border-none
        ${error
          ? "ring-2 ring-red-500/30"
          : isFocused
            ? "bg-gray-700/80 ring-2 ring-blue-500/30"
            : "hover:bg-gray-800"
        }
      `,
      ghost: `
        bg-transparent border-b border-white/10 rounded-none
        ${error ? "border-red-500" : isFocused ? "border-blue-500" : "hover:border-white/20"}
      `,
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            className={`block ${labelSizes[size]} font-medium text-gray-300 mb-1.5`}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full rounded-xl transition-all duration-200
            text-white placeholder-gray-500
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${resizeClasses[resize]}
          `}
          {...props}
        />

        <div className="flex items-center justify-between mt-1.5">
          <div>
            {(helperText || error) && (
              <p className={`text-sm ${error ? "text-red-400" : "text-gray-500"}`}>
                {error || helperText}
              </p>
            )}
          </div>

          {showCount && maxLength && (
            <p
              className={`text-sm ${
                charCount >= maxLength ? "text-red-400" : "text-gray-500"
              }`}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

/**
 * Select - Styled select component
 */
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder = "Select an option",
      size = "md",
      variant = "default",
      className = "",
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const sizeClasses = {
      sm: "h-9 text-sm px-3 pr-8",
      md: "h-11 text-base px-4 pr-10",
      lg: "h-14 text-lg px-5 pr-12",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const variantClasses = {
      default: `
        bg-white/5 border border-white/10
        ${error
          ? "border-red-500/50"
          : isFocused
            ? "border-blue-500/50 bg-white/10"
            : "hover:bg-white/[0.07]"
        }
      `,
      filled: `
        bg-gray-800/80 border-none
        ${error
          ? "ring-2 ring-red-500/30"
          : isFocused
            ? "bg-gray-700/80 ring-2 ring-blue-500/30"
            : "hover:bg-gray-800"
        }
      `,
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            className={`block ${labelSizes[size]} font-medium text-gray-300 mb-1.5`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            value={value}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full rounded-xl transition-all duration-200
              text-white appearance-none cursor-pointer
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${!value ? "text-gray-500" : ""}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-gray-900 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {(helperText || error) && (
          <p
            className={`mt-1.5 text-sm ${error ? "text-red-400" : "text-gray-500"}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

/**
 * Checkbox - Styled checkbox component
 */
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, size = "md", className = "", disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const labelSizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <label
        className={`flex items-start gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              ${sizeClasses[size]}
              rounded-md border-2 border-white/20
              bg-white/5 transition-all
              peer-checked:bg-blue-500 peer-checked:border-blue-500
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/50
              peer-hover:border-white/30
            `}
          />
          <svg
            className={`
              ${sizeClasses[size]}
              absolute inset-0 p-0.5 text-white
              opacity-0 peer-checked:opacity-100 transition-opacity
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {(label || description) && (
          <div>
            {label && <p className={`font-medium text-white ${labelSizes[size]}`}>{label}</p>}
            {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

/**
 * Radio - Styled radio component
 */
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, size = "md", className = "", disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const innerSizes = {
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    };

    const labelSizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <label
        className={`flex items-start gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              ${sizeClasses[size]}
              rounded-full border-2 border-white/20
              bg-white/5 transition-all
              flex items-center justify-center
              peer-checked:border-blue-500
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/50
              peer-hover:border-white/30
            `}
          >
            <div
              className={`
                ${innerSizes[size]}
                rounded-full bg-blue-500
                scale-0 peer-checked:scale-100 transition-transform
              `}
            />
          </div>
        </div>

        {(label || description) && (
          <div>
            {label && <p className={`font-medium text-white ${labelSizes[size]}`}>{label}</p>}
            {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";

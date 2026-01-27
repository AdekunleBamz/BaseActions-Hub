'use client';

import React, { forwardRef, useState } from 'react';

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-200">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-gray-900/50 border transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error
                ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                : focused
                  ? 'border-blue-500 ring-4 ring-blue-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }
              text-white placeholder-gray-500
              focus:outline-none
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, maxLength, showCount = true, className = '', value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-200">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              w-full px-4 py-3 rounded-xl resize-none
              bg-gray-900/50 border transition-all duration-200
              ${error
                ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                : focused
                  ? 'border-blue-500 ring-4 ring-blue-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }
              text-white placeholder-gray-500
              focus:outline-none
              ${className}
            `}
            {...props}
          />
          {showCount && maxLength && (
            <div className={`absolute bottom-2 right-2 text-xs ${charCount >= maxLength ? 'text-red-400' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-200">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
              bg-gray-900/50 border transition-all duration-200
              ${error
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 hover:border-gray-600 focus:border-blue-500'
              }
              text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox Component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
        <div className="relative mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded-md border-2 border-gray-600 bg-gray-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all peer-focus:ring-4 peer-focus:ring-blue-500/20 group-hover:border-gray-500">
            <svg
              className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <svg
            className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 p-0.5 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-200">{label}</span>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Group Component
interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function RadioGroup({ name, label, options, value, onChange, error }: RadioGroupProps) {
  return (
    <fieldset className="space-y-3">
      {label && (
        <legend className="text-sm font-medium text-gray-200 mb-2">{label}</legend>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all
              ${value === option.value
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
              }
            `}
          >
            <div className="relative mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-full border-2 border-gray-600 peer-checked:border-blue-500 transition-colors">
                <div className={`w-2.5 h-2.5 m-0.5 rounded-full bg-blue-500 transition-transform ${value === option.value ? 'scale-100' : 'scale-0'}`} />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-200">{option.label}</span>
              {option.description && (
                <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </fieldset>
  );
}

// Toggle Switch Component
interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, checked, ...props }, ref) => {
    return (
      <label className="flex items-center justify-between gap-3 cursor-pointer group">
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-200">{label}</span>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div className={`
            w-11 h-6 rounded-full transition-colors
            ${checked ? 'bg-blue-600' : 'bg-gray-700'}
            peer-focus:ring-4 peer-focus:ring-blue-500/20
          `}>
            <div className={`
              w-5 h-5 rounded-full bg-white shadow-md transform transition-transform
              ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}
              mt-0.5
            `} />
          </div>
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

// Form Group (wrapper for form sections)
interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormGroup({ title, description, children }: FormGroupProps) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 space-y-4">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// Label Component
interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}

export function Label({ children, required, htmlFor }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-200 mb-1">
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

export default {
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Toggle,
  FormGroup,
  Label,
};

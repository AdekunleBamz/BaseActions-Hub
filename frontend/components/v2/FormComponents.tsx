'use client';

import React, { useState } from 'react';

// ============================================================================
// FORM COMPONENTS V2
// ============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  charCount = false,
  maxLength,
  className = '',
  value,
  ...props
}: TextareaProps) {
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            ${error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${className}
          `}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        {charCount && maxLength && (
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2.5 rounded-xl border transition-all duration-200
          ${error 
            ? 'border-red-500 focus:ring-red-500/20' 
            : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
          }
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-4
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none cursor-pointer
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
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className={`
            w-5 h-5 rounded border-2 appearance-none cursor-pointer
            border-gray-300 dark:border-gray-600
            checked:bg-blue-600 checked:border-blue-600
            focus:ring-2 focus:ring-blue-500/20
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </label>
  );
}

interface RadioGroupProps {
  label?: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioGroup({ label, options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${value === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </span>
              {option.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, description, checked, onChange, disabled }: ToggleProps) {
  return (
    <label className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
          ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg
            transform transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0.5'}
            mt-0.5
          `}
        />
      </button>
    </label>
  );
}

interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showValue = true,
  formatValue = (v) => String(v),
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
    </div>
  );
}

interface AddressInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function AddressInput({
  label,
  value,
  onChange,
  error,
  placeholder = '0x...',
}: AddressInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateAddress = (addr: string) => {
    if (!addr) return null;
    const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(addr);
    return isValidFormat;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsValid(validateAddress(newValue));
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-xl border font-mono text-sm transition-all duration-200
            ${error || isValid === false
              ? 'border-red-500 focus:ring-red-500/20'
              : isValid
              ? 'border-green-500 focus:ring-green-500/20'
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder:text-gray-400
            focus:outline-none focus:ring-4
          `}
        />
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isValid === true && (
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isValid === false && (
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface AmountInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  symbol?: string;
  maxAmount?: string;
  error?: string;
  placeholder?: string;
}

export function AmountInput({
  label,
  value,
  onChange,
  symbol = 'ETH',
  maxAmount,
  error,
  placeholder = '0.0',
}: AmountInputProps) {
  const handleMax = () => {
    if (maxAmount) {
      onChange(maxAmount);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
          </label>
          {maxAmount && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Max: {maxAmount} {symbol}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, '');
            onChange(val);
          }}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pr-24 rounded-xl border transition-all duration-200
            ${error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white text-lg font-medium
            placeholder:text-gray-400
            focus:outline-none focus:ring-4
          `}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
          {maxAmount && (
            <button
              type="button"
              onClick={handleMax}
              className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              MAX
            </button>
          )}
          <span className="text-gray-500 font-medium">{symbol}</span>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  loading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  onSearch,
  loading = false,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {loading ? (
          <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200
          border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder:text-gray-400
          focus:outline-none focus:ring-4
        "
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default {
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Toggle,
  Slider,
  AddressInput,
  AmountInput,
  SearchInput,
};

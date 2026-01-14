"use client";

import { createContext, useContext, ReactNode } from "react";

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("Radio must be used within a RadioGroup");
  }
  return context;
}

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  children: ReactNode;
  label?: string;
  error?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function RadioGroup({
  value,
  onChange,
  name,
  children,
  label,
  error,
  disabled = false,
  orientation = "vertical",
  className = "",
}: RadioGroupProps) {
  const orientationClasses = {
    horizontal: "flex flex-row gap-6",
    vertical: "flex flex-col gap-3",
  };

  return (
    <RadioGroupContext.Provider value={{ value, onChange, name, disabled }}>
      <div role="radiogroup" aria-labelledby={label ? "radio-group-label" : undefined} className={className}>
        {label && (
          <p id="radio-group-label" className="text-sm font-medium text-gray-300 mb-3">
            {label}
          </p>
        )}
        <div className={orientationClasses[orientation]}>{children}</div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

RadioGroup.Item = function Radio({
  value,
  label,
  description,
  disabled: itemDisabled = false,
  className = "",
}: RadioProps) {
  const { value: groupValue, onChange, name, disabled: groupDisabled } = useRadioGroupContext();
  const isChecked = groupValue === value;
  const isDisabled = itemDisabled || groupDisabled;

  return (
    <label
      className={`
        flex items-start cursor-pointer
        ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
    >
      <div className="flex items-center h-5">
        <div className="relative">
          <input
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            onChange={() => !isDisabled && onChange(value)}
            disabled={isDisabled}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded-full border-2
              transition-all duration-200
              flex items-center justify-center
              ${isChecked
                ? "border-blue-500"
                : "border-gray-500 hover:border-gray-400"
              }
              ${isDisabled ? "" : "focus-within:ring-2 focus-within:ring-blue-500/50"}
            `}
          >
            {isChecked && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            )}
          </div>
        </div>
      </div>
      <div className="ml-3">
        <span className={`text-sm font-medium ${isDisabled ? "text-gray-500" : "text-white"}`}>
          {label}
        </span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
};

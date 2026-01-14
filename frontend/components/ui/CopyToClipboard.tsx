"use client";

import { useState, useCallback, ReactNode } from "react";

interface CopyToClipboardProps {
  text: string;
  children?: ReactNode;
  onCopy?: () => void;
  successMessage?: string;
  timeout?: number;
  className?: string;
}

export function CopyToClipboard({
  text,
  children,
  onCopy,
  successMessage = "Copied!",
  timeout = 2000,
  className = "",
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();

      setTimeout(() => {
        setCopied(false);
      }, timeout);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [text, onCopy, timeout]);

  const defaultButton = (
    <button
      onClick={handleCopy}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${copied
          ? "bg-green-500/20 text-green-400"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
        }
        ${className}
      `}
      aria-label={copied ? successMessage : "Copy to clipboard"}
    >
      {copied ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  );

  if (children) {
    return (
      <div onClick={handleCopy} className={`cursor-pointer ${className}`}>
        {children}
      </div>
    );
  }

  return defaultButton;
}

interface CopyFieldProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyField({ value, label, className = "" }: CopyFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 input-modern">
        <span className="flex-1 truncate text-gray-300 font-mono text-sm">
          {value}
        </span>
        <CopyToClipboard text={value} />
      </div>
    </div>
  );
}

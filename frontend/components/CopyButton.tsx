"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

interface CopyableTextProps {
  text: string;
  displayText?: string;
  className?: string;
}

export function CopyableText({
  text,
  displayText,
  className = "",
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-white transition ${className}`}
    >
      <span className="truncate">{displayText || text}</span>
      <span className="text-xs">{copied ? "✓" : "📋"}</span>
    </button>
  );
}

"use client";

import { formatAddress } from "@/lib/format";

interface AddressDisplayProps {
  address: string;
  showCopy?: boolean;
  className?: string;
}

export function AddressDisplay({ address, showCopy = true, className = "" }: AddressDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full ${className}`}>
      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
      <span className="text-gray-400 font-mono text-sm">{formatAddress(address)}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-white transition"
        >
          📋
        </button>
      )}
    </div>
  );
}

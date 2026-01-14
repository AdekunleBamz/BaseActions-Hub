"use client";

interface TransactionLinkProps {
  hash: string;
  label?: string;
  className?: string;
}

export function TransactionLink({
  hash,
  label = "View on BaseScan",
  className = "",
}: TransactionLinkProps) {
  const explorerUrl = `https://basescan.org/tx/${hash}`;

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1 ${className}`}
    >
      {label}
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

export function AddressLink({
  address,
  label,
  className = "",
}: {
  address: string;
  label?: string;
  className?: string;
}) {
  const explorerUrl = `https://basescan.org/address/${address}`;
  const displayLabel = label || `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1 font-mono ${className}`}
    >
      {displayLabel}
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

"use client";

import { memo } from "react";

type TransactionStage = "idle" | "confirming" | "pending" | "success" | "error";

interface TransactionStatusProps {
  stage: TransactionStage;
  hash?: string;
  error?: string;
  confirmations?: number;
  requiredConfirmations?: number;
  onRetry?: () => void;
  className?: string;
}

const stageConfig = {
  idle: {
    icon: null,
    title: "",
    color: "",
  },
  confirming: {
    icon: "🔐",
    title: "Confirm in Wallet",
    color: "text-yellow-400",
    description: "Please confirm the transaction in your wallet",
  },
  pending: {
    icon: "⏳",
    title: "Transaction Pending",
    color: "text-blue-400",
    description: "Waiting for blockchain confirmation...",
  },
  success: {
    icon: "✅",
    title: "Transaction Successful",
    color: "text-green-400",
    description: "Your transaction has been confirmed",
  },
  error: {
    icon: "❌",
    title: "Transaction Failed",
    color: "text-red-400",
    description: "Something went wrong",
  },
} as const;

export const TransactionStatus = memo(function TransactionStatus({
  stage,
  hash,
  error,
  confirmations = 0,
  requiredConfirmations = 1,
  onRetry,
  className = "",
}: TransactionStatusProps) {
  if (stage === "idle") return null;

  const config = stageConfig[stage];
  const explorerUrl = hash ? `https://basescan.org/tx/${hash}` : null;

  return (
    <div
      className={`rounded-xl border border-white/10 bg-gray-900/50 p-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Animated icon */}
        <div className="relative">
          <span
            className={`text-2xl ${
              stage === "confirming" || stage === "pending"
                ? "animate-pulse"
                : ""
            }`}
            aria-hidden="true"
          >
            {config.icon}
          </span>
          {stage === "pending" && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${config.color}`}>{config.title}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {error || config.description}
          </p>

          {/* Progress for confirmations */}
          {stage === "pending" && requiredConfirmations > 1 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Confirmations</span>
                <span>
                  {confirmations}/{requiredConfirmations}
                </span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${(confirmations / requiredConfirmations) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View on BaseScan
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {stage === "error" && onRetry && (
              <button
                onClick={onRetry}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Compact inline version for use in forms
 */
export const TransactionStatusInline = memo(function TransactionStatusInline({
  stage,
  hash,
}: Pick<TransactionStatusProps, "stage" | "hash">) {
  if (stage === "idle") return null;

  const config = stageConfig[stage];
  const explorerUrl = hash ? `https://basescan.org/tx/${hash}` : null;

  return (
    <div
      className={`flex items-center gap-2 text-sm ${config.color}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={stage === "confirming" || stage === "pending" ? "animate-pulse" : ""}
        aria-hidden="true"
      >
        {config.icon}
      </span>
      <span>{config.title}</span>
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 ml-1"
          aria-label="View transaction on BaseScan"
        >
          ↗
        </a>
      )}
    </div>
  );
});

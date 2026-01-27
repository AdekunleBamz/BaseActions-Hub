"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface TransactionStep {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "active" | "success" | "error";
  txHash?: string;
  error?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: TransactionStep[];
  currentStep: number;
  onRetry?: () => void;
  explorerUrl?: string;
  className?: string;
}

/**
 * TransactionModal - Modal showing transaction progress
 */
export function TransactionModal({
  isOpen,
  onClose,
  title,
  steps,
  currentStep,
  onRetry,
  explorerUrl = "https://basescan.org/tx/",
  className = "",
}: TransactionModalProps) {
  const hasError = steps.some((step) => step.status === "error");
  const isComplete = steps.every((step) => step.status === "success");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!hasError && !isComplete ? undefined : onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-md
          bg-gray-900/95 backdrop-blur-xl
          rounded-2xl border border-white/10
          shadow-2xl overflow-hidden
          ${className}
        `}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step, index) => (
            <TransactionStepItem
              key={step.id}
              step={step}
              index={index}
              currentStep={currentStep}
              explorerUrl={explorerUrl}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          {hasError && onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          )}

          <button
            onClick={onClose}
            className={`
              flex-1 py-2.5 rounded-xl font-medium transition-colors
              ${isComplete
                ? "bg-green-500 text-white hover:bg-green-600"
                : hasError
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-white/5 text-gray-500 cursor-not-allowed"
              }
            `}
            disabled={!isComplete && !hasError}
          >
            {isComplete ? "Done" : hasError ? "Close" : "Processing..."}
          </button>
        </div>
      </div>
    </div>
  );
}

function TransactionStepItem({
  step,
  index,
  currentStep,
  explorerUrl,
}: {
  step: TransactionStep;
  index: number;
  currentStep: number;
  explorerUrl: string;
}) {
  const getStatusIcon = () => {
    switch (step.status) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "active":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">{index + 1}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex items-start gap-3">
      {getStatusIcon()}

      <div className="flex-1 min-w-0">
        <p
          className={`
            font-medium
            ${step.status === "success" ? "text-green-400" : ""}
            ${step.status === "error" ? "text-red-400" : ""}
            ${step.status === "active" ? "text-white" : ""}
            ${step.status === "pending" ? "text-gray-500" : ""}
          `}
        >
          {step.title}
        </p>

        {step.description && step.status === "active" && (
          <p className="text-sm text-gray-400 mt-0.5">{step.description}</p>
        )}

        {step.error && (
          <p className="text-sm text-red-400 mt-1">{step.error}</p>
        )}

        {step.txHash && (
          <a
            href={`${explorerUrl}${step.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mt-1"
          >
            View transaction
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * useTransactionSteps - Hook for managing transaction step state
 */
export function useTransactionSteps(initialSteps: Omit<TransactionStep, "status">[]) {
  const [steps, setSteps] = useState<TransactionStep[]>(
    initialSteps.map((step) => ({ ...step, status: "pending" }))
  );
  const [currentStep, setCurrentStep] = useState(0);

  const startStep = useCallback((stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status: "active" } : step
      )
    );
    setCurrentStep(initialSteps.findIndex((s) => s.id === stepId));
  }, [initialSteps]);

  const completeStep = useCallback((stepId: string, txHash?: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status: "success", txHash } : step
      )
    );
  }, []);

  const failStep = useCallback((stepId: string, error: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status: "error", error } : step
      )
    );
  }, []);

  const reset = useCallback(() => {
    setSteps(initialSteps.map((step) => ({ ...step, status: "pending" })));
    setCurrentStep(0);
  }, [initialSteps]);

  const isComplete = steps.every((step) => step.status === "success");
  const hasError = steps.some((step) => step.status === "error");

  return {
    steps,
    currentStep,
    startStep,
    completeStep,
    failStep,
    reset,
    isComplete,
    hasError,
  };
}

/**
 * TransactionToast - Compact transaction status notification
 */
interface TransactionToastProps {
  status: "pending" | "success" | "error";
  message: string;
  txHash?: string;
  isVisible: boolean;
  onClose: () => void;
  explorerUrl?: string;
}

export function TransactionToast({
  status,
  message,
  txHash,
  isVisible,
  onClose,
  explorerUrl = "https://basescan.org/tx/",
}: TransactionToastProps) {
  useEffect(() => {
    if (isVisible && status !== "pending") {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, status, onClose]);

  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return {
          bg: "bg-green-500/10 border-green-500/30",
          icon: "✓",
          iconBg: "bg-green-500",
        };
      case "error":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          icon: "✕",
          iconBg: "bg-red-500",
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/30",
          icon: null,
          iconBg: "bg-blue-500",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        max-w-sm w-full p-4 rounded-xl
        border backdrop-blur-xl
        transition-all duration-300
        ${styles.bg}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full
            flex items-center justify-center
            ${styles.iconBg}
          `}
        >
          {styles.icon ? (
            <span className="text-white font-bold">{styles.icon}</span>
          ) : (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">{message}</p>
          {txHash && (
            <a
              href={`${explorerUrl}${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View on Explorer →
            </a>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * GasEstimate - Display estimated gas costs
 */
interface GasEstimateProps {
  gasLimit: bigint;
  gasPrice: bigint;
  ethPrice?: number;
  className?: string;
}

export function GasEstimate({
  gasLimit,
  gasPrice,
  ethPrice = 3000,
  className = "",
}: GasEstimateProps) {
  const gasCostWei = gasLimit * gasPrice;
  const gasCostEth = Number(gasCostWei) / 1e18;
  const gasCostUsd = gasCostEth * ethPrice;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm text-gray-400">Estimated gas</span>
      <div className="text-right">
        <span className="text-sm font-medium text-white">
          {gasCostEth.toFixed(6)} ETH
        </span>
        <span className="text-xs text-gray-500 ml-2">
          (~${gasCostUsd.toFixed(2)})
        </span>
      </div>
    </div>
  );
}

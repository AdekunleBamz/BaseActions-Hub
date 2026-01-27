"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Button } from "./ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: "⚠️",
    confirmClass: "bg-red-500 hover:bg-red-600",
    iconBg: "bg-red-500/20",
  },
  warning: {
    icon: "⚡",
    confirmClass: "bg-yellow-500 hover:bg-yellow-600 text-black",
    iconBg: "bg-yellow-500/20",
  },
  info: {
    icon: "ℹ️",
    confirmClass: "bg-blue-500 hover:bg-blue-600",
    iconBg: "bg-blue-500/20",
  },
} as const;

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "info",
  isLoading = false,
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Trigger enter animation
      requestAnimationFrame(() => setIsVisible(true));
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [isLoading, onClose]);

  const handleConfirm = useCallback(async () => {
    await onConfirm();
    handleClose();
  }, [onConfirm, handleClose]);

  if (!isOpen) return null;

  const style = variantStyles[variant];

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`relative bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-200 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}
            aria-hidden="true"
          >
            {style.icon}
          </div>
          <div className="flex-1">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-white"
            >
              {title}
            </h2>
            <div
              id="confirm-dialog-description"
              className="mt-2 text-gray-400 text-sm"
            >
              {message}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className={style.confirmClass}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing confirm dialog state
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Omit<ConfirmDialogProps, "isOpen" | "onClose" | "onConfirm">>({
    title: "",
    message: "",
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (options: Omit<ConfirmDialogProps, "isOpen" | "onClose" | "onConfirm">) => {
      return new Promise<boolean>((resolve) => {
        setConfig(options);
        setResolver(() => resolve);
        setIsOpen(true);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    resolver?.(true);
    setIsOpen(false);
  }, [resolver]);

  const handleClose = useCallback(() => {
    resolver?.(false);
    setIsOpen(false);
  }, [resolver]);

  const dialogProps: ConfirmDialogProps = {
    isOpen,
    onClose: handleClose,
    onConfirm: handleConfirm,
    ...config,
  };

  return { confirm, dialogProps, ConfirmDialog };
}

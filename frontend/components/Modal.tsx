"use client";

import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useFocusTrap, useFocusRestore, useKeyboardUser } from "@/hooks";

// ============================================================================
// Types
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  className?: string;
}

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
}

// ============================================================================
// Context
// ============================================================================

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
}

// ============================================================================
// Modal Root
// ============================================================================

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocusRef,
  className,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen);
  const focusRestore = useFocusRestore(isOpen);
  const isKeyboardUser = useKeyboardUser();
  const idRef = useRef(`modal-${Math.random().toString(36).slice(2)}`);
  
  const titleId = `${idRef.current}-title`;
  const descriptionId = `${idRef.current}-description`;

  // Mount portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus initial element
  useEffect(() => {
    if (isOpen && initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }
  }, [isOpen, initialFocusRef]);

  if (!mounted || !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  const modal = (
    <ModalContext.Provider value={{ isOpen, onClose, titleId, descriptionId }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="presentation"
      >
        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm",
            "animate-in fade-in duration-200"
          )}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "relative w-full",
            sizeClasses[size],
            "bg-dark-bg-secondary border border-dark-border-primary rounded-xl",
            "shadow-2xl shadow-black/50",
            "animate-in fade-in zoom-in-95 duration-200",
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-dark-border-primary">
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-dark-text-primary"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    "p-2 rounded-lg text-dark-text-tertiary",
                    "hover:bg-dark-bg-tertiary hover:text-dark-text-primary",
                    "transition-colors",
                    isKeyboardUser && "focus:ring-2 focus:ring-accent-primary focus:outline-none"
                  )}
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Description (if provided) */}
          {description && (
            <p id={descriptionId} className="sr-only">
              {description}
            </p>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );

  return createPortal(modal, document.body);
}

// ============================================================================
// Modal Parts
// ============================================================================

interface ModalPartProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalPartProps) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className }: ModalPartProps) {
  return (
    <div className={cn(
      "flex items-center justify-end gap-3 p-4",
      "border-t border-dark-border-primary",
      className
    )}>
      {children}
    </div>
  );
}

// ============================================================================
// Confirmation Modal
// ============================================================================

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "info",
  isLoading = false,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const confirmButtonClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-accent-primary hover:bg-accent-secondary",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <ModalBody>
        <p className="text-dark-text-secondary">{message}</p>
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 rounded-lg font-medium",
            "bg-dark-bg-tertiary text-dark-text-primary",
            "hover:bg-dark-bg-primary transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {cancelLabel}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-white",
            "transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            confirmButtonClasses[variant]
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}

// ============================================================================
// Hook for modal state
// ============================================================================

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}

// ============================================================================
// Hook for confirmation dialogs
// ============================================================================

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  }, [state.resolve]);

  const ConfirmDialog = useCallback(() => (
    <ConfirmModal
      isOpen={state.isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      variant={state.variant}
    />
  ), [state, handleConfirm, handleCancel]);

  return {
    confirm,
    ConfirmDialog,
  };
}

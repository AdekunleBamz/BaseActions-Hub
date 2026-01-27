'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface ModalConfig {
  id: string;
  component: ReactNode;
  props?: Record<string, unknown>;
  options?: {
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    position?: 'center' | 'top' | 'bottom';
  };
}

interface ModalContextType {
  modals: ModalConfig[];
  openModal: (modal: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

// Provider
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const generateId = () => `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const openModal = useCallback((modal: Omit<ModalConfig, 'id'>): string => {
    const id = generateId();
    setModals((prev) => [...prev, { ...modal, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const isOpen = useCallback(
    (id: string) => modals.some((m) => m.id === id),
    [modals]
  );

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals, isOpen }}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  );
}

// Hook
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Modal Renderer
function ModalRenderer() {
  const { modals, closeModal } = useModal();

  if (modals.length === 0) return null;

  const getSizeClass = (size?: ModalConfig['options']['size']) => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-md';
    }
  };

  const getPositionClass = (position?: ModalConfig['options']['position']) => {
    switch (position) {
      case 'top':
        return 'items-start pt-20';
      case 'bottom':
        return 'items-end pb-20';
      default:
        return 'items-center';
    }
  };

  return (
    <>
      {modals.map((modal, index) => {
        const options = modal.options || {};
        const {
          closeOnOverlayClick = true,
          closeOnEscape = true,
          showCloseButton = true,
        } = options;

        return (
          <div
            key={modal.id}
            className={`
              fixed inset-0 z-[${50 + index}] flex justify-center
              ${getPositionClass(options.position)}
            `}
            onKeyDown={(e) => {
              if (closeOnEscape && e.key === 'Escape') {
                closeModal(modal.id);
              }
            }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => closeOnOverlayClick && closeModal(modal.id)}
            />

            {/* Modal Content */}
            <div
              className={`
                relative w-full ${getSizeClass(options.size)}
                bg-gray-900 border border-gray-700 rounded-2xl
                shadow-2xl animate-scale-in overflow-hidden
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {showCloseButton && (
                <button
                  onClick={() => closeModal(modal.id)}
                  className="absolute top-4 right-4 p-2 rounded-lg
                    text-gray-400 hover:text-white hover:bg-gray-800
                    transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {modal.component}
            </div>
          </div>
        );
      })}
    </>
  );
}

// Confirmation Modal Hook
interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function useConfirm() {
  const { openModal, closeModal } = useModal();

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        const id = openModal({
          component: (
            <ConfirmDialog
              {...options}
              onConfirm={() => {
                closeModal(id);
                resolve(true);
              }}
              onCancel={() => {
                closeModal(id);
                resolve(false);
              }}
            />
          ),
          options: {
            closeOnOverlayClick: false,
            showCloseButton: false,
            size: 'sm',
          },
        });
      });
    },
    [openModal, closeModal]
  );

  return confirm;
}

// Confirm Dialog Component
function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  onConfirm,
  onCancel,
}: ConfirmOptions & { onConfirm: () => void; onCancel: () => void }) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center">{getIcon()}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${getButtonClass()}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

export default ModalProvider;

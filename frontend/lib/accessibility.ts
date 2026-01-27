/**
 * Accessibility utilities for better UX
 * Includes focus management, screen reader helpers, and ARIA utilities
 */

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Focus trap for modals and dialogs
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const getFocusableElements = () => {
    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const activate = () => {
    document.addEventListener('keydown', handleKeyDown);
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  };

  const deactivate = () => {
    document.removeEventListener('keydown', handleKeyDown);
  };

  return { activate, deactivate };
}

/**
 * Restore focus to a previously focused element
 */
export function createFocusRestore() {
  let previousActiveElement: HTMLElement | null = null;

  const save = () => {
    previousActiveElement = document.activeElement as HTMLElement;
  };

  const restore = () => {
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  return { save, restore };
}

// ============================================================================
// Screen Reader Utilities
// ============================================================================

/**
 * Announce a message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  
  // Visually hide but keep accessible
  Object.assign(announcement.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });

  document.body.appendChild(announcement);

  // Small delay ensures the announcement is picked up
  setTimeout(() => {
    announcement.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Create a persistent announcer for frequent updates
 */
export function createAnnouncer() {
  let container: HTMLDivElement | null = null;

  const init = () => {
    if (container) return;
    
    container = document.createElement('div');
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    container.id = 'sr-announcer';
    
    Object.assign(container.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });

    document.body.appendChild(container);
  };

  const say = (message: string) => {
    if (!container) init();
    if (container) {
      container.textContent = '';
      setTimeout(() => {
        if (container) container.textContent = message;
      }, 50);
    }
  };

  const destroy = () => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
      container = null;
    }
  };

  return { init, say, destroy };
}

// ============================================================================
// ARIA Helpers
// ============================================================================

/**
 * Generate unique IDs for ARIA relationships
 */
export function generateId(prefix = 'a11y') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ARIA attributes for common patterns
 */
export const ariaPatterns = {
  /**
   * Accordion panel attributes
   */
  accordion: (isOpen: boolean, headerId: string, panelId: string) => ({
    trigger: {
      'aria-expanded': isOpen,
      'aria-controls': panelId,
      id: headerId,
    },
    panel: {
      role: 'region' as const,
      'aria-labelledby': headerId,
      id: panelId,
      hidden: !isOpen,
    },
  }),

  /**
   * Tab panel attributes
   */
  tabs: (isSelected: boolean, tabId: string, panelId: string) => ({
    tab: {
      role: 'tab' as const,
      'aria-selected': isSelected,
      'aria-controls': panelId,
      id: tabId,
      tabIndex: isSelected ? 0 : -1,
    },
    panel: {
      role: 'tabpanel' as const,
      'aria-labelledby': tabId,
      id: panelId,
      hidden: !isSelected,
      tabIndex: 0,
    },
  }),

  /**
   * Dialog/Modal attributes
   */
  dialog: (titleId: string, descriptionId?: string) => ({
    dialog: {
      role: 'dialog' as const,
      'aria-modal': true,
      'aria-labelledby': titleId,
      ...(descriptionId && { 'aria-describedby': descriptionId }),
    },
  }),

  /**
   * Alert dialog attributes
   */
  alertDialog: (titleId: string, descriptionId: string) => ({
    dialog: {
      role: 'alertdialog' as const,
      'aria-modal': true,
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    },
  }),

  /**
   * Menu attributes
   */
  menu: (isOpen: boolean, triggerId: string, menuId: string) => ({
    trigger: {
      'aria-haspopup': 'menu' as const,
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? menuId : undefined,
      id: triggerId,
    },
    menu: {
      role: 'menu' as const,
      'aria-labelledby': triggerId,
      id: menuId,
    },
    menuitem: {
      role: 'menuitem' as const,
    },
  }),

  /**
   * Loading state attributes
   */
  loading: (isLoading: boolean, describedById?: string) => ({
    'aria-busy': isLoading,
    ...(describedById && { 'aria-describedby': describedById }),
  }),

  /**
   * Error message association
   */
  error: (hasError: boolean, inputId: string, errorId: string) => ({
    input: {
      'aria-invalid': hasError,
      ...(hasError && { 'aria-describedby': errorId }),
      id: inputId,
    },
    error: {
      role: 'alert' as const,
      id: errorId,
      'aria-live': 'polite' as const,
    },
  }),
};

// ============================================================================
// Keyboard Navigation Helpers
// ============================================================================

/**
 * Create roving tabindex for widget navigation
 */
export function createRovingTabindex(container: HTMLElement, selector: string) {
  const getItems = () => Array.from(container.querySelectorAll<HTMLElement>(selector));
  let currentIndex = 0;

  const updateTabindex = () => {
    const items = getItems();
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
    });
  };

  const focusCurrent = () => {
    const items = getItems();
    items[currentIndex]?.focus();
  };

  const moveNext = () => {
    const items = getItems();
    currentIndex = (currentIndex + 1) % items.length;
    updateTabindex();
    focusCurrent();
  };

  const movePrev = () => {
    const items = getItems();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateTabindex();
    focusCurrent();
  };

  const moveFirst = () => {
    currentIndex = 0;
    updateTabindex();
    focusCurrent();
  };

  const moveLast = () => {
    const items = getItems();
    currentIndex = items.length - 1;
    updateTabindex();
    focusCurrent();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        moveNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        movePrev();
        break;
      case 'Home':
        e.preventDefault();
        moveFirst();
        break;
      case 'End':
        e.preventDefault();
        moveLast();
        break;
    }
  };

  const init = () => {
    updateTabindex();
    container.addEventListener('keydown', handleKeyDown);
  };

  const destroy = () => {
    container.removeEventListener('keydown', handleKeyDown);
  };

  return { init, destroy, moveNext, movePrev, moveFirst, moveLast };
}

// ============================================================================
// Reduced Motion Utilities
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate animation duration based on motion preference
 */
export function getAnimationDuration(standard: number, reduced = 0): number {
  return prefersReducedMotion() ? reduced : standard;
}

/**
 * Get animation class based on motion preference
 */
export function getMotionSafeClass(animationClass: string, fallbackClass = ''): string {
  return prefersReducedMotion() ? fallbackClass : animationClass;
}

// ============================================================================
// Skip Link Utilities
// ============================================================================

/**
 * Create skip link data
 */
export const skipLinks = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#footer', text: 'Skip to footer' },
];

/**
 * Handle skip link focus
 */
export function focusOnSkipTarget(targetId: string) {
  const target = document.getElementById(targetId.replace('#', ''));
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
    target.addEventListener(
      'blur',
      () => target.removeAttribute('tabindex'),
      { once: true }
    );
  }
}

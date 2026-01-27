/**
 * Analytics and event tracking utilities
 * Supports multiple analytics providers and custom event tracking
 */

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface PageViewEvent {
  path: string;
  title?: string;
  referrer?: string;
  properties?: Record<string, unknown>;
}

export interface UserProperties {
  userId?: string;
  walletAddress?: string;
  chainId?: number;
  isConnected?: boolean;
  [key: string]: unknown;
}

export type AnalyticsProvider = {
  name: string;
  init: () => void;
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (event: PageViewEvent) => void;
  setUserProperties: (properties: UserProperties) => void;
  reset: () => void;
};

// ============================================================================
// Event Queue (for offline/deferred tracking)
// ============================================================================

class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private maxSize = 100;

  push(event: AnalyticsEvent) {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // Remove oldest event
    }
    this.queue.push({
      ...event,
      timestamp: event.timestamp || Date.now(),
    });
  }

  flush(): AnalyticsEvent[] {
    const events = [...this.queue];
    this.queue = [];
    return events;
  }

  size(): number {
    return this.queue.length;
  }
}

// ============================================================================
// Console Logger Provider (Development)
// ============================================================================

export const consoleProvider: AnalyticsProvider = {
  name: "console",
  
  init: () => {
    console.log("📊 [Analytics] Console provider initialized");
  },
  
  trackEvent: (event) => {
    console.log("📊 [Analytics] Event:", {
      name: event.name,
      category: event.category,
      label: event.label,
      value: event.value,
      properties: event.properties,
    });
  },
  
  trackPageView: (event) => {
    console.log("📊 [Analytics] Page View:", {
      path: event.path,
      title: event.title,
      referrer: event.referrer,
    });
  },
  
  setUserProperties: (properties) => {
    console.log("📊 [Analytics] User Properties:", properties);
  },
  
  reset: () => {
    console.log("📊 [Analytics] Reset");
  },
};

// ============================================================================
// No-op Provider (Production fallback)
// ============================================================================

export const noopProvider: AnalyticsProvider = {
  name: "noop",
  init: () => {},
  trackEvent: () => {},
  trackPageView: () => {},
  setUserProperties: () => {},
  reset: () => {},
};

// ============================================================================
// Analytics Manager
// ============================================================================

class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private queue = new EventQueue();
  private userProperties: UserProperties = {};
  private isInitialized = false;
  private debug = false;

  /**
   * Initialize analytics with providers
   */
  init(options: {
    providers?: AnalyticsProvider[];
    debug?: boolean;
  } = {}) {
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
    
    // Add console provider in development
    if (this.debug) {
      this.providers = [consoleProvider, ...(options.providers || [])];
    } else {
      this.providers = options.providers || [noopProvider];
    }

    // Initialize all providers
    this.providers.forEach((provider) => {
      try {
        provider.init();
      } catch (error) {
        console.error(`Failed to initialize ${provider.name}:`, error);
      }
    });

    this.isInitialized = true;

    // Flush queued events
    const queuedEvents = this.queue.flush();
    queuedEvents.forEach((event) => this.trackEvent(event));
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
    };

    if (!this.isInitialized) {
      this.queue.push(enrichedEvent);
      return;
    }

    this.providers.forEach((provider) => {
      try {
        provider.trackEvent(enrichedEvent);
      } catch (error) {
        console.error(`Failed to track event with ${provider.name}:`, error);
      }
    });
  }

  /**
   * Track a page view
   */
  trackPageView(path: string, title?: string, properties?: Record<string, unknown>) {
    const event: PageViewEvent = {
      path,
      title: title || (typeof document !== "undefined" ? document.title : ""),
      referrer: typeof document !== "undefined" ? document.referrer : "",
      properties,
    };

    this.providers.forEach((provider) => {
      try {
        provider.trackPageView(event);
      } catch (error) {
        console.error(`Failed to track page view with ${provider.name}:`, error);
      }
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties) {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    };

    this.providers.forEach((provider) => {
      try {
        provider.setUserProperties(this.userProperties);
      } catch (error) {
        console.error(`Failed to set user properties with ${provider.name}:`, error);
      }
    });
  }

  /**
   * Get current user properties
   */
  getUserProperties(): UserProperties {
    return { ...this.userProperties };
  }

  /**
   * Reset analytics (on logout, etc.)
   */
  reset() {
    this.userProperties = {};
    
    this.providers.forEach((provider) => {
      try {
        provider.reset();
      } catch (error) {
        console.error(`Failed to reset ${provider.name}:`, error);
      }
    });
  }

  /**
   * Add a provider after initialization
   */
  addProvider(provider: AnalyticsProvider) {
    provider.init();
    this.providers.push(provider);
  }
}

// Singleton instance
export const analytics = new AnalyticsManager();

// ============================================================================
// Pre-defined Event Helpers
// ============================================================================

/**
 * Web3 specific events
 */
export const web3Events = {
  walletConnected: (address: string, chainId: number) => ({
    name: "wallet_connected",
    category: "web3",
    properties: { address, chainId },
  }),

  walletDisconnected: () => ({
    name: "wallet_disconnected",
    category: "web3",
  }),

  chainSwitched: (fromChainId: number, toChainId: number) => ({
    name: "chain_switched",
    category: "web3",
    properties: { fromChainId, toChainId },
  }),

  transactionSubmitted: (hash: string, type: string) => ({
    name: "transaction_submitted",
    category: "web3",
    properties: { hash, type },
  }),

  transactionConfirmed: (hash: string, type: string) => ({
    name: "transaction_confirmed",
    category: "web3",
    properties: { hash, type },
  }),

  transactionFailed: (hash: string, type: string, error: string) => ({
    name: "transaction_failed",
    category: "web3",
    properties: { hash, type, error },
  }),

  signatureRequested: (type: string) => ({
    name: "signature_requested",
    category: "web3",
    properties: { type },
  }),

  signatureCompleted: (type: string) => ({
    name: "signature_completed",
    category: "web3",
    properties: { type },
  }),
};

/**
 * Guestbook specific events
 */
export const guestbookEvents = {
  guestbookViewed: (address: string) => ({
    name: "guestbook_viewed",
    category: "guestbook",
    properties: { address },
  }),

  messageSigned: (guestbookAddress: string, messageLength: number) => ({
    name: "message_signed",
    category: "guestbook",
    properties: { guestbookAddress, messageLength },
  }),

  guestbookShared: (platform: string) => ({
    name: "guestbook_shared",
    category: "guestbook",
    properties: { platform },
  }),

  quickMessageSelected: (message: string) => ({
    name: "quick_message_selected",
    category: "guestbook",
    label: message,
  }),
};

/**
 * UI interaction events
 */
export const uiEvents = {
  buttonClicked: (buttonId: string, context?: string) => ({
    name: "button_clicked",
    category: "ui",
    label: buttonId,
    properties: { context },
  }),

  modalOpened: (modalId: string) => ({
    name: "modal_opened",
    category: "ui",
    label: modalId,
  }),

  modalClosed: (modalId: string, method: "button" | "overlay" | "escape") => ({
    name: "modal_closed",
    category: "ui",
    label: modalId,
    properties: { method },
  }),

  tabChanged: (tabId: string) => ({
    name: "tab_changed",
    category: "ui",
    label: tabId,
  }),

  formSubmitted: (formId: string, success: boolean) => ({
    name: "form_submitted",
    category: "ui",
    label: formId,
    properties: { success },
  }),

  errorDisplayed: (errorType: string, message: string) => ({
    name: "error_displayed",
    category: "ui",
    properties: { errorType, message },
  }),

  copyToClipboard: (contentType: string) => ({
    name: "copy_to_clipboard",
    category: "ui",
    label: contentType,
  }),
};

/**
 * Navigation events
 */
export const navigationEvents = {
  externalLinkClicked: (url: string) => ({
    name: "external_link_clicked",
    category: "navigation",
    properties: { url },
  }),

  internalNavigated: (from: string, to: string) => ({
    name: "internal_navigated",
    category: "navigation",
    properties: { from, to },
  }),
};

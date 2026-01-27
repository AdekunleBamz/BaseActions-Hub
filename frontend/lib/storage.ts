/**
 * Storage utilities for persisting data
 * Supports localStorage, sessionStorage, and IndexedDB
 */

// ============================================================================
// Types
// ============================================================================

export interface StorageOptions {
  prefix?: string;
  serialize?: <T>(value: T) => string;
  deserialize?: <T>(value: string) => T;
  ttl?: number; // Time to live in milliseconds
}

interface StoredValue<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

// ============================================================================
// Default Serializers
// ============================================================================

const defaultSerialize = <T>(value: T): string => JSON.stringify(value);
const defaultDeserialize = <T>(value: string): T => JSON.parse(value);

// ============================================================================
// Storage Manager
// ============================================================================

export class StorageManager {
  private prefix: string;
  private serialize: <T>(value: T) => string;
  private deserialize: <T>(value: string) => T;
  private storage: Storage | null;

  constructor(
    storageType: "local" | "session" = "local",
    options: StorageOptions = {}
  ) {
    this.prefix = options.prefix || "app_";
    this.serialize = options.serialize || defaultSerialize;
    this.deserialize = options.deserialize || defaultDeserialize;
    
    if (typeof window !== "undefined") {
      this.storage = storageType === "local" ? localStorage : sessionStorage;
    } else {
      this.storage = null;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Set a value in storage
   */
  set<T>(key: string, value: T, ttl?: number): void {
    if (!this.storage) return;

    const stored: StoredValue<T> = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    try {
      this.storage.setItem(this.getKey(key), this.serialize(stored));
    } catch (error) {
      // Handle quota exceeded
      console.error("Storage quota exceeded:", error);
      this.cleanup();
    }
  }

  /**
   * Get a value from storage
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    if (!this.storage) return defaultValue;

    try {
      const item = this.storage.getItem(this.getKey(key));
      if (!item) return defaultValue;

      const stored = this.deserialize<StoredValue<T>>(item);
      
      // Check if expired
      if (stored.ttl && Date.now() - stored.timestamp > stored.ttl) {
        this.remove(key);
        return defaultValue;
      }

      return stored.value;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Remove a value from storage
   */
  remove(key: string): void {
    if (!this.storage) return;
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * Check if a key exists
   */
  has(key: string): boolean {
    if (!this.storage) return false;
    return this.storage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Get all keys with the prefix
   */
  keys(): string[] {
    if (!this.storage) return [];
    
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key.slice(this.prefix.length));
      }
    }
    return keys;
  }

  /**
   * Clear all values with the prefix
   */
  clear(): void {
    if (!this.storage) return;
    
    const keysToRemove = this.keys();
    keysToRemove.forEach((key) => this.remove(key));
  }

  /**
   * Get storage size in bytes
   */
  size(): number {
    if (!this.storage) return 0;
    
    let total = 0;
    this.keys().forEach((key) => {
      const item = this.storage?.getItem(this.getKey(key));
      if (item) {
        total += item.length * 2; // UTF-16
      }
    });
    return total;
  }

  /**
   * Cleanup expired items
   */
  cleanup(): void {
    if (!this.storage) return;
    
    this.keys().forEach((key) => {
      try {
        const item = this.storage?.getItem(this.getKey(key));
        if (!item) return;

        const stored = this.deserialize<StoredValue<unknown>>(item);
        if (stored.ttl && Date.now() - stored.timestamp > stored.ttl) {
          this.remove(key);
        }
      } catch {
        // Invalid item, remove it
        this.remove(key);
      }
    });
  }
}

// ============================================================================
// Default Instances
// ============================================================================

export const localStorage = new StorageManager("local", { prefix: "bah_" });
export const sessionStorage = new StorageManager("session", { prefix: "bah_" });

// ============================================================================
// Cookie Utilities
// ============================================================================

export interface CookieOptions {
  expires?: Date | number; // Date or days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const cookies = {
  /**
   * Set a cookie
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const expires = options.expires instanceof Date
        ? options.expires
        : new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    } else {
      cookieString += "; path=/";
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += "; secure";
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * Get a cookie value
   */
  get(name: string): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${encodeURIComponent(name)}=`));
    
    if (!cookie) return null;
    
    return decodeURIComponent(cookie.split("=")[1]);
  },

  /**
   * Remove a cookie
   */
  remove(name: string, options: Omit<CookieOptions, "expires"> = {}): void {
    this.set(name, "", { ...options, expires: new Date(0) });
  },

  /**
   * Check if a cookie exists
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  },

  /**
   * Get all cookies as an object
   */
  getAll(): Record<string, string> {
    if (typeof document === "undefined") return {};

    const result: Record<string, string> = {};
    document.cookie.split("; ").forEach((cookie) => {
      const [name, value] = cookie.split("=");
      if (name && value) {
        result[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
    return result;
  },
};

// ============================================================================
// Memory Cache (for SSR compatibility)
// ============================================================================

class MemoryCache<T = unknown> {
  private cache = new Map<string, { value: T; expires?: number }>();

  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      expires: ttl ? Date.now() + ttl : undefined,
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();

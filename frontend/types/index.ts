// Type definitions for the application

export interface Signature {
  signer: `0x${string}`;
  message: string;
  timestamp: bigint;
}

export interface UserStats {
  totalPoints: bigint;
  actionsCount: bigint;
  signaturesGiven: bigint;
  signaturesReceived: bigint;
  currentStreak: bigint;
  longestStreak: bigint;
  lastActionDay: bigint;
}

export interface Badge {
  id: number;
  name: string;
  emoji: string;
  description: string;
  requirement: string;
  gradient: string;
}

export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export interface QuickMessage {
  emoji: string;
  text: string;
}

// Common utility types
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type Address = `0x${string}`;

export type TransactionHash = `0x${string}`;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Event types for blockchain
export interface SignatureEvent {
  signer: Address;
  guestbookOwner: Address;
  message: string;
  timestamp: bigint;
  transactionHash: TransactionHash;
}

export interface BadgeEarnedEvent {
  user: Address;
  badgeId: number;
  timestamp: bigint;
  transactionHash: TransactionHash;
}

// Component prop patterns
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorStateProps {
  error: Error | string | null;
  onRetry?: () => void;
}

// Form types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

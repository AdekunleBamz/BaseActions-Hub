// Types for the BaseActions Hub V2 application

// ===================
// Blockchain Types
// ===================

export type Address = `0x${string}`;
export type TxHash = `0x${string}`;

export interface ChainInfo {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string;
  testnet: boolean;
}

// ===================
// User Types
// ===================

export interface User {
  address: Address;
  ensName?: string | null;
  avatar?: string | null;
  totalPoints: number;
  rank: number;
  signatureCount: number;
  badgeCount: number;
  referralCount: number;
  joinedAt: bigint | number;
  lastActiveAt: bigint | number;
}

export interface UserProfile extends User {
  signatures: Signature[];
  badges: Badge[];
  stats: UserStats;
}

export interface UserStats {
  totalSignatures: number;
  totalReactionsGiven: number;
  totalReactionsReceived: number;
  totalTipsGiven: bigint;
  totalTipsReceived: bigint;
  currentStreak: number;
  longestStreak: number;
  referralCount: number;
  pointsBreakdown: PointsBreakdown;
}

export interface PointsBreakdown {
  fromSignatures: number;
  fromReactions: number;
  fromTips: number;
  fromReferrals: number;
  fromStreaks: number;
  bonusPoints: number;
}

// ===================
// Signature Types
// ===================

export interface Signature {
  id: bigint;
  signer: Address;
  message: string;
  timestamp: bigint;
  txHash: TxHash;
  isPinned: boolean;
  isEdited: boolean;
  editedAt?: bigint;
  reactions: ReactionCount[];
  tipAmount: bigint;
  referrer?: Address;
}

export interface SignatureInput {
  message: string;
  referrer?: Address;
}

export interface BatchSignatureInput {
  messages: string[];
  referrer?: Address;
}

// ===================
// Reaction Types
// ===================

export type ReactionType = 'like' | 'love' | 'fire' | 'clap' | 'rocket';

export interface Reaction {
  id: number;
  emoji: string;
  name: string;
}

export interface ReactionCount {
  reactionType: number;
  count: number;
}

export interface UserReaction {
  signatureId: bigint;
  user: Address;
  reactionType: number;
  timestamp: bigint;
}

// ===================
// Badge Types
// ===================

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: bigint;
  tokenId: bigint;
  badgeType: number;
  name: string;
  description: string;
  imageUrl: string;
  rarity: BadgeRarity;
  isSoulbound: boolean;
  mintedAt: bigint;
  holder: Address;
}

export interface BadgeType {
  id: number;
  name: string;
  description: string;
  rarity: BadgeRarity;
  requirement: string;
  icon: string;
}

export interface BadgeProgress {
  badgeType: number;
  current: number;
  required: number;
  percentage: number;
  isEarned: boolean;
}

// ===================
// Leaderboard Types
// ===================

export interface LeaderboardEntry {
  rank: number;
  address: Address;
  ensName?: string | null;
  avatar?: string | null;
  points: number;
  signatureCount: number;
  badgeCount: number;
  streak: number;
  trend: 'up' | 'down' | 'same';
  previousRank?: number;
}

export interface LeaderboardPeriod {
  id: 'all-time' | 'monthly' | 'weekly' | 'daily';
  label: string;
  startTime?: bigint;
  endTime?: bigint;
}

export interface LeaderboardSnapshot {
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  timestamp: bigint;
}

// ===================
// Stats Types
// ===================

export interface PlatformStats {
  totalSignatures: bigint;
  totalSigners: bigint;
  totalBadgesMinted: bigint;
  totalPointsDistributed: bigint;
  totalTipsVolume: bigint;
  totalReactions: bigint;
}

export interface DailyStats {
  date: string;
  signatures: number;
  newUsers: number;
  reactions: number;
  tips: bigint;
}

export interface GuestbookStats {
  address: Address;
  signatureCount: number;
  uniqueSigners: number;
  totalReactions: number;
  totalTips: bigint;
  createdAt: bigint;
}

// ===================
// Transaction Types
// ===================

export type TransactionStatus = 
  | 'idle'
  | 'preparing'
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed';

export interface TransactionState {
  status: TransactionStatus;
  hash: TxHash | null;
  error: Error | null;
  confirmations: number;
}

export interface TransactionReceipt {
  hash: TxHash;
  blockNumber: bigint;
  status: 'success' | 'reverted';
  gasUsed: bigint;
  effectiveGasPrice: bigint;
}

// ===================
// Form Types
// ===================

export interface SignFormData {
  message: string;
  referrer?: string;
}

export interface TipFormData {
  signatureId: bigint;
  amount: string;
}

// ===================
// Filter & Sort Types
// ===================

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface FilterConfig {
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  badgeType?: number[];
  rarity?: BadgeRarity[];
  minPoints?: number;
  maxPoints?: number;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ===================
// API Response Types
// ===================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationConfig;
}

// ===================
// Event Types
// ===================

export interface SignedEvent {
  signer: Address;
  signatureId: bigint;
  message: string;
  timestamp: bigint;
}

export interface ReactionAddedEvent {
  signatureId: bigint;
  user: Address;
  reactionType: number;
  timestamp: bigint;
}

export interface BadgeMintedEvent {
  tokenId: bigint;
  recipient: Address;
  badgeType: number;
  timestamp: bigint;
}

export interface TipSentEvent {
  signatureId: bigint;
  tipper: Address;
  amount: bigint;
  timestamp: bigint;
}

// ===================
// UI State Types
// ===================

export interface ModalState {
  isOpen: boolean;
  type?: 'success' | 'error' | 'confirm' | 'info';
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// ===================
// Theme Types
// ===================

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export default {
  // Re-export all types for convenient imports
};

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

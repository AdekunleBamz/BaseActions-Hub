// Navigation configuration
export const NAV_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/sign", label: "Sign", icon: "✍️" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/stats", label: "Stats", icon: "📊" },
] as const;

// Social links
export const SOCIAL_LINKS = {
  base: "https://base.org",
  github: "https://github.com/AdekunleBamz/BaseActions-Hub",
  farcaster: "https://warpcast.com",
} as const;

// External URLs
export const EXPLORER_URL = "https://basescan.org";
export const APP_URL = "https://base-actions-hub.vercel.app";

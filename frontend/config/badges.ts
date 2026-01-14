// Badge definitions
export const BADGES = [
  {
    id: "signer",
    badgeId: 0,
    name: "Signer",
    emoji: "✍️",
    description: "First signature given",
    requirement: "Sign 1 guestbook",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "supporter",
    badgeId: 1,
    name: "Supporter",
    emoji: "💝",
    description: "First signature received",
    requirement: "Receive 1 signature",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "streak",
    badgeId: 2,
    name: "Streak Master",
    emoji: "🔥",
    description: "7 day streak",
    requirement: "Keep 7 day streak",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "whale",
    badgeId: 3,
    name: "Whale",
    emoji: "🐋",
    description: "100+ signatures",
    requirement: "Sign 100 guestbooks",
    gradient: "from-blue-600 to-indigo-600",
  },
] as const;

export type BadgeId = (typeof BADGES)[number]["id"];

// BaseActionsHub ABI
export const BaseActionsHubABI = [
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "message", type: "string" },
    ],
    name: "signGuestbook",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "actionCost",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalActions",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerFeePercent",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: true, name: "guestbookOwner", type: "address" },
      { indexed: false, name: "message", type: "string" },
      { indexed: false, name: "badgeAwarded", type: "bool" },
    ],
    name: "GuestbookSigned",
    type: "event",
  },
] as const;

// Guestbook ABI
export const GuestbookABI = [
  {
    inputs: [{ name: "", type: "address" }],
    name: "signatureCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSignatures",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    name: "getSignatures",
    outputs: [
      {
        components: [
          { name: "signer", type: "address" },
          { name: "message", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Leaderboard ABI
export const LeaderboardABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      {
        components: [
          { name: "totalPoints", type: "uint256" },
          { name: "actionsCount", type: "uint256" },
          { name: "signaturesGiven", type: "uint256" },
          { name: "signaturesReceived", type: "uint256" },
          { name: "currentStreak", type: "uint256" },
          { name: "longestStreak", type: "uint256" },
          { name: "lastActionTime", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalUsers",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// BadgeNFT ABI
export const BadgeNFTABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "userBadgeCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint8" },
    ],
    name: "hasBadge",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

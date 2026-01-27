// BaseActionsHub V2 ABI
export const BaseActionsHubABI = [
  // Sign functions
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "message", type: "string" },
    ],
    name: "signAndEarn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "message", type: "string" },
      { name: "referrer", type: "address" },
    ],
    name: "signWithReferral",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwners", type: "address[]" },
      { name: "messages", type: "string[]" },
    ],
    name: "batchSign",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Tip function
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "message", type: "string" },
    ],
    name: "tip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // View functions
  {
    inputs: [],
    name: "signFee",
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
    name: "totalFeesCollected",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTips",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFeePercent",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "earlyAdopterCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "isEarlyAdopter",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: true, name: "target", type: "address" },
      { indexed: false, name: "actionType", type: "string" },
      { indexed: false, name: "fee", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "ActionPerformed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "signer", type: "address" },
      { indexed: true, name: "guestbookOwner", type: "address" },
      { indexed: false, name: "message", type: "string" },
      { indexed: false, name: "badgeTokenId", type: "uint256" },
    ],
    name: "SignAndBadge",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "message", type: "string" },
    ],
    name: "TipSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "signer", type: "address" },
      { indexed: false, name: "count", type: "uint256" },
      { indexed: false, name: "totalFee", type: "uint256" },
    ],
    name: "BatchSign",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "referee", type: "address" },
      { indexed: true, name: "referrer", type: "address" },
    ],
    name: "ReferralUsed",
    type: "event",
  },
] as const;

// Guestbook V2 ABI
export const GuestbookABI = [
  // View functions
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
    inputs: [],
    name: "totalReactions",
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
          { name: "reactions", type: "uint256" },
          { name: "isPinned", type: "bool" },
          { name: "editedAt", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "getSignature",
    outputs: [
      {
        components: [
          { name: "signer", type: "address" },
          { name: "message", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "reactions", type: "uint256" },
          { name: "isPinned", type: "bool" },
          { name: "editedAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "guestbookOwner", type: "address" }],
    name: "getPinnedSignature",
    outputs: [
      {
        components: [
          { name: "signer", type: "address" },
          { name: "message", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "reactions", type: "uint256" },
          { name: "isPinned", type: "bool" },
          { name: "editedAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
      { name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "signatureIndex", type: "uint256" },
      { name: "user", type: "address" },
    ],
    name: "checkReaction",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "signatureIndex", type: "uint256" },
    ],
    name: "getReactionCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // User functions
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "signatureIndex", type: "uint256" },
    ],
    name: "react",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "signatureIndex", type: "uint256" },
    ],
    name: "unreact",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "guestbookOwner", type: "address" },
      { name: "signatureIndex", type: "uint256" },
      { name: "newMessage", type: "string" },
    ],
    name: "editSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "signatureIndex", type: "uint256" }],
    name: "pinSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpinSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "guestbookOwner", type: "address" },
      { indexed: true, name: "signer", type: "address" },
      { indexed: false, name: "message", type: "string" },
      { indexed: true, name: "signatureIndex", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "Signed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "guestbookOwner", type: "address" },
      { indexed: true, name: "signatureIndex", type: "uint256" },
      { indexed: true, name: "reactor", type: "address" },
      { indexed: false, name: "newReactionCount", type: "uint256" },
    ],
    name: "Reacted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "guestbookOwner", type: "address" },
      { indexed: true, name: "signatureIndex", type: "uint256" },
    ],
    name: "SignaturePinned",
    type: "event",
  },
] as const;

// Leaderboard V2 ABI
export const LeaderboardABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      { name: "totalPoints", type: "uint256" },
      { name: "actionsCount", type: "uint256" },
      { name: "signaturesGiven", type: "uint256" },
      { name: "signaturesReceived", type: "uint256" },
      { name: "currentStreak", type: "uint256" },
      { name: "longestStreak", type: "uint256" },
      { name: "lastActionTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getFullUserStats",
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
          { name: "lastActionDay", type: "uint256" },
          { name: "referralPoints", type: "uint256" },
          { name: "referralCount", type: "uint256" },
          { name: "referrer", type: "address" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getWeeklyPoints",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getMonthlyPoints",
    outputs: [{ name: "", type: "uint256" }],
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
  {
    inputs: [],
    name: "totalPointsAwarded",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentMultiplier",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "points", type: "uint256" },
      { indexed: false, name: "reason", type: "string" },
    ],
    name: "PointsEarned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "referrer", type: "address" },
      { indexed: true, name: "referee", type: "address" },
    ],
    name: "ReferralRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "multiplier", type: "uint256" },
      { indexed: false, name: "endTime", type: "uint256" },
    ],
    name: "MultiplierUpdated",
    type: "event",
  },
] as const;

// BadgeNFT V2 ABI
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
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserBadges",
    outputs: [
      {
        components: [
          { name: "badgeType", type: "uint8" },
          { name: "rarity", type: "uint8" },
          { name: "recipient", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "customMetadata", type: "string" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "rarity", type: "uint8" },
    ],
    name: "getUserBadgesByRarity",
    outputs: [
      {
        components: [
          { name: "badgeType", type: "uint8" },
          { name: "rarity", type: "uint8" },
          { name: "recipient", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "customMetadata", type: "string" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "badgeType", type: "uint8" }],
    name: "getRarity",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "badgeType", type: "uint8" }],
    name: "badgeTypeMintCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "soulbound",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "recipient", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "badgeType", type: "uint8" },
      { indexed: false, name: "rarity", type: "uint8" },
    ],
    name: "BadgeMinted",
    type: "event",
  },
] as const;

// Badge type enum for TypeScript
export const BadgeType = {
  SIGNER: 0,
  SUPPORTER: 1,
  STREAK_3: 2,
  STREAK_7: 3,
  STREAK_30: 4,
  EARLY_ADOPTER: 5,
  TOP_10: 6,
  WHALE: 7,
  COLLECTOR: 8,
  INFLUENCER: 9,
} as const;

// Rarity enum for TypeScript
export const Rarity = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
} as const;

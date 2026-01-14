"use client";

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className = "" }: TrustBadgesProps) {
  const badges = [
    { text: "Built on Base", icon: "⚡", variant: "blue" },
    { text: "On-chain Verified", icon: "🔐", variant: "purple" },
    { text: "NFT Badges", icon: "🏅", variant: "green" },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {badges.map((badge) => (
        <span
          key={badge.text}
          className={`badge badge-${badge.variant}`}
        >
          {badge.icon} {badge.text}
        </span>
      ))}
    </div>
  );
}

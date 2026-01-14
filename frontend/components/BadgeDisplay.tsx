"use client";

import { Badge } from "./ui/Badge";

interface BadgeDisplayProps {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  earned: boolean;
}

export function BadgeDisplay({
  name,
  emoji,
  description,
  gradient,
  earned,
}: BadgeDisplayProps) {
  return (
    <div
      className={`relative rounded-xl p-5 text-center transition-all ${
        earned
          ? "glass border-2 border-green-500/50"
          : "bg-gray-900/50 border border-white/5 opacity-50"
      }`}
    >
      {earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
          ✓
        </div>
      )}

      <div
        className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3 ${
          earned ? `bg-gradient-to-br ${gradient}` : "bg-gray-800"
        }`}
      >
        {emoji}
      </div>

      <h3 className="font-bold text-white mb-1">{name}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

export function BadgeGrid({ badges }: { badges: BadgeDisplayProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <BadgeDisplay key={badge.id} {...badge} />
      ))}
    </div>
  );
}

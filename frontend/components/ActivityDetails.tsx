"use client";

interface ActivityItemProps {
  icon: string;
  label: string;
  value: string | number;
  showBorder?: boolean;
}

export function ActivityItem({ icon, label, value, showBorder = true }: ActivityItemProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${showBorder ? "border-b border-white/5" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-gray-400">{label}</span>
      </div>
      <span className="text-white font-bold text-lg">{value}</span>
    </div>
  );
}

interface ActivityDetailsProps {
  stats: {
    actionsCount?: bigint;
    signaturesGiven?: bigint;
    signaturesReceived?: bigint;
    longestStreak?: bigint;
  };
}

export function ActivityDetails({ stats }: ActivityDetailsProps) {
  const items = [
    { icon: "⚡", label: "Total Actions", value: stats.actionsCount?.toString() || "0" },
    { icon: "📤", label: "Signatures Given", value: stats.signaturesGiven?.toString() || "0" },
    { icon: "📥", label: "Signatures Received", value: stats.signaturesReceived?.toString() || "0" },
    { icon: "🏆", label: "Longest Streak", value: `${stats.longestStreak?.toString() || "0"} days` },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>📈</span> Activity Details
      </h2>

      <div className="space-y-0">
        {items.map((item, i) => (
          <ActivityItem
            key={item.label}
            {...item}
            showBorder={i < items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

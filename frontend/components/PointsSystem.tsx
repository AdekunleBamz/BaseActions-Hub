"use client";

interface PointsItemProps {
  action: string;
  points: string;
  icon: string;
  color: string;
}

export function PointsItem({ action, points, icon, color }: PointsItemProps) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-white/10 transition">
      <div
        className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">{action}</p>
      </div>
      <div className={`text-${color}-400 font-bold text-lg`}>{points}</div>
    </div>
  );
}

export function PointsSystemSection() {
  const pointsSystem = [
    { action: "Sign a guestbook", points: "+10", color: "blue", icon: "✍️" },
    { action: "Receive a signature", points: "+5", color: "purple", icon: "📥" },
    { action: "Daily streak bonus", points: "+2 × streak", color: "orange", icon: "🔥" },
    { action: "First signature (badge)", points: "+25", color: "green", icon: "🏅" },
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Points System</h2>
        <p className="text-gray-500">How to earn points and climb the ranks</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {pointsSystem.map((item, i) => (
          <PointsItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

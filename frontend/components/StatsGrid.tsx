"use client";

import { StatCard } from "./Layout";
import { StatCardSkeleton } from "./ui/Skeleton";

interface StatsGridProps {
  stats: Array<{
    value: string | number;
    label: string;
    icon: string;
    color: "blue" | "purple" | "green" | "orange" | "cyan";
  }>;
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, isLoading, columns = 3 }: StatsGridProps) {
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  if (isLoading) {
    return (
      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {[...Array(columns)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

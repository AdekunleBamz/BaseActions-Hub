"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface HeatmapData {
  date: string; // ISO date string
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  startDate?: Date;
  endDate?: Date;
  colorScale?: string[];
  emptyColor?: string;
  cellSize?: number;
  cellGap?: number;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  tooltipFormatter?: (date: string, value: number) => string;
  onClick?: (date: string, value: number) => void;
  className?: string;
}

const defaultColorScale = [
  "#1e293b", // 0 - empty
  "#1e40af", // 1-25%
  "#1d4ed8", // 25-50%
  "#2563eb", // 50-75%
  "#3b82f6", // 75-100%
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Heatmap - Activity heatmap visualization (like GitHub contributions)
 */
export function Heatmap({
  data,
  startDate,
  endDate,
  colorScale = defaultColorScale,
  emptyColor = "#1e293b",
  cellSize = 12,
  cellGap = 3,
  showMonthLabels = true,
  showDayLabels = true,
  tooltipFormatter,
  onClick,
  className = "",
}: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
  }>({ show: false, x: 0, y: 0, content: "" });

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate date range
  const end = endDate || new Date();
  const start = startDate || new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Create a map of date -> value
  const dataMap = new Map(data.map((d) => [d.date.split("T")[0], d.value]));

  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // Generate all dates in range
  const generateDates = () => {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const dates = generateDates();

  // Group dates by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // Pad start to align with Sunday
  const firstDay = dates[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(new Date(0)); // Placeholder
  }

  dates.forEach((date) => {
    currentWeek.push(date);
    if (date.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Get color for value
  const getColor = (value: number | undefined) => {
    if (!value || value === 0) return emptyColor;

    const percentage = value / maxValue;
    const index = Math.min(
      Math.ceil(percentage * (colorScale.length - 1)),
      colorScale.length - 1
    );

    return colorScale[index];
  };

  // Handle cell hover
  const handleMouseEnter = (e: React.MouseEvent, date: Date, value: number) => {
    if (date.getTime() === 0) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dateStr = date.toISOString().split("T")[0];
    const content = tooltipFormatter
      ? tooltipFormatter(dateStr, value)
      : `${dateStr}: ${value} contribution${value !== 1 ? "s" : ""}`;

    setTooltip({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 40,
      content,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

  // Calculate month label positions
  const monthLabels: Array<{ month: string; x: number }> = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstValidDate = week.find((d) => d.getTime() !== 0);
    if (firstValidDate) {
      const month = firstValidDate.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          month: months[month],
          x: weekIndex * (cellSize + cellGap),
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Month labels */}
      {showMonthLabels && (
        <div
          className="flex text-xs text-gray-500 mb-2"
          style={{ marginLeft: showDayLabels ? "32px" : 0 }}
        >
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="absolute"
              style={{ left: label.x + (showDayLabels ? 32 : 0) }}
            >
              {label.month}
            </span>
          ))}
        </div>
      )}

      <div className="flex">
        {/* Day labels */}
        {showDayLabels && (
          <div
            className="flex flex-col text-xs text-gray-500 mr-2"
            style={{ gap: cellGap }}
          >
            {weekDays.map((day, i) => (
              <span
                key={day}
                className={i % 2 === 1 ? "" : "opacity-0"}
                style={{ height: cellSize, lineHeight: `${cellSize}px` }}
              >
                {day}
              </span>
            ))}
          </div>
        )}

        {/* Heatmap grid */}
        <div className="flex" style={{ gap: cellGap }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col" style={{ gap: cellGap }}>
              {week.map((date, dayIndex) => {
                const dateStr = date.toISOString().split("T")[0];
                const value = dataMap.get(dateStr) || 0;
                const isPlaceholder = date.getTime() === 0;

                return (
                  <div
                    key={dayIndex}
                    className={`
                      rounded-sm transition-all duration-200
                      ${isPlaceholder ? "" : "cursor-pointer hover:ring-2 hover:ring-white/30"}
                    `}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: isPlaceholder ? "transparent" : getColor(value),
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, date, value)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => !isPlaceholder && onClick?.(dateStr, value)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="absolute z-10 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-xl pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        {colorScale.map((color, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: color,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

/**
 * ActivityHeatmap - Specialized heatmap for user activity
 */
interface ActivityHeatmapProps {
  activities: Array<{
    date: string;
    signatures: number;
    reactions: number;
    tips: number;
  }>;
  metric?: "signatures" | "reactions" | "tips" | "total";
  className?: string;
}

export function ActivityHeatmap({
  activities,
  metric = "total",
  className = "",
}: ActivityHeatmapProps) {
  const data = activities.map((a) => ({
    date: a.date,
    value:
      metric === "total"
        ? a.signatures + a.reactions + a.tips
        : a[metric],
  }));

  const colorScales = {
    signatures: ["#1e293b", "#166534", "#15803d", "#16a34a", "#22c55e"],
    reactions: ["#1e293b", "#9f1239", "#be123c", "#e11d48", "#f43f5e"],
    tips: ["#1e293b", "#a16207", "#ca8a04", "#eab308", "#facc15"],
    total: ["#1e293b", "#1e40af", "#1d4ed8", "#2563eb", "#3b82f6"],
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Activity Heatmap</h3>
        <div className="text-sm text-gray-400">
          Last 365 days
        </div>
      </div>

      <Heatmap
        data={data}
        colorScale={colorScales[metric]}
        tooltipFormatter={(date, value) => {
          const d = new Date(date);
          return `${d.toLocaleDateString("en-US", { 
            weekday: "short", 
            month: "short", 
            day: "numeric" 
          })}: ${value} ${metric === "total" ? "activities" : metric}`;
        }}
      />
    </div>
  );
}

/**
 * StreakHeatmap - Heatmap highlighting streaks
 */
interface StreakHeatmapProps {
  streakDates: string[];
  longestStreak: number;
  currentStreak: number;
  className?: string;
}

export function StreakHeatmap({
  streakDates,
  longestStreak,
  currentStreak,
  className = "",
}: StreakHeatmapProps) {
  const data = streakDates.map((date) => ({ date, value: 1 }));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🔥 Signing Streak</h3>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-400">Current: </span>
            <span className="text-orange-400 font-bold">{currentStreak} days</span>
          </div>
          <div>
            <span className="text-gray-400">Longest: </span>
            <span className="text-blue-400 font-bold">{longestStreak} days</span>
          </div>
        </div>
      </div>

      <Heatmap
        data={data}
        colorScale={["#1e293b", "#ea580c", "#f97316", "#fb923c", "#fdba74"]}
        tooltipFormatter={(date, value) => {
          const d = new Date(date);
          return value
            ? `${d.toLocaleDateString("en-US", { 
                weekday: "short", 
                month: "short", 
                day: "numeric" 
              })}: Active ✓`
            : `${d.toLocaleDateString("en-US", { 
                weekday: "short", 
                month: "short", 
                day: "numeric" 
              })}: No activity`;
        }}
      />
    </div>
  );
}

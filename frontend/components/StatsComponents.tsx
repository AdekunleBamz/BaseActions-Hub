'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from './DisplayComponents';
import { Button } from './ButtonComponents';

// Stats Dashboard
interface StatsOverviewProps {
  stats: {
    totalSignatures: number;
    totalGuestbooks: number;
    totalBadges: number;
    totalReactions: number;
    dailyActive: number;
    weeklyGrowth: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const items = [
    {
      label: 'Total Signatures',
      value: stats.totalSignatures.toLocaleString(),
      icon: '✍️',
      trend: null,
    },
    {
      label: 'Active Guestbooks',
      value: stats.totalGuestbooks.toLocaleString(),
      icon: '📖',
      trend: null,
    },
    {
      label: 'Badges Minted',
      value: stats.totalBadges.toLocaleString(),
      icon: '🏆',
      trend: null,
    },
    {
      label: 'Total Reactions',
      value: stats.totalReactions.toLocaleString(),
      icon: '❤️',
      trend: null,
    },
    {
      label: 'Daily Active Users',
      value: stats.dailyActive.toLocaleString(),
      icon: '👥',
      trend: null,
    },
    {
      label: 'Weekly Growth',
      value: `${stats.weeklyGrowth > 0 ? '+' : ''}${stats.weeklyGrowth}%`,
      icon: '📈',
      trend: stats.weeklyGrowth > 0 ? 'up' : stats.weeklyGrowth < 0 ? 'down' : 'same',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <div className="text-3xl mb-2">{item.icon}</div>
          <p className={`text-2xl font-bold ${
            item.trend === 'up' ? 'text-green-400' : 
            item.trend === 'down' ? 'text-red-400' : 'text-white'
          }`}>
            {item.value}
          </p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}

// Simple Bar Chart
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  maxValue?: number;
}

export function BarChart({ data, title, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <Card>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-20 text-sm text-gray-400 truncate">{item.label}</span>
            <div className="flex-1 h-6 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.color || 'bg-blue-500'
                }`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
            <span className="w-16 text-right text-sm text-white font-medium">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Activity Timeline
interface TimelineItem {
  id: string;
  type: 'signature' | 'badge' | 'reaction' | 'guestbook';
  message: string;
  timestamp: Date;
  actor?: {
    address: string;
    ensName?: string;
  };
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  maxItems?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function ActivityTimeline({ items, maxItems = 10, onLoadMore, hasMore }: ActivityTimelineProps) {
  const displayItems = items.slice(0, maxItems);

  const typeIcons = {
    signature: '✍️',
    badge: '🏆',
    reaction: '❤️',
    guestbook: '📖',
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />

        <div className="space-y-4">
          {displayItems.map((item) => (
            <div key={item.id} className="relative flex items-start gap-4 pl-8">
              {/* Dot */}
              <div className="absolute left-2 w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center text-xs">
                <span className="text-[10px]">{typeIcons[item.type]}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm">{item.message}</p>
                <p className="text-gray-500 text-xs mt-1">{formatTime(item.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>

        {hasMore && onLoadMore && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" onClick={onLoadMore}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Donut Chart for distribution
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, title, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const segments = data.map((d) => {
    const percentage = (d.value / total) * 100;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage * 3.6);
    currentAngle = endAngle;
    return { ...d, percentage, startAngle, endAngle };
  });

  // SVG path for arc
  const createArc = (startAngle: number, endAngle: number, radius: number = 40) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <Card>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      
      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {segments.map((segment, i) => (
              <path
                key={i}
                d={createArc(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
            {/* Center hole */}
            <circle cx="50" cy="50" r="25" fill="#1a1a2e" />
          </svg>
          
          {/* Center text */}
          {(centerLabel || centerValue) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerValue && (
                <span className="text-xl font-bold text-white">{centerValue}</span>
              )}
              {centerLabel && (
                <span className="text-xs text-gray-500">{centerLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-400 flex-1">{segment.label}</span>
              <span className="text-sm text-white font-medium">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Mini Sparkline Chart
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = '#3b82f6', height = 40 }: SparklineProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Stat Card with Sparkline
interface StatCardWithChartProps {
  label: string;
  value: string | number;
  change?: number;
  chartData?: number[];
  icon?: string;
}

export function StatCardWithChart({ label, value, change, chartData, icon }: StatCardWithChartProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last week
            </p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      
      {chartData && chartData.length > 0 && (
        <Sparkline 
          data={chartData} 
          color={change && change >= 0 ? '#22c55e' : '#ef4444'} 
        />
      )}
    </Card>
  );
}

// Heatmap Calendar
interface HeatmapProps {
  data: { date: string; count: number }[];
  title?: string;
}

export function Heatmap({ data, title }: HeatmapProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getIntensity = (count: number) => {
    const intensity = count / maxCount;
    if (count === 0) return 'bg-gray-800';
    if (intensity < 0.25) return 'bg-blue-900';
    if (intensity < 0.5) return 'bg-blue-700';
    if (intensity < 0.75) return 'bg-blue-500';
    return 'bg-blue-400';
  };

  // Create 7 weeks of data
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  data.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <Card>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      
      <div className="flex gap-1">
        {weeks.map((week, weekI) => (
          <div key={weekI} className="flex flex-col gap-1">
            {week.map((day, dayI) => (
              <div
                key={dayI}
                className={`w-3 h-3 rounded-sm ${getIntensity(day.count)}`}
                title={`${day.date}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4">
        <span className="text-xs text-gray-500 mr-2">Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-blue-900" />
        <div className="w-3 h-3 rounded-sm bg-blue-700" />
        <div className="w-3 h-3 rounded-sm bg-blue-500" />
        <div className="w-3 h-3 rounded-sm bg-blue-400" />
        <span className="text-xs text-gray-500 ml-2">More</span>
      </div>
    </Card>
  );
}

// Top Users List
interface TopUsersProps {
  users: {
    rank: number;
    address: string;
    ensName?: string;
    value: number;
    label: string;
  }[];
  title?: string;
}

export function TopUsersList({ users, title }: TopUsersProps) {
  return (
    <Card>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      
      <div className="space-y-3">
        {users.map((user) => {
          const shortAddress = `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;
          return (
            <div key={user.address} className="flex items-center gap-3">
              <span className="w-6 text-gray-500 text-sm font-medium">
                #{user.rank}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                {user.address.slice(2, 4).toUpperCase()}
              </div>
              <span className="flex-1 text-white truncate">
                {user.ensName || shortAddress}
              </span>
              <div className="text-right">
                <span className="text-white font-medium">{user.value}</span>
                <span className="text-gray-500 text-sm ml-1">{user.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default {
  StatsOverview,
  BarChart,
  ActivityTimeline,
  DonutChart,
  Sparkline,
  StatCardWithChart,
  Heatmap,
  TopUsersList,
};

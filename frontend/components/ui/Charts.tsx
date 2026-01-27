"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  animated?: boolean;
  horizontal?: boolean;
  gradient?: boolean;
  className?: string;
}

/**
 * BarChart - Simple bar chart visualization
 */
export function BarChart({
  data,
  height = 200,
  showLabels = true,
  showValues = true,
  animated = true,
  horizontal = false,
  gradient = true,
  className = "",
}: BarChartProps) {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef<HTMLDivElement>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  if (horizontal) {
    return (
      <div ref={chartRef} className={`space-y-3 ${className}`}>
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              {showLabels && (
                <span className="text-sm text-gray-400">{item.label}</span>
              )}
              {showValues && (
                <span className="text-sm font-medium text-white">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-1000 ease-out
                  ${gradient
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                    : ""
                  }
                `}
                style={{
                  width: isVisible ? `${(item.value / maxValue) * 100}%` : "0%",
                  backgroundColor: !gradient ? (item.color || "#3b82f6") : undefined,
                  transitionDelay: animated ? `${index * 100}ms` : "0ms",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={chartRef} className={className}>
      <div
        className="flex items-end justify-between gap-2"
        style={{ height }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center"
          >
            {showValues && (
              <span className="text-xs text-gray-400 mb-1">
                {item.value.toLocaleString()}
              </span>
            )}
            <div
              className={`
                w-full rounded-t-lg transition-all duration-1000 ease-out
                ${gradient
                  ? "bg-gradient-to-t from-blue-600 to-cyan-400"
                  : ""
                }
              `}
              style={{
                height: isVisible
                  ? `${(item.value / maxValue) * (height - 40)}px`
                  : "0px",
                backgroundColor: !gradient ? (item.color || "#3b82f6") : undefined,
                transitionDelay: animated ? `${index * 100}ms` : "0ms",
              }}
            />
          </div>
        ))}
      </div>

      {showLabels && (
        <div className="flex justify-between gap-2 mt-2">
          {data.map((item, index) => (
            <span
              key={index}
              className="flex-1 text-xs text-gray-500 text-center truncate"
            >
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * LineChart - Simple line chart with SVG
 */
interface LineChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  showDots?: boolean;
  showArea?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  color?: string;
  className?: string;
}

export function LineChart({
  data,
  width = 400,
  height = 200,
  showDots = true,
  showArea = true,
  showGrid = true,
  animated = true,
  color = "#3b82f6",
  className = "",
}: LineChartProps) {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef<SVGSVGElement>(null);

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = useMemo(() => {
    return data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
      value: d.value,
      label: d.label,
    }));
  }, [data, chartWidth, chartHeight, minValue, range, padding]);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${padding.top + chartHeight}
    L ${points[0].x} ${padding.top + chartHeight}
    Z
  `;

  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <svg
      ref={chartRef}
      width={width}
      height={height}
      className={className}
    >
      {/* Grid lines */}
      {showGrid && (
        <g className="text-gray-700">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = padding.top + chartHeight * (1 - tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4,4"
                  opacity={0.3}
                />
                <text
                  x={padding.left - 8}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-gray-500"
                >
                  {Math.round(minValue + range * tick)}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* Area fill */}
      {showArea && (
        <path
          d={areaPath}
          fill={`url(#gradient-${color.replace("#", "")})`}
          opacity={isVisible ? 0.3 : 0}
          className="transition-opacity duration-1000"
        />
      )}

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={animated ? "1000" : "none"}
        strokeDashoffset={isVisible ? "0" : "1000"}
        className="transition-all duration-1500 ease-out"
      />

      {/* Dots */}
      {showDots &&
        points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            stroke="white"
            strokeWidth={2}
            opacity={isVisible ? 1 : 0}
            className="transition-opacity duration-500"
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}

      {/* X-axis labels */}
      {data.length <= 10 &&
        points.map((point, i) => (
          <text
            key={i}
            x={point.x}
            y={height - 8}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {point.label}
          </text>
        ))}

      {/* Gradient definition */}
      <defs>
        <linearGradient
          id={`gradient-${color.replace("#", "")}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * DonutChart - Donut/Pie chart visualization
 */
interface DonutChartProps {
  data: ChartDataPoint[];
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
  centerLabel?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 30,
  showLegend = true,
  centerLabel,
  animated = true,
  className = "",
}: DonutChartProps) {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef<HTMLDivElement>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const defaultColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#ec4899",
  ];

  let currentAngle = 0;
  const segments = data.map((d, i) => {
    const percentage = d.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...d,
      percentage,
      startAngle,
      endAngle: currentAngle,
      color: d.color || defaultColors[i % defaultColors.length],
    };
  });

  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={chartRef} className={`flex items-center gap-6 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {segments.map((segment, i) => {
            const offset = isVisible
              ? circumference * (1 - segment.percentage)
              : circumference;
            const rotation = (segment.startAngle / 360) * circumference;

            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  transform: `rotate(${segment.startAngle}deg)`,
                  transformOrigin: "50% 50%",
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            );
          })}
        </svg>

        {/* Center content */}
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            {centerLabel}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="space-y-2">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-400">{segment.label}</span>
              <span className="text-sm font-medium text-white">
                {Math.round(segment.percentage * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * SparkLine - Minimal line chart for inline display
 */
interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  className?: string;
}

export function SparkLine({
  data,
  width = 100,
  height = 30,
  color = "#3b82f6",
  showArea = true,
  className = "",
}: SparkLineProps) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const areaPath = `
    ${linePath}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  return (
    <svg width={width} height={height} className={className}>
      {showArea && (
        <path d={areaPath} fill={color} opacity={0.2} />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

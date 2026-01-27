'use client';

import React from 'react';

// Page Layout Component
interface PageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-8xl',
  full: 'max-w-full',
};

export function PageLayout({
  children,
  sidebar,
  header,
  footer,
  className = '',
  maxWidth = 'xl',
  padding = true,
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-950 ${className}`}>
      {header}
      <div className={`flex-1 ${maxWidthClasses[maxWidth]} mx-auto w-full ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}`}>
        {sidebar ? (
          <div className="flex gap-8 py-8">
            <aside className="w-64 flex-shrink-0 hidden lg:block">{sidebar}</aside>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        ) : (
          <main className="py-8">{children}</main>
        )}
      </div>
      {footer}
    </div>
  );
}

// Container Component
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Container({ children, size = 'xl', className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Grid Component
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ children, cols = 3, gap = 'md', className = '' }: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Stack Component
interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

export function Stack({
  children,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
}: StackProps) {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={`
        flex ${directionClass}
        ${gapClasses[gap]}
        ${alignClasses[align]}
        ${justifyClasses[justify]}
        ${wrap ? 'flex-wrap' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Split Panel Layout
interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1';
  reverse?: boolean;
  className?: string;
}

export function SplitPanel({ left, right, ratio = '1:1', reverse = false, className = '' }: SplitPanelProps) {
  const ratioClasses = {
    '1:1': ['flex-1', 'flex-1'],
    '1:2': ['w-1/3', 'w-2/3'],
    '2:1': ['w-2/3', 'w-1/3'],
    '1:3': ['w-1/4', 'w-3/4'],
    '3:1': ['w-3/4', 'w-1/4'],
  };

  const [leftClass, rightClass] = ratioClasses[ratio];

  return (
    <div className={`flex flex-col lg:flex-row gap-8 ${reverse ? 'lg:flex-row-reverse' : ''} ${className}`}>
      <div className={`${leftClass}`}>{left}</div>
      <div className={`${rightClass}`}>{right}</div>
    </div>
  );
}

// Hero Section Layout
interface HeroLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
  overlay?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'full';
  centered?: boolean;
  className?: string;
}

export function HeroLayout({
  children,
  backgroundImage,
  overlay = true,
  height = 'md',
  centered = true,
  className = '',
}: HeroLayoutProps) {
  const heightClasses = {
    sm: 'min-h-[40vh]',
    md: 'min-h-[60vh]',
    lg: 'min-h-[80vh]',
    full: 'min-h-screen',
  };

  return (
    <div
      className={`
        relative ${heightClasses[height]}
        ${centered ? 'flex items-center justify-center' : ''}
        ${className}
      `}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-gray-950/80" />
      )}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

// Masonry Layout
interface MasonryLayoutProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: number;
  className?: string;
}

export function MasonryLayout({ children, columns = 3, gap = 24, className = '' }: MasonryLayoutProps) {
  return (
    <div
      className={className}
      style={{
        columnCount: columns,
        columnGap: gap,
      }}
    >
      {React.Children.map(children, (child) => (
        <div style={{ breakInside: 'avoid', marginBottom: gap }}>
          {child}
        </div>
      ))}
    </div>
  );
}

// Sidebar Layout
interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function SidebarLayout({
  sidebar,
  children,
  sidebarPosition = 'left',
  sidebarWidth = 'md',
  collapsible = false,
  isCollapsed = false,
  onToggle,
  className = '',
}: SidebarLayoutProps) {
  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };

  return (
    <div className={`flex ${sidebarPosition === 'right' ? 'flex-row-reverse' : ''} ${className}`}>
      <aside
        className={`
          flex-shrink-0 bg-gray-900 border-r border-gray-800
          transition-all duration-300
          ${isCollapsed ? 'w-16' : widthClasses[sidebarWidth]}
          hidden lg:block
        `}
      >
        {collapsible && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {sidebar}
      </aside>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}

// Centered Content Layout
interface CenteredLayoutProps {
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CenteredLayout({ children, width = 'md', className = '' }: CenteredLayoutProps) {
  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${className}`}>
      <div className={`w-full ${widthClasses[width]}`}>
        {children}
      </div>
    </div>
  );
}

// Scroll Container
interface ScrollContainerProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export function ScrollContainer({ children, maxHeight = '400px', className = '' }: ScrollContainerProps) {
  return (
    <div
      className={`overflow-y-auto custom-scrollbar ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}

// Sticky Header Layout
interface StickyHeaderLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  headerHeight?: number;
  className?: string;
}

export function StickyHeaderLayout({ 
  header, 
  children, 
  headerHeight = 64,
  className = '' 
}: StickyHeaderLayoutProps) {
  return (
    <div className={className}>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800"
        style={{ height: headerHeight }}
      >
        {header}
      </header>
      <main style={{ paddingTop: headerHeight }}>
        {children}
      </main>
    </div>
  );
}

export default {
  PageLayout,
  Container,
  Grid,
  Stack,
  SplitPanel,
  HeroLayout,
  MasonryLayout,
  SidebarLayout,
  CenteredLayout,
  ScrollContainer,
  StickyHeaderLayout,
};

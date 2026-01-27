"use client";

import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export function HeroSection({ title, subtitle, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Logo Animation */}
      <div className="relative w-24 h-24 mx-auto mb-8 animate-float">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50" />
        <Image
          src="/icon-512.png"
          alt="BaseActions Hub"
          fill
          className="relative rounded-3xl"
        />
      </div>

      <h1 className="text-5xl md:text-7xl font-bold mb-6">{title}</h1>

      <p className="text-xl text-gray-400 mb-8 leading-relaxed">{subtitle}</p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <Link href={primaryCta.href} className="btn-primary text-lg py-4 px-8">
          <span>{primaryCta.label}</span>
        </Link>
        {secondaryCta && (
          <Link href={secondaryCta.href} className="btn-secondary text-lg py-4 px-8">
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

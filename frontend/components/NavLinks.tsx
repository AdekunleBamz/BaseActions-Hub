"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/navigation";

interface NavLinksProps {
  variant?: "desktop" | "mobile";
}

export function NavLinks({ variant = "desktop" }: NavLinksProps) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav className="flex md:hidden items-center justify-center gap-1 mt-3 pt-3 border-t border-white/5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname === link.href
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="mr-1">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            pathname === link.href
              ? "bg-blue-500/20 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="mr-1.5">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

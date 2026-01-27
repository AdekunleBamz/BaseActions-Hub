"use client";

import { SignatureCard } from "./SignatureCard";
import { SignatureCardSkeleton } from "./ui/Skeleton";
import { EmptyState } from "./EmptyState";
import type { Signature } from "@/types";

interface SignatureListProps {
  signatures?: Signature[];
  isLoading?: boolean;
  guestbookAddress?: string;
}

export function SignatureList({ signatures, isLoading, guestbookAddress }: SignatureListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <SignatureCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!signatures || signatures.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No signatures yet"
        description="Be the first to sign this guestbook!"
        action={
          guestbookAddress
            ? { label: "✍️ Sign First", href: `/sign?owner=${guestbookAddress}` }
            : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {[...signatures].reverse().map((sig, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <SignatureCard signature={sig} />
        </div>
      ))}
    </div>
  );
}

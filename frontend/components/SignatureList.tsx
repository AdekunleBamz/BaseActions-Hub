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
      <div 
        className="space-y-4"
        role="status"
        aria-label="Loading signatures"
        aria-busy="true"
      >
        {[...Array(3)].map((_, i) => (
          <SignatureCardSkeleton key={i} />
        ))}
        <span className="sr-only">Loading signatures...</span>
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
    <section 
      className="space-y-4"
      aria-label={`${signatures.length} signature${signatures.length !== 1 ? 's' : ''}`}
    >
      <h2 className="sr-only">Signatures ({signatures.length})</h2>
      {[...signatures].reverse().map((sig, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <SignatureCard signature={sig} />
        </div>
      ))}
    </section>
  );
}

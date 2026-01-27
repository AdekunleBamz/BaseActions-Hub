"use client";

import Link from "next/link";
import { Avatar } from "./ui/Avatar";
import { formatAddress } from "@/lib/format";
import { formatRelativeTime } from "@/lib/time";
import type { Signature } from "@/types";

interface SignatureCardProps {
  signature: Signature;
  showGuestbookLink?: boolean;
}

export function SignatureCard({ signature, showGuestbookLink = true }: SignatureCardProps) {
  return (
    <article 
      className="signature-card group"
      aria-label={`Signature from ${formatAddress(signature.signer)}`}
    >
      <div className="flex items-start justify-between mb-3">
        {showGuestbookLink ? (
          <Link
            href={`/guestbook/${signature.signer}`}
            className="flex items-center gap-2 group/link rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            aria-label={`View guestbook for ${formatAddress(signature.signer)}`}
          >
            <Avatar address={signature.signer} size="md" />
            <span className="font-mono text-sm text-blue-400 group-hover/link:text-blue-300 transition">
              {formatAddress(signature.signer)}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar address={signature.signer} size="md" />
            <span className="font-mono text-sm text-blue-400">
              {formatAddress(signature.signer)}
            </span>
          </div>
        )}
        <time 
          className="text-xs text-gray-500"
          dateTime={new Date(signature.timestamp * 1000).toISOString()}
          title={new Date(signature.timestamp * 1000).toLocaleString()}
        >
          {formatRelativeTime(signature.timestamp)}
        </time>
      </div>
      <p className="text-white text-lg leading-relaxed">{signature.message}</p>
    </article>
  );
}

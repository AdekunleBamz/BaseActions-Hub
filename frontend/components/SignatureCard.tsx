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
    <div className="signature-card group">
      <div className="flex items-start justify-between mb-3">
        {showGuestbookLink ? (
          <Link
            href={`/guestbook/${signature.signer}`}
            className="flex items-center gap-2 group/link"
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
        <span className="text-xs text-gray-500">
          {formatRelativeTime(signature.timestamp)}
        </span>
      </div>
      <p className="text-white text-lg leading-relaxed">{signature.message}</p>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/Layout";
import {
  AddressDisplay,
  PageHeader,
  ShareGuestbook,
  SignatureList,
  StatsGrid,
} from "@/components";
import { useGuestbook } from "@/hooks";
import type { Signature } from "@/types";

export default function GuestbookPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const { signatureCount, signatures, ownerStats, isLoading } = useGuestbook(address);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header Section */}
        <PageHeader
          icon="📖"
          title="Guestbook"
          badge={<AddressDisplay address={address} />}
          gradient="from-purple-500 to-pink-500"
        />

        {/* Stats Row */}
        <StatsGrid
          columns={4}
          stats={[
            {
              value: signatureCount?.toString() || "0",
              label: "Signatures",
              icon: "✍️",
              color: "purple",
            },
            {
              value: ownerStats?.totalPoints?.toString() || "0",
              label: "Points",
              icon: "⭐",
              color: "blue",
            },
            {
              value: ownerStats?.signaturesGiven?.toString() || "0",
              label: "Given",
              icon: "📤",
              color: "cyan",
            },
            {
              value: ownerStats?.currentStreak?.toString() || "0",
              label: "Streak",
              icon: "🔥",
              color: "orange",
            },
          ]}
        />

        {/* Sign CTA */}
        <div className="glass rounded-2xl p-6 mb-10 text-center">
          <p className="text-gray-400 mb-4">Leave your mark on this guestbook!</p>
          <Link href={`/sign?owner=${address}`} className="btn-primary inline-block py-3 px-8">
            <span>✍️ Sign this Guestbook</span>
          </Link>
        </div>

        {/* Signatures List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Recent Signatures
            </h2>
            <span className="badge badge-purple">
              {signatureCount?.toString() || "0"} total
            </span>
          </div>

          <SignatureList
            signatures={signatures as Signature[] | undefined}
            isLoading={isLoading}
            guestbookAddress={address}
          />
        </div>

        {/* Share Section */}
        <ShareGuestbook address={address} />
      </div>
    </PageWrapper>
  );
}

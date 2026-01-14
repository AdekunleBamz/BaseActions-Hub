"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";

interface ShareGuestbookProps {
  address: string;
}

export function ShareGuestbook({ address }: ShareGuestbookProps) {
  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/guestbook/${address}` 
    : `/guestbook/${address}`;

  return (
    <div className="gradient-border rounded-2xl p-8 text-center">
      <div className="text-3xl mb-4">📣</div>
      <h3 className="text-xl font-bold text-white mb-2">Share Your Guestbook</h3>
      <p className="text-gray-400 mb-4">Let others sign your on-chain guestbook</p>
      <div className="glass rounded-xl p-4 max-w-xl mx-auto">
        <code className="text-sm text-blue-400 break-all">{shareUrl}</code>
      </div>
      <CopyButton
        text={shareUrl}
        label="Copy Link 📋"
        copiedLabel="Copied! ✓"
        className="mt-4 btn-secondary py-2 px-6 text-sm"
      />
    </div>
  );
}

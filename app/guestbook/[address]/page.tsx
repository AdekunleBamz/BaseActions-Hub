"use client";

import { use } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import Link from "next/link";
import { CONTRACTS } from "@/config/contracts";
import { GuestbookABI } from "@/config/abis";

export default function GuestbookPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);

  const { data: signatureCount } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "signatureCount",
    args: [address as `0x${string}`],
  });

  const { data: signatures } = useReadContract({
    address: CONTRACTS.Guestbook,
    abi: GuestbookABI,
    functionName: "getSignatures",
    args: [address as `0x${string}`, BigInt(0), BigInt(50)],
  });

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            ⚡ BaseActions
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Guestbook Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-white mb-2">Guestbook</h1>
          <p className="text-gray-400 font-mono text-sm">{formatAddress(address)}</p>
          <p className="text-blue-400 mt-2">
            {signatureCount?.toString() || "0"} signatures
          </p>
        </div>

        {/* Sign Button */}
        <div className="text-center mb-8">
          <Link
            href={`/sign?owner=${address}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition"
          >
            ✍️ Sign this Guestbook
          </Link>
        </div>

        {/* Signatures */}
        <div className="space-y-4">
          {signatures && signatures.length > 0 ? (
            [...signatures].reverse().map((sig, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-blue-400 font-mono text-sm">
                    {formatAddress(sig.signer)}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatTime(sig.timestamp)}
                  </span>
                </div>
                <p className="text-white text-lg">{sig.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <p>No signatures yet. Be the first!</p>
            </div>
          )}
        </div>

        {/* Share */}
        <div className="mt-12 bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30 text-center">
          <p className="text-blue-400 mb-2">📣 Share this guestbook:</p>
          <code className="text-sm text-gray-300 bg-gray-800 px-4 py-2 rounded-lg block overflow-x-auto">
            {typeof window !== "undefined" ? window.location.href : ""}
          </code>
        </div>
      </div>
    </main>
  );
}

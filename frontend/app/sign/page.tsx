"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { PageWrapper } from "@/components/Layout";
import {
  ConnectWalletPrompt,
  InfoBox,
  Input,
  PageHeader,
  QuickMessages,
  SignSuccessState,
  Textarea,
} from "@/components";
import { useSignGuestbook } from "@/hooks";
import { MESSAGE_MAX_LENGTH, MESSAGE_MIN_LENGTH } from "@/config/messages";
import { isValidAddress, isValidMessage } from "@/lib/validation";

function SignForm() {
  const { isConnected, address } = useAccount();
  const searchParams = useSearchParams();
  const [guestbookOwner, setGuestbookOwner] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Pre-fill owner from URL query param
  useEffect(() => {
    const owner = searchParams.get("owner");
    if (owner) {
      setGuestbookOwner(owner);
    }
  }, [searchParams]);

  const {
    signGuestbook,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useSignGuestbook();

  const handleSign = () => {
    if (!guestbookOwner || !message) return;
    signGuestbook(guestbookOwner, message);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(guestbookOwner);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addressError = guestbookOwner && !isValidAddress(guestbookOwner)
    ? "Enter a valid 0x address"
    : "";

  const messageError = message && !isValidMessage(message, MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH)
    ? `Message must be ${MESSAGE_MIN_LENGTH}-${MESSAGE_MAX_LENGTH} characters`
    : "";

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <PageHeader
        icon="✍️"
        title="Sign a Guestbook"
        description="Leave your mark on-chain for just 0.0001 ETH"
      />

      {!isConnected ? (
        <ConnectWalletPrompt
          title="Connect Your Wallet"
          description="Connect your wallet to start signing guestbooks"
        />
      ) : isSuccess ? (
        <SignSuccessState
          hash={hash}
          guestbookOwner={guestbookOwner}
          onReset={() => {
            reset();
            setMessage("");
          }}
        />
      ) : (
        /* Sign Form */
        <div className="space-y-6">
          {/* Guestbook Owner Input */}
          <div className="glass rounded-2xl p-6">
            <div className="relative">
              <Input
                label="Guestbook Owner Address"
                placeholder="0x..."
                value={guestbookOwner}
                onChange={(e) => setGuestbookOwner(e.target.value)}
                className="pr-24"
                error={addressError || undefined}
              />
              {guestbookOwner && (
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:text-white transition"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {address && (
                <button onClick={() => setGuestbookOwner(address)} className="pill text-xs">
                  📍 Use my address
                </button>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="glass rounded-2xl p-6">
            <Textarea
              label="Your Message"
              placeholder="Write something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX_LENGTH))}
              rows={4}
              maxLength={MESSAGE_MAX_LENGTH}
              showCount
              error={messageError || undefined}
            />

            <QuickMessages onSelect={setMessage} />
          </div>

          {/* Sign Button */}
          <button
            onClick={handleSign}
            disabled={!guestbookOwner || !message || !!addressError || !!messageError || isPending || isConfirming}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Confirm in wallet...
                </>
              ) : isConfirming ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing...
                </>
              ) : (
                <>Sign Guestbook (0.0001 ETH) ✍️</>
              )}
            </span>
          </button>

          {error && (
            <InfoBox icon="❌" variant="error">
              <p>{error.message.slice(0, 100)}</p>
            </InfoBox>
          )}

          <InfoBox icon="💡">
            <p>
              <span className="text-green-400">90%</span> goes to the guestbook owner
            </p>
            <p>
              <span className="text-blue-400">10%</span> platform fee
            </p>
            <p className="text-purple-400 mt-1">First signature earns you a SIGNER badge! 🏅</p>
          </InfoBox>
        </div>
      )}
    </div>
  );
}

export default function SignPage() {
  return (
    <PageWrapper>
      <Suspense fallback={
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800 animate-pulse" />
            <div className="h-8 w-48 mx-auto bg-gray-800 rounded animate-pulse mb-3" />
            <div className="h-4 w-64 mx-auto bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      }>
        <SignForm />
      </Suspense>
    </PageWrapper>
  );
}

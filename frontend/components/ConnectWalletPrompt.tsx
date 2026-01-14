"use client";

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
}

export function ConnectWalletPrompt({
  title = "Connect Your Wallet",
  description = "Connect your wallet to continue",
}: ConnectWalletPromptProps) {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <div className="text-5xl mb-4">🔗</div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6">{description}</p>
      <div className="badge badge-blue">Supports MetaMask, Coinbase, and more</div>
    </div>
  );
}

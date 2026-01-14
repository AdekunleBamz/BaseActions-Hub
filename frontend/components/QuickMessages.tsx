"use client";

import { QUICK_MESSAGES } from "@/config/messages";

interface QuickMessageProps {
  emoji: string;
  text: string;
  onClick: () => void;
}

export function QuickMessage({ emoji, text, onClick }: QuickMessageProps) {
  return (
    <button
      onClick={onClick}
      className="pill text-xs hover:scale-105 transition-transform"
    >
      {emoji} {text}
    </button>
  );
}

interface QuickMessagesProps {
  onSelect: (message: string) => void;
}

export function QuickMessages({ onSelect }: QuickMessagesProps) {
  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 mb-3">Quick messages:</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_MESSAGES.map((msg) => (
          <QuickMessage
            key={msg.text}
            emoji={msg.emoji}
            text={msg.text}
            onClick={() => onSelect(`${msg.emoji} ${msg.text}`)}
          />
        ))}
      </div>
    </div>
  );
}

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
      type="button"
      onClick={onClick}
      className="pill text-xs hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      aria-label={`Use quick message: ${text}`}
    >
      <span aria-hidden="true">{emoji}</span> {text}
    </button>
  );
}

interface QuickMessagesProps {
  onSelect: (message: string) => void;
}

export function QuickMessages({ onSelect }: QuickMessagesProps) {
  return (
    <fieldset className="mt-4 border-0 p-0">
      <legend className="text-xs text-gray-500 mb-3">Quick messages:</legend>
      <div 
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Quick message options"
      >
        {QUICK_MESSAGES.map((msg) => (
          <QuickMessage
            key={msg.text}
            emoji={msg.emoji}
            text={msg.text}
            onClick={() => onSelect(`${msg.emoji} ${msg.text}`)}
          />
        ))}
      </div>
    </fieldset>
  );
}

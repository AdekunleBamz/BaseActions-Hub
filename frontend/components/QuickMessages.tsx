"use client";

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
  const messages = [
    { emoji: "🔥", text: "Great vibes!" },
    { emoji: "⚡", text: "Based and pilled" },
    { emoji: "🚀", text: "To the moon!" },
    { emoji: "💎", text: "Diamond hands" },
    { emoji: "👋", text: "Hello from Base!" },
    { emoji: "🎉", text: "Keep building!" },
    { emoji: "💙", text: "Love this!" },
    { emoji: "🌟", text: "You're awesome!" },
  ];

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 mb-3">Quick messages:</p>
      <div className="flex flex-wrap gap-2">
        {messages.map((msg) => (
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

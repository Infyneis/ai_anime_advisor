"use client";

import { Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isLoading?: boolean;
}

export function ChatBubble({ message, isLoading = false }: ChatBubbleProps) {
  return (
    <div className="flex gap-3 items-start animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-anime-pink/20 border border-anime-pink/50 flex items-center justify-center">
        <Bot className="w-5 h-5 text-anime-pink" />
      </div>
      <div className="glass rounded-2xl rounded-tl-none px-4 py-3 max-w-lg">
        {isLoading ? (
          <div className="typing-indicator">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <p className="text-sm text-foreground/90 leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}

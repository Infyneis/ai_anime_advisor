"use client";

import { cn } from "@/lib/utils";

interface KeywordCloudProps {
  keywords: string[];
  selectedKeywords: string[];
  onToggle: (keyword: string) => void;
  disabled?: boolean;
}

export function KeywordCloud({
  keywords,
  selectedKeywords,
  onToggle,
  disabled = false,
}: KeywordCloudProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {keywords.map((keyword, index) => {
        const isSelected = selectedKeywords.includes(keyword);
        return (
          <button
            key={keyword}
            onClick={() => onToggle(keyword)}
            disabled={disabled}
            className={cn(
              "keyword-chip animate-fade-in",
              isSelected && "selected",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards",
            }}
          >
            {keyword}
          </button>
        );
      })}
    </div>
  );
}

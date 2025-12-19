import type { AnimeDetail, ChatResponse, KeywordResponse, RecommendResponse } from "@/types/anime";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendChatMessage(message: string, selectedKeywords: string[]): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, selected_keywords: selectedKeywords }),
  });

  if (!response.ok) {
    throw new Error("Failed to send chat message");
  }

  return response.json();
}

export async function getSuggestions(keywords: string[]): Promise<KeywordResponse> {
  const response = await fetch(`${API_BASE}/api/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords }),
  });

  if (!response.ok) {
    throw new Error("Failed to get suggestions");
  }

  return response.json();
}

export async function getRecommendations(keywords: string[]): Promise<RecommendResponse> {
  const response = await fetch(`${API_BASE}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendations");
  }

  return response.json();
}

export async function getAnimeDetails(malId: number): Promise<AnimeDetail> {
  const response = await fetch(`${API_BASE}/api/anime/${malId}`);

  if (!response.ok) {
    throw new Error("Failed to get anime details");
  }

  return response.json();
}

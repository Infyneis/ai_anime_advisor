export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeStudio {
  mal_id: number;
  name: string;
}

export interface AnimeRecommendation {
  title: string;
  mal_id: number | null;
  reason: string;
  image_url: string | null;
  score: number | null;
}

export interface AnimeDetail {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  synopsis: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  episodes: number | null;
  status: string | null;
  aired: string | null;
  duration: string | null;
  rating: string | null;
  genres: AnimeGenre[];
  studios: AnimeStudio[];
  image_url: string | null;
  trailer_url: string | null;
}

export interface KeywordResponse {
  suggestions: string[];
  message: string;
}

export interface RecommendResponse {
  anime: AnimeRecommendation[];
  message: string;
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
  ready_for_recommendations: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type AppPhase = "selecting" | "loading" | "results";

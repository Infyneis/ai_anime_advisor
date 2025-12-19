"use client";

import { useState, useCallback } from "react";
import { Sparkles, RotateCcw, Wand2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { KeywordCloud } from "@/components/keyword-cloud";
import { AnimeCard } from "@/components/anime-card";
import { AnimeDrawer } from "@/components/anime-drawer";
import { ChatBubble } from "@/components/chat-bubble";
import { ChatInput } from "@/components/chat-input";
import { SakuraBg } from "@/components/sakura-bg";
import { getSuggestions, getRecommendations, getAnimeDetails, sendChatMessage } from "@/lib/api";
import type { AnimeDetail, AnimeRecommendation, AppPhase, ChatMessage } from "@/types/anime";

const INITIAL_MESSAGE = "Welcome! I'm your AI Anime Advisor. Tell me what kind of anime you're looking for, or select some genres below to get started!";
const MIN_SELECTIONS_FOR_RECOMMEND = 3;

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("selecting");
  const [message, setMessage] = useState(INITIAL_MESSAGE);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [keywords, setKeywords] = useState<string[]>([
    "Action", "Romance", "Comedy", "Drama", "Fantasy", "Sci-Fi",
    "Slice of Life", "Horror", "Mystery", "Sports", "Mecha", "Psychological",
  ]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeywordToggle = useCallback((keyword: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((k) => k !== keyword);
      }
      return [...prev, keyword];
    });
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    // Add user message to history
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, selectedKeywords);

      // Add AI response to history
      setChatHistory((prev) => [...prev, { role: "assistant", content: response.reply }]);
      setMessage(response.reply);

      // Add new suggestions to keywords (without duplicates)
      if (response.suggestions.length > 0) {
        const newKeywords = response.suggestions.filter(
          (k) => !selectedKeywords.includes(k) && !keywords.includes(k)
        );
        if (newKeywords.length > 0) {
          setKeywords((prev) => [...newKeywords, ...prev].slice(0, 12));
        }

        // Auto-select suggested keywords from the chat
        const toSelect = response.suggestions.filter(
          (k) => !selectedKeywords.includes(k)
        );
        if (toSelect.length > 0) {
          setSelectedKeywords((prev) => [...prev, ...toSelect.slice(0, 3)]);
        }
      }

      // If ready for recommendations, show a hint
      if (response.ready_for_recommendations) {
        setMessage(response.reply + " Click 'Get Recommendations' when you're ready!");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage("Oops! Something went wrong. Please try again.");
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Sorry, I had trouble processing that. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedKeywords, keywords]);

  const handleGetMoreSuggestions = useCallback(async () => {
    if (selectedKeywords.length === 0) return;

    setIsLoading(true);
    try {
      const response = await getSuggestions(selectedKeywords);
      setKeywords(response.suggestions);
      setMessage(response.message);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      setMessage("Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedKeywords]);

  const handleGetRecommendations = useCallback(async () => {
    if (selectedKeywords.length < MIN_SELECTIONS_FOR_RECOMMEND) {
      setMessage(`Please select at least ${MIN_SELECTIONS_FOR_RECOMMEND} keywords to get personalized recommendations!`);
      return;
    }

    setPhase("loading");
    setIsLoading(true);
    try {
      const response = await getRecommendations(selectedKeywords);
      setRecommendations(response.anime);
      setMessage(response.message);
      setPhase("results");
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      setMessage("Oops! Something went wrong. Please try again.");
      setPhase("selecting");
    } finally {
      setIsLoading(false);
    }
  }, [selectedKeywords]);

  const handleAnimeClick = useCallback(async (anime: AnimeRecommendation) => {
    if (!anime.mal_id) {
      setMessage("Sorry, I couldn't find more details for this anime.");
      return;
    }

    try {
      const details = await getAnimeDetails(anime.mal_id);
      setSelectedAnime(details);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Failed to get anime details:", error);
      setMessage("Couldn't load anime details. Please try again.");
    }
  }, []);

  const handleReset = useCallback(() => {
    setPhase("selecting");
    setMessage(INITIAL_MESSAGE);
    setChatHistory([]);
    setKeywords([
      "Action", "Romance", "Comedy", "Drama", "Fantasy", "Sci-Fi",
      "Slice of Life", "Horror", "Mystery", "Sports", "Mecha", "Psychological",
    ]);
    setSelectedKeywords([]);
    setRecommendations([]);
    setSelectedAnime(null);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SakuraBg />

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-anime-pink animate-pulse-slow" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              AI Anime Advisor
            </h1>
            <Sparkles className="w-8 h-8 text-anime-purple animate-pulse-slow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Discover your next favorite anime with AI-powered recommendations
          </p>
        </header>

        {/* Chat History */}
        {chatHistory.length > 0 && phase === "selecting" && (
          <div className="w-full max-w-2xl mb-4 space-y-3 max-h-48 overflow-y-auto">
            {chatHistory.slice(-4).map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 items-start animate-fade-in ${
                  msg.role === "user" ? "justify-end" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <ChatBubble message={msg.content} />
                )}
                {msg.role === "user" && (
                  <div className="flex gap-2 items-start">
                    <div className="glass rounded-2xl rounded-tr-none px-4 py-3 max-w-md">
                      <p className="text-sm text-foreground/90">{msg.content}</p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-anime-purple/20 border border-anime-purple/50 flex items-center justify-center">
                      <User className="w-5 h-5 text-anime-purple" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Current AI Message */}
        <div className="w-full max-w-2xl mb-6">
          <ChatBubble message={message} isLoading={isLoading && phase === "loading"} />
        </div>

        {/* Chat Input */}
        {phase === "selecting" && (
          <div className="w-full max-w-2xl mb-8">
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
              placeholder="Tell me what you're in the mood for..."
            />
          </div>
        )}

        {/* Content Area */}
        <div className="w-full max-w-4xl flex-1">
          {phase === "selecting" && (
            <div className="space-y-8 animate-fade-in">
              {/* Selected Keywords Display */}
              {selectedKeywords.length > 0 && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Your selections:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedKeywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => handleKeywordToggle(keyword)}
                        className="px-3 py-1 rounded-full text-sm bg-anime-pink/30 text-anime-pink border border-anime-pink/50 hover:bg-anime-pink/40 transition-colors cursor-pointer"
                      >
                        {keyword} ×
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Cloud */}
              <KeywordCloud
                keywords={keywords}
                selectedKeywords={selectedKeywords}
                onToggle={handleKeywordToggle}
                disabled={isLoading}
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleGetMoreSuggestions}
                  disabled={isLoading || selectedKeywords.length === 0}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  More Suggestions
                </Button>

                <Button
                  onClick={handleGetRecommendations}
                  disabled={isLoading || selectedKeywords.length < MIN_SELECTIONS_FOR_RECOMMEND}
                  className="gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Get Recommendations
                  {selectedKeywords.length < MIN_SELECTIONS_FOR_RECOMMEND && (
                    <span className="text-xs opacity-70">
                      ({MIN_SELECTIONS_FOR_RECOMMEND - selectedKeywords.length} more)
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {phase === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 border-4 border-anime-pink/30 border-t-anime-pink rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Finding perfect anime for you...</p>
            </div>
          )}

          {phase === "results" && (
            <div className="space-y-8 animate-fade-in">
              {/* Anime Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((anime, index) => (
                  <AnimeCard
                    key={anime.mal_id || anime.title}
                    anime={anime}
                    onClick={() => handleAnimeClick(anime)}
                    index={index}
                  />
                ))}
              </div>

              {/* Reset Button */}
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Ollama & Jikan API</p>
        </footer>
      </div>

      {/* Anime Detail Drawer */}
      <AnimeDrawer
        anime={selectedAnime}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </main>
  );
}

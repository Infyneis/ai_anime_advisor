"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AnimeRecommendation } from "@/types/anime";

interface AnimeCardProps {
  anime: AnimeRecommendation;
  onClick: () => void;
  index: number;
}

export function AnimeCard({ anime, onClick, index }: AnimeCardProps) {
  return (
    <Card
      className="anime-card cursor-pointer overflow-hidden group"
      onClick={onClick}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {anime.image_url ? (
          <Image
            src={anime.image_url}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-anime-card flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-transparent to-transparent" />

        {anime.score && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-anime-dark/80 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-white">
              {anime.score.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-white line-clamp-2 mb-2 group-hover:text-anime-pink transition-colors">
          {anime.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {anime.reason}
        </p>
      </CardContent>
    </Card>
  );
}

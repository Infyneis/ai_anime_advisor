"use client";

import Image from "next/image";
import { Star, Calendar, Clock, Film, Users, Trophy, TrendingUp } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AnimeDetail } from "@/types/anime";

interface AnimeDrawerProps {
  anime: AnimeDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AnimeDrawer({ anime, isOpen, onClose }: AnimeDrawerProps) {
  if (!anime) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        <ScrollArea className="h-full">
          <div className="relative">
            {anime.image_url && (
              <div className="relative h-80 w-full">
                <Image
                  src={anime.image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/50 to-transparent" />
              </div>
            )}

            <div className="p-6 space-y-6">
              <SheetHeader className="space-y-3">
                <SheetTitle className="text-2xl font-bold gradient-text">
                  {anime.title}
                </SheetTitle>
                {anime.title_japanese && (
                  <SheetDescription className="text-lg text-muted-foreground">
                    {anime.title_japanese}
                  </SheetDescription>
                )}
              </SheetHeader>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {anime.score && (
                  <StatCard
                    icon={<Star className="w-5 h-5 text-yellow-400" />}
                    label="Score"
                    value={anime.score.toFixed(2)}
                    subtext={anime.scored_by ? `${(anime.scored_by / 1000).toFixed(0)}K votes` : undefined}
                  />
                )}
                {anime.rank && (
                  <StatCard
                    icon={<Trophy className="w-5 h-5 text-anime-pink" />}
                    label="Rank"
                    value={`#${anime.rank}`}
                  />
                )}
                {anime.episodes && (
                  <StatCard
                    icon={<Film className="w-5 h-5 text-anime-purple" />}
                    label="Episodes"
                    value={anime.episodes.toString()}
                  />
                )}
                {anime.popularity && (
                  <StatCard
                    icon={<TrendingUp className="w-5 h-5 text-anime-blue" />}
                    label="Popularity"
                    value={`#${anime.popularity}`}
                  />
                )}
              </div>

              {/* Info Row */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {anime.status && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{anime.status}</span>
                  </div>
                )}
                {anime.aired && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{anime.aired}</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{anime.duration}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {anime.genres.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <Badge key={genre.mal_id} variant="anime">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Studios */}
              {anime.studios.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Studios
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map((studio) => (
                      <Badge key={studio.mal_id} variant="secondary">
                        {studio.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {anime.rating && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Rating</h4>
                  <p className="text-sm">{anime.rating}</p>
                </div>
              )}

              {/* Synopsis */}
              {anime.synopsis && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Synopsis</h4>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {anime.synopsis}
                  </p>
                </div>
              )}

              {/* Trailer */}
              {anime.trailer_url && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Trailer</h4>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={anime.trailer_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${anime.title} Trailer`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
}

function StatCard({ icon, label, value, subtext }: StatCardProps) {
  return (
    <div className="glass rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
    </div>
  );
}

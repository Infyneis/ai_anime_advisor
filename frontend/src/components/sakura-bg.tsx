"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function SakuraBg() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 6,
      size: 8 + Math.random() * 8,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-anime-dark via-[#1f1a2e] to-anime-dark" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 107, 157, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Sakura petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal animate-sakura"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

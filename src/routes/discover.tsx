import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MOODS, type MoodId } from "@/data/moods";
import { SongCard } from "@/components/SongCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — MeloMuse" },
      { name: "description", content: "Browse every song in the MeloMuse library, grouped by mood." },
      { property: "og:title", content: "Discover — MeloMuse" },
      { property: "og:description", content: "Browse every song by mood." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const [filter, setFilter] = useState<MoodId>("happy");
  const mood = MOODS.find((m) => m.id === filter)!;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-medium">Discover</h1>
      <p className="mt-2 text-muted-foreground">Browse the full library by mood.</p>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Moods">
        {MOODS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === filter}
            onClick={() => setFilter(m.id)}
            className={cn("rounded-full border px-4 py-2 text-sm transition hover:bg-secondary", m.id === filter && "glow bg-secondary")}
          >
            <span aria-hidden>{m.emoji}</span> {m.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mood.songs.map((s) => <SongCard key={s.id} song={s} />)}
      </div>
    </section>
  );
}

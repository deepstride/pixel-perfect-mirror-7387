import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { MOODS, type MoodId } from "@/data/moods";
import { SongCard } from "@/components/SongCard";
import { GenreChips } from "@/components/GenreChips";
import { searchItunes } from "@/lib/itunes";
import { buildQuery, explain, pickFresh, type GenreId } from "@/lib/recommend";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — MeloMuse" },
      { name: "description", content: "Search real songs, filter by mood and genre, and play 30-second previews." },
      { property: "og:title", content: "Discover — MeloMuse" },
      { property: "og:description", content: "Search songs by mood and genre with instant previews." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const [mood, setMood] = useState<MoodId>("calm");
  const [genre, setGenre] = useState<GenreId>("any");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [round, setRound] = useState(0);

  // Debounce the search field.
  useEffect(() => {
    const t = setTimeout(() => setSearch(input.trim()), 450);
    return () => clearTimeout(t);
  }, [input]);

  const term = search || buildQuery(mood, genre, round);
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["itunes", term],
    queryFn: async ({ signal }) => {
      const pool = await searchItunes(term, 60, signal);
      const picked = search ? pool.slice(0, 24) : pickFresh(pool, new Set(), 18);
      return search ? picked : picked.map((s, i) => ({ ...s, why: explain(mood, s, i) }));
    },
    staleTime: 5 * 60_000,
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-medium">Discover</h1>
      <p className="mt-2 text-muted-foreground">Search real songs or explore by mood and genre. Tap play for a 30-second preview.</p>

      <label className="glass mt-6 flex items-center gap-3 rounded-full px-5 focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="sr-only">Search songs or artists</span>
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search songs or artists…"
          className="min-h-12 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className={cn("mt-6 space-y-4 transition", search && "pointer-events-none opacity-40")} aria-disabled={!!search}>
        <div role="radiogroup" aria-label="Mood" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {MOODS.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={m.id === mood}
              onClick={() => { setMood(m.id); setRound(0); }}
              className={cn("min-h-10 shrink-0 rounded-full border px-4 text-sm transition hover:bg-secondary", m.id === mood && "glow bg-secondary")}
            >
              <span aria-hidden>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
        <GenreChips value={genre} onChange={(g) => { setGenre(g); setRound(0); }} />
      </div>
      {search && <p className="mt-3 text-sm text-muted-foreground">Showing search results — clear the search to use filters.</p>}

      <div aria-live="polite" className="mt-8">
        {isFetching && (
          <p className="flex items-center justify-center gap-2 py-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading songs…</p>
        )}
        {!isFetching && error && (
          <div role="alert" className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
            <p>We couldn't reach the music catalogue. Check your connection and try again.</p>
            <button onClick={() => refetch()} className="rounded-full border px-5 py-2 hover:bg-secondary">Retry</button>
          </div>
        )}
        {!isFetching && data?.length === 0 && (
          <p className="glass rounded-2xl p-8 text-center">No songs found. Try a different search or filter.</p>
        )}
        {!isFetching && data && data.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.map((s) => <SongCard key={s.id} song={s} />)}
            </div>
            {!search && (
              <div className="mt-8 flex justify-center">
                <button onClick={() => setRound((r) => r + 1)} className="min-h-12 rounded-full border px-6 font-medium hover:bg-secondary">Show different songs</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

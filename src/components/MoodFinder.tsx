import { useRef, useState } from "react";
import { Loader2, Sparkles, RefreshCw, Lightbulb, AlertTriangle } from "lucide-react";
import { MOODS, type MoodId, type Song } from "@/data/moods";
import { buildQuery, explain, pickFresh, randomActivity, recommend, type GenreId, BATCH_SIZE } from "@/lib/recommend";
import { searchItunes } from "@/lib/itunes";
import { SongCard } from "./SongCard";
import { GenreChips } from "./GenreChips";
import { cn } from "@/lib/utils";
import { MOOD_IMAGES } from "@/data/moodImages";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { status: "done"; songs: Song[]; activity: string; notice?: string };

export function MoodFinder() {
  const [mood, setMood] = useState<MoodId | null>(null);
  const [genre, setGenre] = useState<GenreId>("any");
  const [state, setState] = useState<State>({ status: "idle" });
  const seen = useRef(new Set<string>());
  const round = useRef(0);

  const reset = () => { seen.current = new Set(); round.current = Math.floor(Math.random() * 8); setState({ status: "idle" }); };

  const run = async () => {
    if (!mood) return;
    setState({ status: "loading" });
    let picked: Song[] = [];
    let failed = false;
    // Try up to 3 search phrases until we have a full, unseen, artist-diverse batch.
    for (let attempt = 0; attempt < 3 && picked.length < BATCH_SIZE; attempt++) {
      try {
        const pool = await searchItunes(buildQuery(mood, genre, round.current++));
        const fresh = pickFresh(pool, new Set([...seen.current, ...picked.map((s) => s.id)]), BATCH_SIZE - picked.length);
        const artists = new Set(picked.map((s) => s.artist.toLowerCase()));
        picked = [...picked, ...fresh.filter((s) => !artists.has(s.artist.toLowerCase()))];
      } catch {
        failed = true;
        break;
      }
    }
    if (failed && picked.length === 0) {
      const local = recommend(mood, [...seen.current]);
      local.songs.forEach((s) => seen.current.add(s.id));
      setState({ status: "done", ...local, notice: "We couldn't reach the music catalogue, so here are picks from our offline list (no previews)." });
      return;
    }
    if (picked.length === 0) return setState({ status: "empty" });
    picked.forEach((s) => seen.current.add(s.id));
    setState({
      status: "done",
      songs: picked.map((s, i) => ({ ...s, why: explain(mood, s, i) })),
      activity: randomActivity(mood),
    });
  };

  const current = MOODS.find((m) => m.id === mood);

  return (
    <section aria-labelledby="feel" className="mx-auto w-full max-w-6xl px-4">
      <h2 id="feel" className="text-center text-3xl font-medium sm:text-4xl">How are you feeling today?</h2>
      <div role="radiogroup" aria-labelledby="feel" className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {MOODS.map((m) => {
          const active = m.id === mood;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={active}
              onClick={() => { setMood(m.id); reset(); }}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden rounded-3xl border text-left transition duration-500 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-ring sm:aspect-[4/3]",
                active ? "glow scale-[1.02]" : "opacity-90 hover:opacity-100",
              )}
            >
              <img src={MOOD_IMAGES[m.id]} alt="" width={816} height={816} loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-5">
                <span className="text-2xl sm:text-3xl" aria-hidden>{m.emoji}</span>
                <span className="mt-1 block font-display text-xl font-semibold sm:text-2xl">{m.label}</span>
                <span className="block text-xs text-foreground/80 sm:text-sm">{m.blurb}</span>
              </div>
              {active && <span className="absolute right-3 top-3 rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Selected</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Pick a genre (optional)</p>
        <GenreChips value={genre} onChange={(g) => { setGenre(g); reset(); }} />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={run}
          disabled={!mood || state.status === "loading"}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-primary px-8 font-semibold text-primary-foreground glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Sparkles className="h-4 w-4" aria-hidden /> Find My Sound
        </button>
      </div>
      {!mood && <p className="mt-3 text-center text-sm text-muted-foreground">Pick a mood to begin.</p>}

      <div aria-live="polite" className="mt-10">
        {state.status === "loading" && (
          <p className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Finding songs for your mood…
          </p>
        )}
        {state.status === "empty" && (
          <div className="glass rounded-2xl p-8 text-center">
            <p>No new songs found for this mix. Try another genre, or start over.</p>
            <button onClick={() => { reset(); }} className="mt-4 rounded-full border px-5 py-2 hover:bg-secondary">Start over</button>
          </div>
        )}
        {state.status === "done" && current && (
          <div className="space-y-6">
            <div className="glow relative h-36 overflow-hidden rounded-3xl sm:h-48">
              <img src={MOOD_IMAGES[current.id]} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
              <h2 className="relative flex h-full items-end p-6 text-2xl font-medium sm:text-3xl">Your {current.label.toLowerCase()} soundtrack {current.emoji}</h2>
            </div>
            {state.notice && (
              <p role="status" className="flex items-start gap-2 rounded-2xl border border-destructive/40 p-4 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden /> {state.notice}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
              {state.songs.map((s) => <SongCard key={s.id} song={s} />)}
            </div>
            <div className="glass flex items-start gap-3 rounded-2xl p-5">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <p><span className="font-semibold">Try this: </span>{state.activity}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={run}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border px-6 font-medium transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
              >
                <RefreshCw className="h-4 w-4" aria-hidden /> Discover More
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

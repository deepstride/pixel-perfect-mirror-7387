import { useState } from "react";
import { Loader2, Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { MOODS, type MoodId, type Song } from "@/data/moods";
import { recommend } from "@/lib/recommend";
import { SongCard } from "./SongCard";
import { cn } from "@/lib/utils";
import { MOOD_IMAGES } from "@/data/moodImages";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; songs: Song[]; activity: string };

export function MoodFinder() {
  const [mood, setMood] = useState<MoodId | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });

  const run = (previous: string[] = []) => {
    if (!mood) return;
    setState({ status: "loading" });
    setTimeout(() => {
      try {
        setState({ status: "done", ...recommend(mood, previous) });
      } catch (e) {
        setState({ status: "error", message: (e as Error).message });
      }
    }, 600);
  };

  const current = MOODS.find((m) => m.id === mood);

  return (
    <section aria-labelledby="feel" className="mx-auto w-full max-w-6xl px-4">
      <h2 id="feel" className="text-center text-3xl font-medium sm:text-4xl">How are you feeling today?</h2>
      <div role="radiogroup" aria-labelledby="feel" className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {MOODS.map((m) => {
          const active = m.id === mood;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={active}
              onClick={() => { setMood(m.id); setState({ status: "idle" }); }}
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

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => run()}
          disabled={!mood || state.status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3.5 font-semibold text-primary-foreground glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Sparkles className="h-4 w-4" aria-hidden /> Find My Sound
        </button>
      </div>
      {!mood && <p className="mt-3 text-center text-sm text-muted-foreground">Pick a mood to begin.</p>}

      <div aria-live="polite" className="mt-10">
        {state.status === "loading" && (
          <p className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Tuning into your mood…
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="text-center text-destructive">Something went wrong: {state.message}</p>
        )}
        {state.status === "done" && current && (
          <div className="space-y-6">
            <div className="glow relative h-40 overflow-hidden rounded-3xl sm:h-52">
              <img src={MOOD_IMAGES[current.id]} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
              <h2 className="relative flex h-full items-end p-6 text-2xl font-medium sm:text-3xl">Your {current.label.toLowerCase()} soundtrack {current.emoji}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {state.songs.map((s) => <SongCard key={s.id} song={s} />)}
            </div>
            <div className="glass flex items-start gap-3 rounded-2xl p-5">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <p><span className="font-semibold">Try this: </span>{state.activity}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => run(state.songs.map((s) => s.id))}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-medium transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
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

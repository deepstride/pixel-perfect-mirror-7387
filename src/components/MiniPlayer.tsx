import { Pause, Play, X, Loader2, ExternalLink } from "lucide-react";
import { usePlayer, fmt } from "@/context/player";
import { songLink } from "@/data/moods";
import { Artwork } from "./Artwork";

export function MiniPlayer() {
  const { current, playing, loading, time, duration, error, toggle, seek, stop } = usePlayer();
  if (!current) return null;
  const dur = duration || 30;
  return (
    <div role="region" aria-label="Preview player" className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="glass glow mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-background/80 p-2.5 sm:gap-4 sm:p-3">
        <Artwork song={current} className="h-12 w-12 shrink-0 rounded-xl sm:h-14 sm:w-14" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{current.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {error ? <span className="text-destructive">{error}</span> : `${current.artist} · 30s preview`}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px] tabular-nums text-muted-foreground">
            <span>{fmt(time)}</span>
            <input
              type="range"
              min={0}
              max={dur}
              step={0.1}
              value={Math.min(time, dur)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek preview"
              className="h-1 min-w-0 flex-1 cursor-pointer accent-primary"
            />
            <span>{fmt(dur)}</span>
          </div>
        </div>
        <button
          onClick={() => toggle(current)}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-px" />}
        </button>
        <a href={songLink(current)} target="_blank" rel="noopener noreferrer" aria-label="Open full song (new tab)"
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary sm:grid">
          <ExternalLink className="h-4 w-4" />
        </a>
        <button onClick={stop} aria-label="Close player" className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

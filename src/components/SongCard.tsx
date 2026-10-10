import { Heart, ExternalLink, Play, Pause, Loader2 } from "lucide-react";
import { songLink, type Song } from "@/data/moods";
import { useFavourites } from "@/context/favourites";
import { usePlayer } from "@/context/player";
import { cn } from "@/lib/utils";
import { AddToPlaylist } from "./AddToPlaylist";
import { Artwork } from "./Artwork";

export function SongCard({ song, extra }: { song: Song; extra?: React.ReactNode }) {
  const { isFav, toggle: toggleFav } = useFavourites();
  const { current, playing, loading, toggle } = usePlayer();
  const fav = isFav(song.id);
  const isCurrent = current?.id === song.id;
  const isPlaying = isCurrent && playing;

  return (
    <article className="glass group flex min-w-0 flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] animate-in fade-in slide-in-from-bottom-2">
      <div className="relative aspect-square overflow-hidden">
        <Artwork song={song} className="h-full w-full transition duration-500 group-hover:scale-105" />
        {song.previewUrl ? (
          <button
            onClick={() => toggle(song)}
            aria-label={isPlaying ? `Pause preview of ${song.title}` : `Play preview of ${song.title}`}
            className={cn(
              "absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-lg transition duration-300",
              isCurrent ? "opacity-100" : "opacity-100 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            {isCurrent && loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-px" />}
          </button>
        ) : (
          <span className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">No preview available</span>
        )}
        {isPlaying && <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">Playing preview</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start gap-1">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-sans text-base font-semibold" title={song.title}>{song.title}</h3>
            <p className="truncate text-sm text-muted-foreground" title={song.artist}>{song.artist}</p>
          </div>
          <AddToPlaylist song={song} />
          <button
            onClick={() => toggleFav(song)}
            aria-pressed={fav}
            aria-label={fav ? `Remove ${song.title} from favourites` : `Add ${song.title} to favourites`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-secondary"
          >
            <Heart className={cn("h-5 w-5 transition", fav ? "scale-110 fill-accent text-accent" : "text-muted-foreground")} />
          </button>
        </div>
        {song.why && <p className="text-sm leading-relaxed text-foreground/80">{song.why}</p>}
        <a
          href={songLink(song)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-1 text-sm font-medium text-primary hover:underline"
        >
          {song.link ? "Open in Apple Music" : "Find on Spotify"} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only">(opens in new tab)</span>
        </a>
        {extra}
      </div>
    </article>
  );
}

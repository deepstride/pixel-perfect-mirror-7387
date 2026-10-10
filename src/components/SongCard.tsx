import { Heart, ExternalLink, Music2 } from "lucide-react";
import { songLink, type Song } from "@/data/moods";
import { useFavourites } from "@/context/favourites";
import { cn } from "@/lib/utils";
import { AddToPlaylist } from "./AddToPlaylist";

export function SongCard({ song, extra }: { song: Song; extra?: React.ReactNode }) {
  const { isFav, toggle } = useFavourites();
  const fav = isFav(song.id);
  return (
    <article className="glass flex flex-col gap-3 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
          <Music2 className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{song.title}</h3>
          <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
        </div>
        <AddToPlaylist songId={song.id} />
        <button
          onClick={() => toggle(song)}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${song.title} from favourites` : `Add ${song.title} to favourites`}
          className="shrink-0 rounded-full p-2 transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Heart className={cn("h-5 w-5", fav ? "fill-accent text-accent" : "text-muted-foreground")} />
        </button>
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{song.why}</p>
      <a
        href={songLink(song)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"
      >
        Listen on Spotify <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">(opens in new tab)</span>
      </a>
      {extra}
    </article>
  );
}

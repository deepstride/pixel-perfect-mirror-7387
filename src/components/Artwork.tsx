import { useState } from "react";
import { Music2 } from "lucide-react";
import type { Song } from "@/data/moods";
import { cn } from "@/lib/utils";

export function Artwork({ song, className }: { song: Song; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!song.artwork || failed)
    return (
      <div className={cn("grid place-items-center bg-gradient-primary text-primary-foreground", className)} aria-hidden>
        <Music2 className="h-1/3 w-1/3" />
      </div>
    );
  return (
    <img
      src={song.artwork}
      alt={`Album art for ${song.album ?? song.title}`}
      loading="lazy"
      width={400}
      height={400}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

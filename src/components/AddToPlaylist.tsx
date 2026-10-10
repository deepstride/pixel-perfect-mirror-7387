import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ListPlus, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { addSong, fetchPlaylists } from "@/lib/playlists";

export function AddToPlaylist({ songId }: { songId: string }) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: lists } = useQuery({
    queryKey: ["playlists", session?.user.id],
    queryFn: fetchPlaylists,
    enabled: !!session && open,
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Add to playlist"
        className="shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        <ListPlus className="h-5 w-5" />
      </button>
      {open && (
        <div className="glass absolute right-0 z-30 mt-1 w-52 rounded-xl p-2 text-sm shadow-xl">
          {!session ? (
            <Link to="/auth" className="block rounded-lg px-3 py-2 hover:bg-secondary">Sign in to make playlists</Link>
          ) : !lists ? (
            <p className="px-3 py-2 text-muted-foreground">Loading…</p>
          ) : lists.length === 0 ? (
            <Link to="/playlists" className="block rounded-lg px-3 py-2 hover:bg-secondary">Create your first playlist</Link>
          ) : (
            lists.map((p) => {
              const has = p.songIds.includes(songId);
              return (
                <button
                  key={p.id}
                  disabled={has}
                  onClick={async () => {
                    await addSong(p.id, songId);
                    qc.invalidateQueries({ queryKey: ["playlists"] });
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-secondary disabled:opacity-60"
                >
                  <span className="truncate">{p.name}</span>
                  {has && <Check className="h-4 w-4 text-primary" aria-label="added" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

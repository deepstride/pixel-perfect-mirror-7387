import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, ListMusic, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createPlaylist, deletePlaylist, fetchPlaylists, removeSong } from "@/lib/playlists";
import { findSong } from "@/data/moods";
import { SongCard } from "@/components/SongCard";

export const Route = createFileRoute("/playlists")({
  head: () => ({
    meta: [
      { title: "My Playlists — MeloMuse" },
      { name: "description", content: "Create and manage your own MeloMuse playlists." },
      { property: "og:title", content: "My Playlists — MeloMuse" },
      { property: "og:description", content: "Your personal mood playlists." },
    ],
  }),
  component: Playlists,
});

function Playlists() {
  const { session, ready } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["playlists", session?.user.id],
    queryFn: fetchPlaylists,
    enabled: !!session,
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["playlists"] });

  if (!ready) return null;
  if (!session)
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="glass rounded-3xl p-10">
          <ListMusic className="mx-auto h-10 w-10 text-primary" aria-hidden />
          <h1 className="mt-4 text-3xl font-medium">Your playlists</h1>
          <p className="mt-2 text-muted-foreground">Sign in to create playlists that stay saved.</p>
          <Link to="/auth" className="mt-6 inline-block rounded-full bg-gradient-primary px-6 py-2.5 font-semibold text-primary-foreground">Sign in</Link>
        </div>
      </section>
    );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-medium">My Playlists</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return;
          try { await createPlaylist(name.trim()); setName(""); setErr(null); refresh(); }
          catch { setErr("Couldn't create playlist. Please try again."); }
        }}
        className="mt-6 flex max-w-lg gap-2"
      >
        <label className="sr-only" htmlFor="pl-name">Playlist name</label>
        <input
          id="pl-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rainy evening"
          className="min-w-0 flex-1 rounded-full border bg-input/40 px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <button className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-primary px-5 font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" aria-hidden /> Create
        </button>
      </form>
      {err && <p role="alert" className="mt-2 text-sm text-destructive">{err}</p>}

      <div className="mt-10 space-y-10">
        {isLoading && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading playlists…</p>}
        {error && <p role="alert" className="text-destructive">Couldn't load playlists.</p>}
        {data?.length === 0 && <p className="text-muted-foreground">No playlists yet. Create one above, then add songs with the ➕ button on any song.</p>}
        {data?.map((p) => (
          <div key={p.id} className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="truncate text-2xl font-medium">{p.name} <span className="text-base text-muted-foreground">· {p.songIds.length} songs</span></h2>
              <button
                onClick={async () => { await deletePlaylist(p.id); refresh(); }}
                aria-label={`Delete playlist ${p.name}`}
                className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            {p.songIds.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Empty — find a song on <Link to="/" className="text-primary underline">Home</Link> or <Link to="/discover" className="text-primary underline">Discover</Link>.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.songIds.map((id) => {
                  const song = findSong(id);
                  if (!song) return null;
                  return (
                    <SongCard
                      key={id}
                      song={song}
                      extra={
                        <button
                          onClick={async () => { await removeSong(p.id, id); refresh(); }}
                          className="inline-flex items-center gap-1 self-start text-xs text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden /> Remove from playlist
                        </button>
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

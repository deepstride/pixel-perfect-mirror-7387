import type { Song } from "@/data/moods";

interface ItunesTrack {
  trackId: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
  kind?: string;
}

/** Search the public iTunes catalogue (free, no key, CORS-enabled). */
export async function searchItunes(term: string, limit = 50, signal?: AbortSignal): Promise<Song[]> {
  const url = `https://itunes.apple.com/search?${new URLSearchParams({
    term,
    media: "music",
    entity: "song",
    limit: String(limit),
    country: "US",
  })}`;
  const res = await fetch(url, signal ? { signal } : {});
  if (!res.ok) throw new Error(`Music catalogue unavailable (${res.status})`);
  const json = (await res.json()) as { results?: ItunesTrack[] };
  return (json.results ?? [])
    .filter((t) => t.kind === "song" && t.trackName && t.artistName)
    .map((t) => ({
      id: `it-${t.trackId}`,
      title: t.trackName!,
      artist: t.artistName!,
      album: t.collectionName,
      genre: t.primaryGenreName,
      artwork: t.artworkUrl100?.replace("100x100bb", "400x400bb"),
      previewUrl: t.previewUrl,
      link: t.trackViewUrl,
      why: "",
    }));
}

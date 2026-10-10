import { supabase } from "@/integrations/supabase/client";
import { findSong, type Song } from "@/data/moods";

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  songs: Song[];
}

export async function fetchPlaylists(): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select("id, name, playlist_songs(song_id, song, added_at)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    songIds: (p.playlist_songs ?? []).map((s) => s.song_id),
    songs: (p.playlist_songs ?? [])
      .map((s) => (s.song as unknown as Song | null) ?? findSong(s.song_id))
      .filter((s): s is Song => !!s),
  }));
}

export async function createPlaylist(name: string) {
  const { error } = await supabase.from("playlists").insert({ name });
  if (error) throw error;
}
export async function deletePlaylist(id: string) {
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) throw error;
}
export async function addSong(playlistId: string, song: Song) {
  const { error } = await supabase.from("playlist_songs").upsert(
    { playlist_id: playlistId, song_id: song.id, song: JSON.parse(JSON.stringify(song)) },
    { onConflict: "playlist_id,song_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}
export async function removeSong(playlistId: string, songId: string) {
  const { error } = await supabase.from("playlist_songs").delete().eq("playlist_id", playlistId).eq("song_id", songId);
  if (error) throw error;
}

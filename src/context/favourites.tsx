import { createContext, useContext, useState, type ReactNode } from "react";
import type { Song } from "@/data/moods";

/**
 * Session-only favourites (in memory). Swap this provider's internals for a
 * backend call later to make favourites persistent per user.
 */
interface FavCtx {
  favourites: Song[];
  isFav: (id: string) => boolean;
  toggle: (song: Song) => void;
}
const Ctx = createContext<FavCtx | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavs] = useState<Song[]>([]);
  const isFav = (id: string) => favourites.some((s) => s.id === id);
  const toggle = (song: Song) =>
    setFavs((f) => (f.some((s) => s.id === song.id) ? f.filter((s) => s.id !== song.id) : [...f, song]));
  return <Ctx.Provider value={{ favourites, isFav, toggle }}>{children}</Ctx.Provider>;
}

export function useFavourites() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFavourites must be inside FavouritesProvider");
  return c;
}

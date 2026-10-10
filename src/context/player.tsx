import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { Song } from "@/data/moods";

interface PlayerCtx {
  current: Song | null;
  playing: boolean;
  loading: boolean;
  time: number;
  duration: number;
  error: string | null;
  toggle: (song: Song) => void;
  seek: (t: number) => void;
  stop: () => void;
}
const Ctx = createContext<PlayerCtx | null>(null);

/** One shared <audio> element so only one 30-second preview plays at a time. */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Song | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    audio.current = a;
    const on = (e: string, f: () => void) => a.addEventListener(e, f);
    on("play", () => setPlaying(true));
    on("pause", () => setPlaying(false));
    on("waiting", () => setLoading(true));
    on("playing", () => setLoading(false));
    on("timeupdate", () => setTime(a.currentTime));
    on("loadedmetadata", () => setDuration(a.duration || 30));
    on("ended", () => { setPlaying(false); setTime(0); });
    on("error", () => { setLoading(false); setPlaying(false); setError("This preview couldn't be loaded."); });
    return () => { a.pause(); a.src = ""; };
  }, []);

  // Stop playback when the user leaves the page.
  useEffect(() => { stop(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (song: Song) => {
    const a = audio.current;
    if (!a || !song.previewUrl) return;
    if (current?.id === song.id) {
      if (a.paused) a.play().catch(() => setError("Playback was blocked by the browser."));
      else a.pause();
      return;
    }
    a.pause();
    setError(null);
    setTime(0);
    setDuration(0);
    setCurrent(song);
    setLoading(true);
    a.src = song.previewUrl;
    a.play().catch(() => { setLoading(false); setError("Playback was blocked by the browser."); });
  };
  const seek = (t: number) => { if (audio.current) audio.current.currentTime = t; };
  const stop = () => {
    const a = audio.current;
    if (a) { a.pause(); a.removeAttribute("src"); a.load(); }
    setCurrent(null);
    setPlaying(false);
    setLoading(false);
    setTime(0);
    setError(null);
  };

  return (
    <Ctx.Provider value={{ current, playing, loading, time, duration, error, toggle, seek, stop }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be inside PlayerProvider");
  return c;
}

export const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

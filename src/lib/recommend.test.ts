import { describe, it, expect } from "vitest";
import { recommend, pickFresh, buildQuery } from "./recommend";
import type { Song } from "@/data/moods";

const mk = (id: string, artist: string, title = id): Song => ({ id, artist, title, why: "" });

describe("recommendations", () => {
  it("fallback never repeats the previous batch", () => {
    for (let i = 0; i < 50; i++) {
      const first = recommend("calm").songs.map((s) => s.id);
      const next = recommend("calm", first).songs.map((s) => s.id);
      expect(next.some((id) => first.includes(id))).toBe(false);
    }
  });
  it("skips already-seen songs", () => {
    const pool = [mk("a", "A"), mk("b", "B"), mk("c", "C")];
    expect(pickFresh(pool, new Set(["a", "b"])).map((s) => s.id)).toEqual(["c"]);
  });
  it("picks at most one song per artist", () => {
    const pool = [mk("a", "Same"), mk("b", "Same"), mk("c", "Other")];
    expect(pickFresh(pool, new Set())).toHaveLength(2);
  });
  it("Discover More rounds use different search terms", () => {
    expect(buildQuery("happy", "pop", 0)).not.toBe(buildQuery("happy", "pop", 1));
  });
});

import { describe, it, expect } from "vitest";
import { recommend } from "./recommend";

describe("recommend", () => {
  it("returns 3 songs", () => {
    expect(recommend("happy").songs).toHaveLength(3);
  });
  it("never repeats the previous batch on Discover More", () => {
    for (let i = 0; i < 50; i++) {
      const first = recommend("calm").songs.map((s) => s.id);
      const next = recommend("calm", first).songs.map((s) => s.id);
      expect(next.some((id) => first.includes(id))).toBe(false);
    }
  });
});

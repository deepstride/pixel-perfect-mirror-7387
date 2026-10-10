import { getMood, type MoodId, type Song } from "@/data/moods";

export const BATCH_SIZE = 3;

/**
 * Pick a batch of songs for a mood that shares no songs with the previous batch.
 * `rand` is injectable for tests.
 */
export function recommend(
  moodId: MoodId,
  previousIds: string[] = [],
  rand: () => number = Math.random,
): { songs: Song[]; activity: string } {
  const mood = getMood(moodId);
  if (!mood) throw new Error(`Unknown mood: ${moodId}`);
  const fresh = mood.songs.filter((s) => !previousIds.includes(s.id));
  const pool = [...fresh];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = t;
  }
  const activity = mood.activities[Math.floor(rand() * mood.activities.length)] ?? "";
  return { songs: pool.slice(0, BATCH_SIZE), activity };
}

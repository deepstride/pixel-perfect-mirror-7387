import { getMood, type MoodId, type Song } from "@/data/moods";

export const BATCH_SIZE = 6;

export const GENRES = [
  { id: "any", label: "All genres", term: "" },
  { id: "pop", label: "Pop", term: "pop" },
  { id: "rock", label: "Rock", term: "rock" },
  { id: "hiphop", label: "Hip-Hop", term: "hip hop" },
  { id: "rnb", label: "R&B", term: "r&b" },
  { id: "electronic", label: "Electronic", term: "electronic" },
  { id: "indie", label: "Indie", term: "indie" },
  { id: "acoustic", label: "Acoustic", term: "acoustic" },
  { id: "lofi", label: "Lo-fi", term: "lofi" },
] as const;
export type GenreId = (typeof GENRES)[number]["id"];

/** Search phrases per mood; rotated so "Discover More" explores new parts of the catalogue. */
export const MOOD_TERMS: Record<MoodId, string[]> = {
  happy: ["happy", "sunshine", "feel good", "good vibes", "summer", "dance party", "smile", "celebrate"],
  sad: ["sad", "heartbreak", "lonely", "tears", "missing you", "rainy day", "broken", "goodbye"],
  calm: ["calm", "peaceful", "relax", "chill", "ocean", "meditation", "slow", "dreams"],
  angry: ["angry", "rage", "fight", "scream", "fire", "revenge", "unstoppable", "break"],
  energetic: ["energy", "workout", "run", "power", "pump up", "adrenaline", "jump", "hype"],
  tired: ["sleep", "lullaby", "night", "tired", "dreaming", "soft", "moonlight", "rest"],
};

const REASONS: Record<MoodId, string[]> = {
  happy: ["Bright and upbeat to keep your good mood glowing.", "A feel-good groove that matches your sunny energy.", "Light, joyful and easy to sing along to."],
  sad: ["Tender and honest — it sits with you in the feeling.", "A gentle song for reflecting and letting it out.", "Soft melancholy that understands, then lifts a little."],
  calm: ["Unhurried and soothing to keep things still.", "Mellow textures for slow, easy breathing.", "Peaceful and spacious, like a quiet night."],
  angry: ["Intense energy to release frustration safely.", "Powerful and raw — channel the fire through sound.", "Heavy and driving to burn the anger off."],
  energetic: ["High tempo fuel for your spark.", "A driving beat to keep you moving.", "Big, bold energy for getting things done."],
  tired: ["Soft and slow to help you wind down.", "Dreamy and hushed for heavy eyelids.", "Gentle sounds that make resting feel easy."],
};

export function buildQuery(mood: MoodId, genre: GenreId, round: number) {
  const terms = MOOD_TERMS[mood];
  const term = terms[round % terms.length]!;
  const g = GENRES.find((x) => x.id === genre)?.term ?? "";
  return `${term} ${g}`.trim();
}

export function explain(mood: MoodId, song: Song, i: number) {
  const base = REASONS[mood][i % REASONS[mood].length]!;
  return song.genre ? `${base} (${song.genre})` : base;
}

/**
 * Choose up to `n` songs not seen before, at most one per artist and one per title.
 */
export function pickFresh(pool: Song[], seen: Set<string>, n = BATCH_SIZE, rand: () => number = Math.random): Song[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = t;
  }
  const artists = new Set<string>();
  const titles = new Set<string>();
  const out: Song[] = [];
  for (const s of shuffled) {
    const a = s.artist.toLowerCase();
    const t = s.title.toLowerCase();
    if (seen.has(s.id) || artists.has(a) || titles.has(t)) continue;
    artists.add(a);
    titles.add(t);
    out.push(s);
    if (out.length === n) break;
  }
  return out;
}

/** Offline fallback from the curated local list. */
export function recommend(
  moodId: MoodId,
  previousIds: string[] = [],
  rand: () => number = Math.random,
): { songs: Song[]; activity: string } {
  const mood = getMood(moodId);
  if (!mood) throw new Error(`Unknown mood: ${moodId}`);
  const songs = pickFresh(mood.songs, new Set(previousIds), 3, rand);
  return { songs, activity: randomActivity(moodId, rand) };
}

export function randomActivity(moodId: MoodId, rand: () => number = Math.random) {
  const a = getMood(moodId)?.activities ?? [];
  return a[Math.floor(rand() * a.length)] ?? "";
}

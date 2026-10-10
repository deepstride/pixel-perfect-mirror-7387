import happy from "@/assets/mood-happy.jpg";
import sad from "@/assets/mood-sad.jpg";
import calm from "@/assets/mood-calm.jpg";
import angry from "@/assets/mood-angry.jpg";
import energetic from "@/assets/mood-energetic.jpg";
import tired from "@/assets/mood-tired.jpg";
import type { MoodId } from "./moods";

export const MOOD_IMAGES: Record<MoodId, string> = { happy, sad, calm, angry, energetic, tired };

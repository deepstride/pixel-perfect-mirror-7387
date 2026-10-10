export type MoodId = "happy" | "sad" | "calm" | "angry" | "energetic" | "tired";

export interface Song {
  id: string;
  title: string;
  artist: string;
  why: string;
  album?: string;
  genre?: string;
  artwork?: string;
  /** 30-second preview from the catalogue; absent when none is offered. */
  previewUrl?: string;
  /** Official store/listening page. */
  link?: string;
}

export interface Mood {
  id: MoodId;
  label: string;
  emoji: string;
  blurb: string;
  songs: Song[];
  activities: string[];
}

const s = (id: string, title: string, artist: string, why: string): Song => ({ id, title, artist, why });

export const MOODS: Mood[] = [
  {
    id: "happy", label: "Happy", emoji: "☀️", blurb: "Keep the glow going",
    songs: [
      s("h1", "Walking on Sunshine", "Katrina & The Waves", "Pure bottled sunshine to match your bright mood."),
      s("h2", "Happy", "Pharrell Williams", "An irresistible groove that celebrates feeling good."),
      s("h3", "Good as Hell", "Lizzo", "Confident and joyful — made for a great day."),
      s("h4", "Here Comes the Sun", "The Beatles", "Gentle optimism that feels like warm light."),
      s("h5", "Dancing Queen", "ABBA", "Timeless sparkle that invites you to move."),
      s("h6", "Levitating", "Dua Lipa", "Light, bouncy pop to keep you floating."),
      s("h7", "September", "Earth, Wind & Fire", "Brassy, celebratory and full of warmth."),
      s("h8", "Shake It Off", "Taylor Swift", "Playful energy that brushes worries aside."),
      s("h9", "Lovely Day", "Bill Withers", "A soulful reminder of simple joys."),
    ],
    activities: ["Share a compliment with someone you love.", "Take a sunny walk and notice three beautiful things.", "Dance around your room for one full song."],
  },
  {
    id: "sad", label: "Sad", emoji: "🌧️", blurb: "Gentle songs that understand",
    songs: [
      s("s1", "Fix You", "Coldplay", "A tender song that sits with you and offers hope."),
      s("s2", "Someone Like You", "Adele", "Lets you feel it fully — sometimes that helps."),
      s("s3", "Lean on Me", "Bill Withers", "A warm reminder that you're not alone."),
      s("s4", "The Night We Met", "Lord Huron", "Soft and wistful, perfect for reflection."),
      s("s5", "Skinny Love", "Bon Iver", "Raw, quiet vulnerability for heavy moments."),
      s("s6", "Everybody Hurts", "R.E.M.", "Honest comfort that says hold on."),
      s("s7", "Liability", "Lorde", "Intimate and understanding of lonely feelings."),
      s("s8", "Let It Be", "The Beatles", "Calm acceptance wrapped in a gentle melody."),
      s("s9", "Bloom", "The Paper Kites", "Delicate and hopeful, like the first spring day."),
    ],
    activities: ["Write down what you're feeling — no editing.", "Make a warm drink and wrap up in a blanket.", "Message a friend just to say hi."],
  },
  {
    id: "calm", label: "Calm", emoji: "🌙", blurb: "Soft sounds for still moments",
    songs: [
      s("c1", "Weightless", "Marconi Union", "Designed to slow your breathing and heart rate."),
      s("c2", "Clair de Lune", "Claude Debussy", "Moonlit piano for a peaceful mind."),
      s("c3", "Holocene", "Bon Iver", "Spacious and serene, like a quiet night."),
      s("c4", "Sunset Lover", "Petit Biscuit", "Dreamy electronic waves for unwinding."),
      s("c5", "River Flows in You", "Yiruma", "Flowing piano that soothes and steadies."),
      s("c6", "Banana Pancakes", "Jack Johnson", "Easygoing acoustic for slow mornings."),
      s("c7", "Gymnopédie No.1", "Erik Satie", "Minimal, floating, and endlessly calm."),
      s("c8", "Pink + White", "Frank Ocean", "Warm, mellow and gently nostalgic."),
      s("c9", "Experience", "Ludovico Einaudi", "A slow build that feels like deep breaths."),
    ],
    activities: ["Try 4-7-8 breathing for two minutes.", "Light a candle and read a few pages.", "Stretch slowly while the song plays."],
  },
  {
    id: "angry", label: "Angry", emoji: "🔥", blurb: "Release it, then reset",
    songs: [
      s("a1", "Killing in the Name", "Rage Against the Machine", "A cathartic release for intense energy."),
      s("a2", "Numb", "Linkin Park", "Gives voice to frustration you can't put into words."),
      s("a3", "Break Stuff", "Limp Bizkit", "Loud, unfiltered — vent it safely through sound."),
      s("a4", "Bad Guy", "Billie Eilish", "Brooding attitude to channel the fire."),
      s("a5", "Seven Nation Army", "The White Stripes", "A stomping riff to march it out."),
      s("a6", "Stronger", "Kanye West", "Turns anger into determination."),
      s("a7", "You Oughta Know", "Alanis Morissette", "Honest, fierce emotional release."),
      s("a8", "Chop Suey!", "System of a Down", "Chaotic intensity matched to a stormy mood."),
      s("a9", "Breathe Me", "Sia", "A softer landing once the storm passes."),
    ],
    activities: ["Do 20 jumping jacks to burn off the heat.", "Scribble everything out on paper, then tear it up.", "Step outside and take ten slow breaths."],
  },
  {
    id: "energetic", label: "Energetic", emoji: "⚡", blurb: "Fuel for your spark",
    songs: [
      s("e1", "Can't Hold Us", "Macklemore & Ryan Lewis", "Unstoppable momentum to ride your energy."),
      s("e2", "Blinding Lights", "The Weeknd", "Driving synths for full-speed nights."),
      s("e3", "Don't Stop Me Now", "Queen", "Pure exhilaration — no brakes."),
      s("e4", "Titanium", "David Guetta ft. Sia", "Powerful and soaring for big moves."),
      s("e5", "Uptown Funk", "Mark Ronson ft. Bruno Mars", "Funky fire to keep you moving."),
      s("e6", "Eye of the Tiger", "Survivor", "Classic motivation for any challenge."),
      s("e7", "Mr. Brightside", "The Killers", "Fast, anthemic and impossible to sit through."),
      s("e8", "Physical", "Dua Lipa", "Workout-ready pop with relentless pulse."),
      s("e9", "Lose Yourself", "Eminem", "Laser focus and drive."),
    ],
    activities: ["Do a quick 10-minute workout.", "Tackle that task you've been putting off.", "Go for a run or brisk bike ride."],
  },
  {
    id: "tired", label: "Tired", emoji: "😴", blurb: "Rest is part of the rhythm",
    songs: [
      s("t1", "Sleepyhead", "Passion Pit", "Hazy and dreamy, like drifting off."),
      s("t2", "Night Owl", "Galimatias", "Mellow beats for winding down."),
      s("t3", "Coffee", "beabadoobee", "Soft, cozy and comforting."),
      s("t4", "Breathe", "Télépopmusik", "Slow and airy to ease you down."),
      s("t5", "Golden Hour", "JVKE", "Warm and gentle as the day fades."),
      s("t6", "Sweet Dreams", "Patsy Cline", "A classic lullaby for heavy eyelids."),
      s("t7", "Moon Song", "Phoebe Bridgers", "Quiet, intimate and soothing."),
      s("t8", "Nocturne Op.9 No.2", "Frédéric Chopin", "Graceful piano for a restful night."),
      s("t9", "Yellow", "Coldplay", "Soft glow for slowing down."),
    ],
    activities: ["Take a 20-minute power nap.", "Drink a glass of water and dim the lights.", "Put your phone away 30 minutes before bed."],
  },
];

export const getMood = (id: string) => MOODS.find((m) => m.id === id);

/** Spotify search URLs are always valid, even without track IDs. */
export const songLink = (song: Song) =>
  song.link ?? `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;

export const findSong = (id: string) => MOODS.flatMap((m) => m.songs).find((s) => s.id === id);

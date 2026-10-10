import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MeloMuse" },
      { name: "description", content: "What MeloMuse is and how its mood-based recommendations work." },
      { property: "og:title", content: "About — MeloMuse" },
      { property: "og:description", content: "How MeloMuse matches music to your mood." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-medium">About MeloMuse</h1>
      <div className="glass mt-6 space-y-4 rounded-2xl p-6 leading-relaxed text-foreground/90">
        <p>MeloMuse pairs how you feel with music that fits — plus a small activity to help you lean into or gently shift your mood.</p>
        <p>Recommendations come from a hand-curated library of songs for six moods. "Discover More" always shows a fresh set, never the one you just saw.</p>
        <p>There are no accounts yet, and favourites last only for your current visit. Saved profiles and favourites are planned for a future version.</p>
      </div>
    </section>
  );
}

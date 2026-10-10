import { createFileRoute } from "@tanstack/react-router";
import { MoodFinder } from "@/components/MoodFinder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeloMuse — Music for every mood" },
      { name: "description", content: "A little music for every version of you. Pick a mood and find your sound." },
      { property: "og:title", content: "MeloMuse — Music for every mood" },
      { property: "og:description", content: "A little music for every version of you." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative px-4 pt-16 pb-12 text-center">
        <div className="stars pointer-events-none absolute inset-0" aria-hidden />
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-moon shadow-[0_0_60px_10px] shadow-primary/40" aria-hidden />
        <h1 className="text-gradient text-6xl font-semibold tracking-tight sm:text-7xl">MeloMuse</h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">A little music for every version of you.</p>
      </section>
      <MoodFinder />
    </>
  );
}

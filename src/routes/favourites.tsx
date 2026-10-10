import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useFavourites } from "@/context/favourites";
import { SongCard } from "@/components/SongCard";

export const Route = createFileRoute("/favourites")({
  head: () => ({
    meta: [
      { title: "Favourites — MeloMuse" },
      { name: "description", content: "The songs you've saved during this session." },
      { property: "og:title", content: "Favourites — MeloMuse" },
      { property: "og:description", content: "Your saved MeloMuse songs." },
    ],
  }),
  component: Favourites,
});

function Favourites() {
  const { favourites } = useFavourites();
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-medium">Favourites</h1>
      <p className="mt-2 text-sm text-muted-foreground">Saved for this session only — they'll clear when you close or refresh the page.</p>
      {favourites.length === 0 ? (
        <div className="glass mt-8 rounded-2xl p-10 text-center">
          <Heart className="mx-auto h-8 w-8 text-accent" aria-hidden />
          <p className="mt-3">No favourites yet.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-gradient-primary px-6 py-2.5 font-semibold text-primary-foreground">Find a song</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((s) => <SongCard key={s.id} song={s} />)}
        </div>
      )}
    </section>
  );
}

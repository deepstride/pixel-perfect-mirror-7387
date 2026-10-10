import { Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { useFavourites } from "@/context/favourites";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/favourites", label: "Favourites" },
  { to: "/about", label: "About" },
] as const;

export function Nav() {
  const { favourites } = useFavourites();
  return (
    <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur-lg">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <Moon className="h-5 w-5 text-moon" aria-hidden /> MeloMuse
        </Link>
        <ul className="flex gap-1 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: true }}
                className="rounded-full px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "bg-secondary !text-foreground" }}
              >
                {l.label}
                {l.to === "/favourites" && favourites.length > 0 && (
                  <span className="ml-1 rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{favourites.length}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

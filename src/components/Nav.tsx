import { Link } from "@tanstack/react-router";
import { Moon, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useFavourites } from "@/context/favourites";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/favourites", label: "Favourites" },
  { to: "/playlists", label: "Playlists" },
  { to: "/about", label: "About" },
] as const;

export function Nav() {
  const { favourites } = useFavourites();
  const { session, displayName, signOut } = useAuth();
  const qc = useQueryClient();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-lg">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-semibold">
          <Moon className="h-5 w-5 text-moon" aria-hidden /> MeloMuse
        </Link>
        <div className="flex items-center gap-2 sm:order-last">
          {session ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">Hi, {displayName}</span>
              <button
                onClick={async () => { qc.clear(); await signOut(); }}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" aria-hidden /> Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="rounded-full bg-gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">Sign in</Link>
          )}
        </div>
        <ul className="-mx-1 flex w-full gap-1 overflow-x-auto text-sm sm:w-auto">
          {links.map((l) => (
            <li key={l.to} className="shrink-0">
              <Link
                to={l.to}
                activeOptions={{ exact: true }}
                className="block rounded-full px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
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

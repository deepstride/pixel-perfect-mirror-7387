import { GENRES, type GenreId } from "@/lib/recommend";
import { cn } from "@/lib/utils";

export function GenreChips({ value, onChange }: { value: GenreId; onChange: (g: GenreId) => void }) {
  return (
    <div role="radiogroup" aria-label="Genre" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {GENRES.map((g) => (
        <button
          key={g.id}
          role="radio"
          aria-checked={g.id === value}
          onClick={() => onChange(g.id)}
          className={cn(
            "min-h-10 shrink-0 rounded-full border px-4 text-sm transition hover:bg-secondary",
            g.id === value && "glow bg-secondary text-foreground",
          )}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}

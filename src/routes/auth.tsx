import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MeloMuse" },
      { name: "description", content: "Sign in to MeloMuse with your name to save playlists." },
      { property: "og:title", content: "Sign in — MeloMuse" },
      { property: "og:description", content: "Sign in to save your playlists." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/playlists", replace: true });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter a name (2+ letters).");
    if (password.length < 6) return setError("Password needs at least 6 characters.");
    setBusy(true);
    setError(null);
    const err = mode === "in" ? await signIn(name, password) : await signUp(name, password);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="glass glow rounded-3xl p-8">
        <h1 className="text-3xl font-medium">{mode === "in" ? "Welcome back" : "Join MeloMuse"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Just your name and a password — nothing else.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
              className="mt-1 w-full rounded-xl border bg-input/40 px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              className="mt-1 w-full rounded-xl border bg-input/40 px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); }}
          className="mt-4 w-full text-center text-sm text-primary hover:underline"
        >
          {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}

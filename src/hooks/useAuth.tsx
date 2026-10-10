import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Users sign in with just a name; we map it to an internal address the auth system needs. */
export const nameToEmail = (name: string) =>
  `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@melomuse.app`;

interface AuthCtx {
  session: Session | null;
  displayName: string | null;
  ready: boolean;
  signIn: (name: string, password: string) => Promise<string | null>;
  signUp: (name: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const displayName =
    (session?.user.user_metadata?.display_name as string | undefined) ??
    session?.user.email?.split("@")[0] ??
    null;

  const signIn = async (name: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: nameToEmail(name), password });
    return error ? "That name and password don't match." : null;
  };
  const signUp = async (name: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: nameToEmail(name),
      password,
      options: { data: { display_name: name.trim() } },
    });
    if (error) return /registered|exists/i.test(error.message) ? "That name is taken — try signing in." : error.message;
    return null;
  };
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return <Ctx.Provider value={{ session, displayName, ready, signIn, signUp, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}

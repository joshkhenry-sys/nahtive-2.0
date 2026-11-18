"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureSpanishLearner } from "@/lib/supabase/learner";

function authUrl(path: string, value: string) {
  return `${path}?${value.startsWith("message:") ? "message" : "error"}=${encodeURIComponent(value.replace(/^(message:)/, ""))}`;
}

export async function signInWithGoogle() {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nahtive-20.vercel.app").replace(/\/+$/, "");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=/dashboard` },
  });

  if (error) redirect(authUrl("/login", error.message));
  if (data.url) redirect(data.url);
  redirect(authUrl("/login", "Unable to start Google sign-in."));
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect(authUrl("/login", "Please enter your email and password."));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect(authUrl("/login", error?.message ?? "Unable to sign in."));

  await ensureSpanishLearner(supabase, data.user);
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 8) redirect(authUrl("/signup", "Use a valid email and a password with at least 8 characters."));

  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nahtive-20.vercel.app").replace(/\/+$/, "");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      data: { display_name: displayName },
    },
  });

  if (error) redirect(authUrl("/signup", error.message));
  if (data.user && data.session) {
    await ensureSpanishLearner(supabase, data.user);
    redirect("/dashboard");
  }
  redirect(authUrl("/login", "message:Check your email to confirm your account, then sign in."));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

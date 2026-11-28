import type { SupabaseClient, User } from "@supabase/supabase-js";

function getDisplayName(user: User) {
  const metadata = user.user_metadata ?? {};
  const candidate = metadata.full_name ?? metadata.name ?? metadata.display_name;
  if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  return user.email?.split("@")[0] ?? "Spanish learner";
}

export async function ensureSpanishLearner(supabase: SupabaseClient, user: User) {
  const displayName = getDisplayName(user);
  const avatarUrl = typeof user.user_metadata?.avatar_url === "string"
    ? user.user_metadata.avatar_url
    : typeof user.user_metadata?.picture === "string"
      ? user.user_metadata.picture
      : null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  if (!profile) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      display_name: displayName,
      avatar_url: avatarUrl,
      native_language_code: "en",
      goal: "Build practical Spanish fluency",
      interests: [],
    });
    if (error) throw error;
  } else {
    const shouldRefreshName =
      !profile.display_name ||
      profile.display_name === "Spanish learner" ||
      profile.display_name === user.email?.split("@")[0];
    const profileUpdates = {
      ...(shouldRefreshName ? { display_name: displayName } : {}),
      ...(avatarUrl && !profile.avatar_url ? { avatar_url: avatarUrl } : {}),
    };
    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabase.from("profiles").update(profileUpdates).eq("id", user.id);
      if (error) throw error;
    }
  }

  const { data: spanish, error: languageError } = await supabase
    .from("languages").select("id").eq("code", "es").eq("is_active", true).maybeSingle();
  if (languageError) throw languageError;
  if (!spanish) throw new Error("Spanish is not configured as an active course language.");

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("learner_languages")
    .select("id")
    .eq("user_id", user.id)
    .eq("language_id", spanish.id)
    .limit(1)
    .maybeSingle();
  if (enrollmentError) throw enrollmentError;

  if (!enrollment) {
    const { error } = await supabase.from("learner_languages").insert({
      user_id: user.id,
      language_id: spanish.id,
      level: "A1",
      starting_level: null,
      goal: "Build practical Spanish fluency",
      interests: [],
      is_current: true,
    });
    if (error) throw error;
  }
}

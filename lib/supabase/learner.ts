import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function ensureSpanishLearner(supabase: SupabaseClient, user: User) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (profileError) throw profileError;

  if (!profile) {
    const displayName = String(user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Spanish learner");
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      display_name: displayName,
      native_language_code: "en",
      goal: "Build practical Spanish fluency",
      interests: [],
    });
    if (error) throw error;
  }

  const { data: spanish, error: languageError } = await supabase
    .from("languages").select("id").eq("code", "es").eq("is_active", true).maybeSingle();
  if (languageError) throw languageError;
  if (!spanish) throw new Error("Spanish is not configured as an active course language.");

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("learner_languages").select("id").eq("user_id", user.id).eq("language_id", spanish.id).limit(1).maybeSingle();
  if (enrollmentError) throw enrollmentError;

  if (!enrollment) {
    const { error } = await supabase.from("learner_languages").insert({
      user_id: user.id,
      language_id: spanish.id,
      level: "A1",
      goal: "Build practical Spanish fluency",
      interests: [],
      is_current: true,
    });
    if (error) throw error;
  }
}

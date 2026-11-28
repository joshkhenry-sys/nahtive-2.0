"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export async function saveStartingLevel(formData: FormData) {
  const level = String(formData.get("level") ?? "");
  if (!levels.includes(level as (typeof levels)[number])) {
    redirect("/onboarding?error=Choose%20a%20valid%20CEFR%20level");
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: spanish, error: languageError } = await supabase
    .from("languages").select("id").eq("code", "es").eq("is_active", true).single();
  if (languageError || !spanish) redirect("/onboarding?error=Spanish%20course%20is%20not%20available");

  const { error: updateError } = await supabase
    .from("learner_languages")
    .update({ level, starting_level: level, is_current: true })
    .eq("user_id", user.id)
    .eq("language_id", spanish.id);
  if (updateError) redirect("/onboarding?error=Could%20not%20save%20your%20level");

  const { data: course, error: courseError } = await supabase
    .from("courses").select("id").eq("language_id", spanish.id).eq("level", level).maybeSingle();
  if (courseError) redirect("/onboarding?error=Could%20not%20load%20your%20course");

  if (course) {
    const { error: enrollmentError } = await supabase.from("learner_enrollments").upsert(
      { user_id: user.id, course_id: course.id, status: "active" },
      { onConflict: "user_id,course_id", ignoreDuplicates: true }
    );
    if (enrollmentError) redirect("/onboarding?error=Could%20not%20enroll%20you%20in%20the%20course");
  }

  redirect("/dashboard");
}

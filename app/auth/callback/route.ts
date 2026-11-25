
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureSpanishLearner } from "@/lib/supabase/learner";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/dashboard";

  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=Missing%20authorization%20code", origin)
    );
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("GOOGLE_AUTH_EXCHANGE_ERROR:", error);

      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          origin
        )
      );
    }

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!data.user) {
      throw new Error("Google sign-in succeeded, but no user was returned.");
    }

    await ensureSpanishLearner(supabase, data.user);

    return NextResponse.redirect(new URL(next, origin));
  } catch (error) {
    console.error("GOOGLE_AUTH_CALLBACK_ERROR:", error);

    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : String(error);

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, origin)
    );
  }
}

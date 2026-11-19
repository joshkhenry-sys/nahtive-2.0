import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Voice is not configured yet. Add GEMINI_API_KEY to Vercel." }, { status: 503 });

  try {
    const now = Date.now();
    const response = await fetch("https://generativelanguage.googleapis.com/v1alpha/authTokens", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        uses: 1,
        newSessionExpireTime: new Date(now + 60_000).toISOString(),
        expireTime: new Date(now + 30 * 60_000).toISOString(),
      }),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok || !data.name) {
      console.error("Gemini token provisioning failed:", data);
      return NextResponse.json({ error: "Google could not start a voice session. Check that your Gemini API key and Live API access are active." }, { status: 502 });
    }
    return NextResponse.json({ token: data.name });
  } catch (error) {
    console.error("Gemini token provisioning error:", error);
    return NextResponse.json({ error: "Unable to reach Google's voice service. Please try again." }, { status: 502 });
  }
}

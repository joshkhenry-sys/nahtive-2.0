import Link from "next/link";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveStartingLevel } from "@/app/auth/learner-actions";

const levels = [
  { code: "A1", name: "Beginner", detail: "You know little or no Spanish yet." },
  { code: "A2", name: "Elementary", detail: "You can manage familiar, everyday situations." },
  { code: "B1", name: "Intermediate", detail: "You can handle most familiar conversations and explain experiences." },
  { code: "B2", name: "Upper intermediate", detail: "You can discuss a wide range of topics with growing fluency." },
  { code: "C1", name: "Advanced", detail: "You can use Spanish flexibly for complex topics and nuanced expression." },
  { code: "C2", name: "Proficient", detail: "You have highly advanced control of meaning, style, and expression." },
];

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  return (
    <main className="speak-page">
      <header className="speak-header">
        <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
        <span className="speak-back">STEP 1 OF YOUR COURSE</span>
      </header>
      <div className="speak-wrap">
        <div className="speak-heading">
          <span className="speak-eyebrow">YOUR SPANISH JOURNEY</span>
          <h1>Where should<br /><span>we begin?</span></h1>
          <p>Choose the level that best reflects your current Spanish. There is no placement test, and you can change your level later.</p>
        </div>
        {params.error && <p className="speak-error" role="alert">{params.error}</p>}
        <form action={saveStartingLevel} className="speak-settings">
          <div className="speak-settings-top"><div><small>CHOOSE YOUR STARTING POINT</small><h2>What level are you at?</h2></div><span>CEFR · A1–C2</span></div>
          <div className="speak-levels">
            {levels.map((item) => (
              <label key={item.code} className="onboarding-level">
                <input type="radio" name="level" value={item.code} required />
                <b>{item.code}</b><small>{item.name}</small><span>{item.detail}</span>
              </label>
            ))}
          </div>
          <button className="speak-start" type="submit">Build my course <span>→</span></button>
        </form>
      </div>
    </main>
  );
}

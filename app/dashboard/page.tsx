import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const levels = [
  ["A1", "Beginner", "Build essential vocabulary and first sentence patterns."],
  ["A2", "Elementary", "Communicate in familiar situations and describe everyday events."],
  ["B1", "Intermediate", "Narrate experiences, explain opinions, and sustain conversations."],
  ["B2", "Upper intermediate", "Speak flexibly and discuss complex, unfamiliar topics."],
  ["C1", "Advanced", "Use nuanced language with precision and control."],
  ["C2", "Proficient", "Refine style, subtle meaning, and expressive range."],
];

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const [{ data: profile }, { data: spanish }, { data: stats }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    supabase.from("languages").select("id").eq("code", "es").eq("is_active", true).maybeSingle(),
    supabase.from("learner_stats").select("total_points,current_streak,longest_streak").eq("user_id", user.id).maybeSingle(),
  ]);

  if (!spanish) redirect("/login?error=Spanish%20course%20is%20not%20available");

  const { data: enrollment } = await supabase
    .from("learner_languages")
    .select("level,starting_level")
    .eq("user_id", user.id)
    .eq("language_id", spanish.id)
    .eq("is_current", true)
    .maybeSingle();

  if (!enrollment?.starting_level) redirect("/onboarding");

  const { data: course } = await supabase
    .from("courses")
    .select("id,title,description")
    .eq("language_id", spanish.id)
    .eq("level", enrollment.starting_level)
    .maybeSingle();

  let publishedLessonCount = 0;
  if (course) {
    const { data: units } = await supabase
      .from("course_units")
      .select("id")
      .eq("course_id", course.id)
      .eq("is_published", true);
    if (units?.length) {
      const { count } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .in("unit_id", units.map(unit => unit.id))
        .eq("is_published", true);
      publishedLessonCount = count ?? 0;
    }
  }

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Learner";
  const firstName = String(displayName).split(" ")[0];
  const initial = String(displayName).trim().charAt(0).toUpperCase() || "N";
  const totalPoints = stats?.total_points ?? 0;
  const currentStreak = stats?.current_streak ?? 0;

  return <main className="learner-app">
    <aside className="learner-sidebar">
      <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
      <div className="side-label">YOUR LEARNING</div>
      <nav>
        <a className="side-active" href="#overview">⌂ &nbsp; Overview</a>
        <a href="#course-plan">▤ &nbsp; My Spanish course</a>
        <Link href="/speak">♫ &nbsp; Speak with AI tutor</Link>
        <a href="#course-levels">◎ &nbsp; Course levels</a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><b>Need a hand?</b><p>Your learning guide is here to help you stay on track.</p><a href="mailto:hello@nahtive.com">Get in touch ↗</a></div>
        <Link href="/">← Back to Nahtive</Link>
      </div>
    </aside>
    <div className="learner-main">
      <header className="learner-topbar">
        <span>My Spanish <i>/</i> Course</span>
        <span className="learner-profile">{displayName} <i>{initial}</i></span>
        <form action={signOut}><button className="logout-link" type="submit">Sign out</button></form>
      </header>
      <div className="learner-content" id="overview">
        <div className="welcome">
          <div><div className="eyebrow">YOUR LEARNING SPACE</div><h1>Welcome back, {firstName}. <span>Let&apos;s get to work.</span></h1><p>Your Spanish course follows a structured path. Learn a concept, practise it, retrieve it from memory, and use it independently.</p></div>
          <div className="level-badge"><small>YOUR STARTING LEVEL</small><b>{enrollment.starting_level}</b><span>Self-selected · CEFR</span><Link href="/onboarding">Change level</Link></div>
        </div>

        <section className="learner-grid" id="course-plan">
          <section className="learner-card">
            <div className="card-title"><div><small>YOUR COURSE</small><h3>{course?.title ?? "Spanish course"}</h3></div><span>{enrollment.starting_level}</span></div>
            <p className="snapshot-copy">{course?.description ?? "Your selected Spanish learning path."}</p>
            <div className="skill-list">
              <div><div><span>Published lessons</span><b>{publishedLessonCount}</b></div><div className="skill-line"><i style={{width: publishedLessonCount ? "100%" : "0%"}} /></div></div>
              <div><div><span>Next step</span><b>{publishedLessonCount ? "Continue course" : "Curriculum being prepared"}</b></div><p className="snapshot-copy">{publishedLessonCount ? "Your next required lesson will appear here." : "Your level is saved. The course will unlock lessons in sequence as each unit is authored and reviewed. No placeholder lessons or fake completion stats."}</p></div>
            </div>
            {publishedLessonCount > 0 ? <Link className="learn-more" href="/lesson">Open your course ↗</Link> : <span className="learn-more">Course content is being built</span>}
          </section>
          <section className="learner-card">
            <div className="card-title"><div><small>YOUR CONSISTENCY</small><h3>Learning record</h3></div></div>
            <div className="cefr-level-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
              <div><b>{totalPoints.toLocaleString()}</b><strong>Points earned</strong><span>Points are awarded for completed learning work.</span></div>
              <div><b>{currentStreak}</b><strong>Day streak</strong><span>Days with recorded course activity.</span></div>
            </div>
            <p className="snapshot-copy">Points and streaks will grow as you complete lessons, reviews, and assessments. We only count activity recorded in your account.</p>
          </section>
        </section>

        <section className="cefr-path" id="course-levels">
          <div className="cefr-path-heading"><div><small>THE COMPLETE SPANISH PATH</small><h2>One course. Six levels.</h2><p>Your starting level is your choice. Progress is based on demonstrated ability, not a placement test.</p></div><Link href="/speak">Practise speaking ↗</Link></div>
          <div className="cefr-level-grid">
            {levels.map(([code,name,description])=><div key={code} style={code === enrollment.starting_level ? {borderColor:"#8176df",background:"#f5f3ff"} : undefined}><b>{code}</b><strong>{name}</strong><span>{description}</span>{code === enrollment.starting_level && <small style={{fontWeight:800,color:"#665ed1"}}>YOUR START</small>}</div>)}
          </div>
        </section>

        <section className="next-card">
          <div><small>THE NAHTIVE LEARNING METHOD</small><h3>Understand. Practise. Remember. Communicate.</h3><p>Each course is designed around high-frequency language, useful sentence patterns, grammar in context, spaced review, active recall, listening, and independent production. Lessons will build toward cumulative assessments rather than isolated quizzes.</p></div>
          <div className="next-levels"><b>01</b><i/><span>02</span><i/><span>03</span><i/><span>04</span></div>
        </section>
        <footer className="learner-footer"><span>Nahtive 2.0 · Spanish course</span><span>Your progress is tied to your account.</span></footer>
      </div>
    </div>
  </main>;
}

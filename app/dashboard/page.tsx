"use client";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";

export default function Dashboard() {
  return <main className="learner-app">
    <aside className="learner-sidebar">
      <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
      <div className="side-label">YOUR LEARNING</div>
      <nav>
        <a className="side-active" href="#overview">⌂ &nbsp; Overview</a>
        <a href="#course-plan">▤ &nbsp; My Spanish course</a>
        <a href="/speak">♫ &nbsp; Speak with AI tutor</a>
        <a href="#available-lessons">◎ &nbsp; Lessons</a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><b>Need a hand?</b><p>Your learning guide is here to help you stay on track.</p><a href="mailto:hello@nahtive.com">Get in touch ↗</a></div>
        <Link href="/">← Back to Nahtive</Link>
      </div>
    </aside>
    <div className="learner-main">
      <header className="learner-topbar">
        <span>My Spanish <i>/</i> Course</span>
        <span className="learner-profile">Spanish learner <i>S</i></span>
        <form action={signOut}><button className="logout-link" type="submit">Sign out</button></form>
      </header>
      <div className="learner-content" id="overview">
        <div className="welcome">
          <div><div className="eyebrow">YOUR LEARNING SPACE</div><h1>Welcome to Spanish. <span>Let's get to work.</span></h1><p>Work through complete lessons, practice actively, and check what you have learned.</p></div>
          <div className="level-badge"><small>COURSE LEVELS</small><b>A1–C2</b><span>All CEFR levels</span></div>
        </div>
        <section className="continue-card" id="available-lessons">
          <div className="continue-copy">
            <small>AVAILABLE TO TAKE NOW</small>
            <div className="unit-label">A2 · UNIT 04 · LESSON 01</div>
            <h2>Hablar del<br/>pasado</h2>
            <p>Learn to describe completed past actions through a Spanish reading, grammar instruction, comprehension, guided practice, independent writing, and a five-question assessment.</p>
            <div className="lesson-meta">◷ 25–30 min &nbsp;&nbsp; · &nbsp;&nbsp; Reading · Grammar · Writing · Assessment</div>
            <Link className="button button-primary" href="/lesson">Start actual lesson <span>→</span></Link>
            <Link className="dashboard-speak-link" href="/speak">Try live Spanish speaking practice ↗</Link>
          </div>
          <div className="continue-art">
            <div className="spanish-card"><small>SPANISH IN CONTEXT</small><strong>¿Qué hiciste<br/>ayer?</strong><em>What did you do yesterday?</em><hr/><div><span>comer</span><b>comí</b><small>I ate</small></div><div><span>estudiar</span><b>estudié</b><small>I studied</small></div></div>
            <b className="art-star">✳</b>
          </div>
        </section>
        <div className="learner-grid" id="course-plan">
          <section className="learner-card">
            <div className="card-title"><div><small>INSIDE THIS LESSON</small><h3>What you'll actually do</h3></div><span>6 PARTS</span></div>
            <div className="task-list">
              {[
                ["01","Read","A contextual Spanish passage about a day downtown.","5 min"],
                ["02","Understand","Learn regular preterite endings and common irregular verbs.","7 min"],
                ["03","Comprehend","Answer questions about details in the reading.","5 min"],
                ["04","Practice","Complete four verb-form exercises with feedback.","5 min"],
                ["05","Produce","Write about what you did yesterday.","5 min"],
                ["06","Assess","Complete a five-question knowledge check with explanations.","5 min"]
              ].map(([number,title,description,time])=><button type="button" disabled key={number}><i>{number}</i><span><b>{title}</b><small>{description}</small></span><em>{time}</em></button>)}
            </div>
          </section>
          <section className="learner-card">
            <div className="card-title"><div><small>COURSE CONTENT</small><h3>Spanish learning path</h3></div></div>
            <p className="snapshot-copy">Nahtive is being built around the full CEFR range: A1, A2, B1, B2, C1, and C2. Choose your speaking level in Speak. Only lessons that are implemented and ready to take will appear as available.</p>
            <div className="skill-list">
              <div><div><span>Available now</span><b>1 lesson</b></div><div className="skill-line"><i style={{width:"12%"}}/></div></div>
              <div><div><span>Next</span><b>A2 · Past narration</b></div><p className="snapshot-copy">Additional lessons will be added as complete learning experiences, not placeholder cards.</p></div>
            </div>
            <Link className="learn-more" href="/lesson">Open available lesson ↗</Link>
          </section>
        </div>
        <section className="next-card">
          <div><small>HONEST PROGRESS TRACKING</small><h3>Your work comes first.</h3><p>This lesson currently runs as an interactive test. Answers and progress are not yet saved to your account between visits. We are not showing made-up skill scores or completion statistics.</p></div>
          <div className="next-levels"><b>A1</b><i/><span>A2</span><i/><span>B1</span><i/><span>B2</span><i/><span>C1</span><i/><span>C2</span></div>
        </section>
        <footer className="learner-footer"><span>Nahtive 2.0 · Spanish course</span><span>Interactive lesson test · Progress persistence coming next.</span></footer>
      </div>
    </div>
  </main>;
}

import Link from "next/link";

const benefits = [
  ["01", "Understand the structure", "Learn how Spanish sentences work so you can create your own—not just repeat memorized phrases."],
  ["02", "Speak more naturally", "Build useful vocabulary and everyday expressions from across Latin America."],
  ["03", "Know what comes next", "Follow a clear course path, revisit weak spots, and see which skills are improving."],
];

export default function Home() {
  return <main>
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
      <nav><a href="#approach">Our approach</a><a href="#course">The course</a></nav>
      <div className="header-actions"><Link className="login-link" href="/login">Sign in</Link><Link className="button button-dark" href="/signup">Explore the course <span>↗</span></Link></div>
    </header>
    <section className="hero wrap">
      <div className="hero-copy"><div className="eyebrow"><i/> A more thoughtful way to learn Spanish</div>
        <h1>Learn Spanish.<br/><span>Actually use it.</span></h1>
        <p className="hero-lede">A structured Spanish course that helps you understand how the language works, speak more naturally, and keep making progress.</p>
        <div className="hero-buttons"><Link className="button button-primary" href="/signup">Start learning <span>→</span></Link><a className="button button-soft" href="#approach">See the approach</a></div>
        <div className="hero-footnote"><span className="mini-avatars"><i>ES</i><i>LA</i><i>¡</i></span> Built around real Spanish, not streaks and gimmicks.</div>
      </div>
      <div className="hero-visual"><div className="orbit orbit-a"/><div className="orbit orbit-b"/>
        <div className="floating-tag tag-top"><b>✳</b><span><strong>Understand</strong><small>Build the why, not just the what.</small></span></div>
        <article className="lesson-preview"><div className="preview-top"><span>YOUR SPANISH COURSE</span><b>A2 · UNIT 04</b></div><div className="progress-line"><i/></div><div className="preview-label">TODAY’S FOCUS</div><h2>Talking about<br/>what you did</h2><p>Use the preterite to describe completed actions in everyday life.</p><div className="example-box"><small>IN CONTEXT</small><strong>Ayer <em>comí</em> con mis amigos.</strong><span>Yesterday I ate with my friends.</span></div><div className="preview-bottom"><span>12 min · Grammar &amp; speaking</span><b>↗</b></div></article>
        <div className="floating-tag tag-bottom"><b className="bars">▂▅▃▇</b><span><strong>Progress that means something</strong><small>Track skills, not just completed lessons.</small></span></div>
      </div>
    </section>
    <section className="proof-strip"><div className="wrap proof-inner"><span>MADE FOR REAL PROGRESS</span><div><b>Clear structure</b><i/><b>Useful Spanish</b><i/><b>Personalized practice</b><i/><b>Lasting retention</b></div></div></section>
    <section className="section wrap" id="approach"><div className="section-heading"><div><div className="eyebrow">THE NAHTIVE METHOD</div><h2>Learn with purpose.<br/><span>Build real fluency.</span></h2></div><p>Spanish becomes easier to use when you understand the patterns behind it. Every lesson has a clear job—and every exercise moves you toward using the language independently.</p></div>
      <div className="benefit-grid">{benefits.map(([n,title,body])=><article className="benefit-card" key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p><b>↗</b></article>)}</div>
    </section>
    <section className="course-band" id="course"><div className="wrap course-layout"><div><div className="eyebrow">A COURSE THAT BUILDS</div><h2>One clear path.<br/><span>From A1 to C2.</span></h2><p>Move through a carefully sequenced curriculum with lessons designed for your level. Practice reading, grammar, vocabulary, sentence construction, and real communication.</p><Link className="button button-primary" href="/signup">Preview your learning space <span>→</span></Link></div>
      <div className="path-card"><div className="path-heading"><b>THE LEARNING PATH</b><span>CEFR FRAMEWORK</span></div>{["Foundations","Everyday confidence","Independent use","Confident expression","Advanced nuance","Mastery"].map((label,i)=><div className={"path-row "+(i===1?"current":"")} key={label}><b>{["A1","A2","B1","B2","C1","C2"][i]}</b><div className="path-bar"><i style={{width:[26,38,55,72,88,100][i]+"%"}}/></div><span>{label}</span><small>{i===1?"CURRENT":i===0?"START":"NEXT"}</small></div>)}<div className="path-note">✓ &nbsp; Progress is based on what you can understand and produce—not just what you finish.</div></div>
    </div></section>
    <section className="section wrap lesson-rhythm"><div><div className="eyebrow">INSIDE EVERY LESSON</div><h2>Learn it. Practice it.<br/><span>Make it yours.</span></h2><p>A consistent lesson rhythm makes it easier to focus on the language instead of figuring out what to do next.</p></div><div className="rhythm-list">{["Read for meaning","Notice the grammar","Build your own sentences","Check understanding"].map((s,i)=><div key={s}><span>0{i+1}</span><b>{s}</b><i>+</i></div>)}</div></section>
    <section className="cta-band"><div className="wrap cta-inner"><div><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>Make Spanish part<br/>of your everyday life.</h2></div><Link className="button button-white" href="/signup">Explore Nahtive <span>↗</span></Link><b className="cta-watermark">n.</b></div></section>
    <footer className="wrap footer"><Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link><span>Spanish learning, with intention.</span><span>© 2026 Nahtive</span></footer>
  </main>;
}
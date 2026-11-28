"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { submitLessonAttempt } from "@/app/lesson/actions";

type Question={prompt:string;options:string[];answer:string;explanation:string;rule:string;retry:string;retryAnswer:string};
type Section=Record<string,any>;
type Lesson={id:string;slug:string;title:string;description:string;sequence:number;estimated_minutes:number;points_reward:number;content:{objective:string;sections:Section[]}};
type NavLesson={id:string;slug:string;title:string;sequence:number;completed:boolean};

export default function LessonPlayer({lesson,lessons,courseTitle,level}:{lesson:Lesson;lessons:NavLesson[];courseTitle:string;level:string}) {
  const [sectionIndex,setSectionIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [retryAnswers,setRetryAnswers]=useState<Record<string,string>>({});
  const [showFeedback,setShowFeedback]=useState(false);
  const [production,setProduction]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [result,setResult]=useState<{score:number;passed:boolean;points:number;feedback:any[]}|null>(null);
  const [busy,setBusy]=useState(false);
  const sections=lesson.content.sections;
  const section=sections[sectionIndex];
  const questions=useMemo(()=>sections.filter(s=>s.type==="practice"||s.type==="assessment").flatMap(s=>s.questions as Question[]),[sections]);
  const allAnswered=questions.every((q,i)=>Boolean(answers[String(i)]));
  const score=result?.score ?? 0;
  async function submit() {
    if(!allAnswered||production.trim().length<20) return;
    setBusy(true);
    const form=new FormData();
    form.set("lessonId",lesson.id); form.set("answers",JSON.stringify(answers)); form.set("production",production);
    try { const response=await submitLessonAttempt(form); setResult(response); setSubmitted(response.passed); setShowFeedback(true); }
    catch(error) { window.alert(error instanceof Error?error.message:"Unable to save this attempt."); }
    finally { setBusy(false); }
  }
  function renderQuestions(items:Question[],offset:number) {
    return <div className="nahtive-question-list">{items.map((q,i)=>{
      const index=offset+i; const selected=answers[String(index)]??""; const correct=selected===q.answer;
      return <article className="nahtive-question" key={q.prompt}>
        <b>{i+1}. {q.prompt}</b>
        <div className="nahtive-options">{q.options.map(option=><button type="button" key={option} disabled={submitted} className={selected===option?"selected":""} onClick={()=>{setAnswers(old=>({...old,[String(index)]:option}));setShowFeedback(false);}}>{option}</button>)}</div>
        {showFeedback&&<div className={correct?"nahtive-feedback good":"nahtive-feedback needs-work"}><strong>{correct?"Correct.":"Not quite—here's the pattern."}</strong><p>{q.explanation}</p><small>RULE: {q.rule}</small>{!correct&&<div className="nahtive-retry"><b>Try a similar example before moving on</b><p>{q.retry}</p><input value={retryAnswers[String(index)]??""} onChange={e=>setRetryAnswers(old=>({...old,[String(index)]:e.target.value}))} placeholder="Type your answer..." /><span>{retryAnswers[String(index)]?.trim().toLowerCase()===q.retryAnswer.toLowerCase()?"That's it. You applied the rule.":""}</span></div>}</div>}
      </article>;
    })}</div>;
  }
  const assessmentOffset=sections.filter(s=>s.type==="practice").reduce((n,s)=>n+s.questions.length,0);
  return <main className="lesson-shell">
    <header className="lesson-header"><Link className="brand" href="/dashboard"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link><div className="lesson-header-center"><span>{level} · {courseTitle}</span><b>{lesson.title}</b></div><Link className="lesson-exit" href="/dashboard">Exit lesson ↗</Link></header>
    <div className="lesson-layout">
      <aside className="lesson-outline"><div className="outline-kicker">YOUR COURSE · {level}</div><h2>{lesson.title}</h2><p>{lesson.description}</p><div className="outline-progress"><div><span>Lesson progress</span><b>{Math.round((sectionIndex+1)/sections.length*100)}%</b></div><i><span style={{width:((sectionIndex+1)/sections.length*100)+"%"}}/></i></div>
        <nav>{sections.map((s,i)=><button key={i} className={sectionIndex===i?"outline-active":i<sectionIndex?"outline-done":""} onClick={()=>setSectionIndex(i)}><span>{i<sectionIndex?"✓":String(i+1).padStart(2,"0")}</span>{s.title}</button>)}</nav>
        <div className="outline-tip"><b>Today's objective</b><p>{lesson.content.objective}</p></div>
        <div className="outline-tip"><b>Course sequence</b>{lessons.map(l=><p key={l.id}>{l.completed?"✓ ":""}{l.sequence}. {l.title}</p>)}</div>
      </aside>
      <section className="lesson-main"><div className="lesson-topline"><span>SPANISH · {level}</span><span>{lesson.estimated_minutes} MIN · {lesson.points_reward} POINTS</span></div>
        <article className="lesson-panel">
          <div className="lesson-section-label">{section.eyebrow}</div><h1>{section.title}</h1>
          {section.body&&<p className="lesson-intro">{section.body}</p>}
          {section.type==="intro"&&<div className="lesson-callout"><b>What you'll be able to do</b><p>{lesson.content.objective}</p></div>}
          {section.type==="vocabulary"&&<><div className="nahtive-vocab-grid">{section.items.map((item:any)=><div key={item.term}><b>{item.term}</b><span>{item.meaning}</span><em>{item.example}</em></div>)}</div><div className="lesson-callout"><b>Study strategy</b><p>{section.note}</p></div></>}
          {section.type==="reading"&&<><p className="lesson-intro">{section.instructions}</p><div className="reading-card"><div className="reading-card-top"><span>LECTURA · LATINOAMÉRICA</span><span>READ ALOUD ×2</span></div><p>{section.text}</p><div className="reading-gloss"><b>Useful words from the passage</b><span>{section.glossary.map((x:string[])=>x.join(" = ")).join(" · ")}</span></div></div></>}
          {section.type==="grammar"&&<><p className="lesson-intro">{section.body}</p><div className="nahtive-example-list">{section.examples.map((x:string[])=><div key={x[0]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div><h3 className="lesson-h3">{section.table.heading}</h3><div className="nahtive-table-wrap"><table className="nahtive-table"><thead><tr>{section.table.columns.map((c:string)=><th key={c}>{c}</th>)}</tr></thead><tbody>{section.table.rows.map((row:string[])=><tr key={row[0]}>{row.map((cell:string)=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div><div className="lesson-callout"><b>Important distinction</b><p>{section.note}</p></div><h3 className="lesson-h3">Build the sentence</h3><div className="grammar-example"><span>WORD ORDER</span><strong>{section.pattern}</strong><small>{section.patternExample}</small></div><ol className="nahtive-steps">{section.steps.map((s:string)=><li key={s}>{s}</li>)}</ol></>}
          {section.type==="practice"&&<><p className="lesson-intro">{section.instructions}</p>{renderQuestions(section.questions,0)}<button className="lesson-secondary" type="button" onClick={()=>setShowFeedback(v=>!v)}>{showFeedback?"Hide explanations":"Check my answers and explain"}</button></>}
          {section.type==="production"&&<><p className="lesson-intro">{section.instructions}</p><div className="production-prompts">{section.prompts.map((p:string,i:number)=><div className="response-field" key={p}><label>{i+1}. {p}</label></div>)}</div><textarea className="nahtive-production" value={production} onChange={e=>setProduction(e.target.value)} placeholder="El fin de semana pasado..." rows={7}/><div className="lesson-callout"><b>Self-review checklist</b>{section.checklist.map((c:string)=><p key={c}>□ {c}</p>)}</div><div className="lesson-callout"><b>Model response (open after writing)</b><details><summary>Compare your response</summary><p>{section.model}</p></details></div></>}
          {section.type==="assessment"&&<><p className="lesson-intro">{section.instructions}</p>{renderQuestions(section.questions,assessmentOffset)}{result&&<div className="score-panel"><span>YOUR RESULT</span><strong>{score}%</strong><p>{result.passed?"You passed this lesson. Your progress is saved and the next lesson is unlocked.":"You need 80% to pass. Read each explanation, retry the examples, and submit again."}</p>{result.passed&&<b>+{result.points} points earned</b>}</div>}<button className="lesson-primary" type="button" disabled={!allAnswered||production.trim().length<20||busy||result?.passed} onClick={submit}>{busy?"Saving your work…":result?.passed?"Completed":"Submit assessment →"}</button></>}
        </article>
        <footer className="lesson-navigation"><button type="button" onClick={()=>setSectionIndex(i=>Math.max(0,i-1))} disabled={sectionIndex===0}>← Previous</button><span>{sectionIndex+1} of {sections.length}</span>{sectionIndex<sections.length-1?<button className="lesson-next" type="button" onClick={()=>setSectionIndex(i=>Math.min(sections.length-1,i+1))}>Next section →</button>:result?.passed?<Link className="lesson-next" href={lessons.find(l=>l.sequence===lesson.sequence+1)?"/lesson?slug="+lessons.find(l=>l.sequence===lesson.sequence+1)?.slug:"/dashboard"}>{lessons.find(l=>l.sequence===lesson.sequence+1)?"Next lesson →":"Course dashboard →"}</Link>:<button className="lesson-next" type="button" onClick={()=>setSectionIndex(0)}>Review lesson ↺</button>}</footer>
      </section>
    </div>
  </main>;
}

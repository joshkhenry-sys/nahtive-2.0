"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const steps = ["Reading", "Grammar", "Comprehension", "Guided practice", "Production", "Assessment"];
const passage = "Ayer fue un día bastante ocupado. Por la mañana, me desperté a las siete, preparé café y desayuné con mi hermana. Después, caminamos hasta el centro porque queríamos comprar un regalo para nuestra madre. Primero, visitamos una librería y encontramos un libro interesante. Luego, almorzamos en un pequeño restaurante. Yo pedí una ensalada y mi hermana comió tacos. Por la tarde, regresamos a casa y envolvimos el regalo. Más tarde, llamé a mi madre para preguntarle si estaba en casa. No le dije nada del regalo porque quería darle una sorpresa. Al final del día, vimos una película y descansamos.";
const blanks = [
  { prompt: "Ayer yo _____ (preparar) café.", answer: "preparé", hint: "yo · preparar" },
  { prompt: "Nosotros _____ (caminar) hasta el centro.", answer: "caminamos", hint: "nosotros · caminar" },
  { prompt: "Mi hermana _____ (comer) tacos.", answer: "comió", hint: "ella · comer" },
  { prompt: "Por la tarde, _____ (regresar) a casa.", answer: "regresamos", hint: "nosotros · regresar" },
];
const quiz = [
  { q: "El sábado pasado, nosotros _____ en casa.", options: ["estudiamos", "estudiábamos", "estudiar"], answer: "estudiamos", why: "““El sábado pasado” refers to a completed time in the past. “Estudiamos” is the nosotros preterite form." },
  { q: "Ayer, Marta _____ una película.", options: ["miró", "mira", "miraba"], answer: "miró", why: "“Miró” is the preterite form for ella/él/usted." },
  { q: "What is the yo form of “beber” in the preterite?", options: ["bebí", "bebió", "bebía"], answer: "bebí", why: "Regular -er and -ir verbs use -í for the yo form in the preterite." },
  { q: "Completa: Anoche, mis amigos _____ tarde.", options: ["llegaron", "llegamos", "llegan"], answer: "llegaron", why: "“Mis amigos” = ellos; llegar → llegaron." },
  { q: "Which sentence describes an action completed yesterday?", options: ["Normalmente cocino.", "Ayer cociné.", "Estoy cocinando."], answer: "Ayer cociné.", why: "The preterite presents the action as a completed event in the past." },
];

export default function A2PastLesson() {
  const [step, setStep] = useState(0);
  const [blankAnswers, setBlankAnswers] = useState(["", "", "", ""]);
  const [blanksChecked, setBlanksChecked] = useState(false);
  const [responses, setResponses] = useState(["", "", ""]);
  const [quizAnswers, setQuizAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [readDone, setReadDone] = useState(false);
  const [comprehension, setComprehension] = useState(["", "", ""]);
  const [comprehensionChecked, setComprehensionChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const quizScore = useMemo(() => quiz.reduce((total, item, i) => total + (quizAnswers[i] === item.answer ? 1 : 0), 0), [quizAnswers]);
  const progress = Math.round(((step + (step === 0 && readDone ? 1 : 0)) / steps.length) * 100);
  const updateBlank = (index: number, value: string) => setBlankAnswers(old => old.map((v, i) => i === index ? value : v));
  const updateResponse = (index: number, value: string) => setResponses(old => old.map((v, i) => i === index ? value : v));
  const updateQuiz = (index: number, value: string) => { setQuizAnswers(old => old.map((v, i) => i === index ? value : v)); setQuizSubmitted(false); };

  return <main className="lesson-shell">
    <header className="lesson-header">
      <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
      <div className="lesson-header-center"><span>A2 · UNIDAD 04</span><b>Hablar del pasado</b></div>
      <Link className="lesson-exit" href="/dashboard">Salir de la lección ↗</Link>
    </header>
    <div className="lesson-layout">
      <aside className="lesson-outline">
        <div className="outline-kicker">TU LECCIÓN</div>
        <h2>Hablar del pasado</h2>
        <p>Usa el pretérito para contar acciones terminadas.</p>
        <div className="outline-progress"><div><span>Progreso</span><b>{progress}%</b></div><i><span style={{ width: progress + "%" }} /></i></div>
        <nav>{steps.map((label, i) => <button key={label} className={step === i ? "outline-active" : step > i ? "outline-done" : ""} onClick={() => setStep(i)}><span>{step > i ? "✓" : String(i + 1).padStart(2, "0")}</span>{label}</button>)}</nav>
        <div className="outline-tip"><b>Today’s objective</b><p>By the end, you will be able to describe a simple sequence of completed past actions.</p></div>
      </aside>
      <section className="lesson-main">
        <div className="lesson-topline"><span>ESPAÑOL · NIVEL A2</span><span>25–30 MIN</span></div>
        {step === 0 && <article className="lesson-panel">
          <div className="lesson-section-label">01 · LEE PARA COMPRENDER</div>
          <h1>A day downtown</h1>
          <p className="lesson-intro">Read the passage twice. First, identify the main idea. Then notice which actions happened and the order in which they took place.</p>
          <div className="reading-card"><div className="reading-card-top"><span>READING</span><span>≈ 100 WORDS</span></div><p>{passage}</p><div className="reading-gloss"><b>Notice these verb forms:</b><span>me desperté · preparé · caminamos · visitamos · encontramos · almorzamos · pedí · comió · regresamos · llamé · vimos</span></div></div>
          <label className="lesson-checkline"><input type="checkbox" checked={readDone} onChange={e => setReadDone(e.target.checked)} /> I have read the passage twice and can explain what it is about.</label>
          <div className="lesson-callout"><b>Reading tip</b><p>Do not translate every word. Look for who performed each action, what they did, and when it happened.</p></div>
        </article>}
        {step === 1 && <article className="lesson-panel">
          <div className="lesson-section-label">02 · OBSERVA LA ESTRUCTURA</div>
          <h1>The preterite: completed actions</h1>
          <p className="lesson-intro">We use the preterite to describe actions as completed events in the past. It often appears with time expressions such as <em>ayer</em>, <em>anoche</em>, <em>el lunes pasado</em> y <em>la semana pasada</em>.</p>
          <div className="grammar-example"><span>AYER</span><strong>Ayer <em>preparé</em> café y <em>desayuné</em> con mi hermana.</strong><small>Dos acciones completadas en el pasado.</small></div>
          <h3 className="lesson-h3">Terminaciones regulares</h3>
          <div className="conjugation-grid"><div><b>Verbos -AR · preparar</b>{[["yo","preparé"],["tú","preparaste"],["él / ella / usted","preparó"],["nosotros/as","preparamos"],["ellos / ellas / ustedes","prepararon"]].map(([p,v])=><div key={p}><span>{p}</span><strong>{v}</strong></div>)}</div><div><b>Verbos -ER / -IR · comer / vivir</b>{[["yo","comí / viví"],["tú","comiste / viviste"],["él / ella / usted","comió / vivió"],["nosotros/as","comimos / vivimos"],["ellos / ellas / ustedes","comieron / vivieron"]].map(([p,v])=><div key={p}><span>{p}</span><strong>{v}</strong></div>)}</div></div>
          <div className="lesson-callout"><b>Watch out: one verb form can have more than one meaning</b><p><strong>Hablamos</strong> can be either present or preterite. Context tells you which tense is intended: “Normalmente hablamos” (present) / “Ayer hablamos” (preterite).</p></div>
          <h3 className="lesson-h3">Irregulares muy frecuentes</h3><p className="lesson-body"><strong>ir / ser → fui, fuiste, fue, fuimos, fueron</strong><br/><strong>hacer → hice, hiciste, hizo, hicimos, hicieron</strong><br/><strong>ver → vi, viste, vio, vimos, vieron</strong></p>
          <p className="lesson-note">Focus first on regular endings in this lesson. The irregular forms are introduced as high-frequency verbs you should learn to recognize.</p>
        </article>}
        {step === 2 && <article className="lesson-panel">
          <div className="lesson-section-label">03 · COMPRUEBA EL SIGNIFICADO</div>
          <h1>What happened in the story?</h1>
          <p className="lesson-intro">Answer in Spanish using short sentences. You do not need to copy the passage word for word.</p>
          <div className="comprehension-list">
            {[["Why did they walk downtown?","Porque querían comprar un regalo para su madre."],["What did the narrator order?","Pidió una ensalada."],["What did the narrator do after returning home?","Envolvió el regalo y después llamó a su madre."]].map(([q,a],i)=><div className="response-field" key={q}><label>{i+1}. {q}</label><textarea value={comprehension[i]} onChange={e=>setComprehension(old=>old.map((v,j)=>i===j?e.target.value:v))} placeholder="Write your answer in Spanish..." rows={2}/>{comprehensionChecked&&<small className="model-answer">Possible answer: {a}</small>}</div>)}
          </div>
          <button className="lesson-secondary" onClick={()=>setComprehensionChecked(v=>!v)}>{comprehensionChecked?"Hide sample answers":"View sample answers"}</button>
        </article>}
        {step === 3 && <article className="lesson-panel">
          <div className="lesson-section-label">04 · GUIDED PRACTICE</div>
          <h1>Elige la forma correcta</h1>
          <p className="lesson-intro">Complete each sentence with the preterite form of the verb in parentheses. Pay attention to the subject.</p>
          <div className="fill-list">{blanks.map((item,i)=><div className="fill-item" key={item.prompt}><label>{i+1}. {item.prompt}</label><input value={blankAnswers[i]} onChange={e=>{updateBlank(i,e.target.value);setBlanksChecked(false);}} placeholder="Enter the verb form..." /><small>{item.hint}</small>{blanksChecked&&<div className={blankAnswers[i].trim().toLowerCase()===item.answer?"inline-feedback correct":"inline-feedback incorrect"}>{blankAnswers[i].trim().toLowerCase()===item.answer?"Correct!":"Answer: "+item.answer}</div>}</div>)}</div>
          <button className="lesson-secondary" onClick={()=>setShowHints(v=>!v)}>{showHints?"Hide hint":"Show me a hint"}</button>{showHints&&<div className="lesson-callout"><b>Hint</b><p>-AR: é, aste, ó, amos, aron. -ER/-IR: í, iste, ió, imos, ieron.</p></div>}
          <button className="lesson-primary" onClick={()=>setBlanksChecked(true)}>Comprobar respuestas →</button>
        </article>}
        {step === 4 && <article className="lesson-panel">
          <div className="lesson-section-label">05 · INDEPENDENT PRODUCTION</div>
          <h1>Cuenta algo que hiciste</h1>
          <p className="lesson-intro">Now use this structure to talk about your own life. Write complete sentences and connect your actions with <em>primero</em>, <em>después</em>, <em>luego</em> y <em>al final</em>.</p>
          <div className="production-prompts">{["What did you do yesterday morning?","Where did you go, or what did you do next?","How did your day end?"].map((q,i)=><div className="response-field" key={q}><label>{i+1}. {q}</label><textarea value={responses[i]} onChange={e=>updateResponse(i,e.target.value)} rows={3} placeholder="Ayer por la mañana..."/></div>)}</div>
          <div className="lesson-callout"><b>Review your writing</b><p>Did you use the preterite for completed actions? Do the verbs agree with their subjects? Are your ideas in a clear order?</p></div>
        </article>}
        {step === 5 && <article className="lesson-panel">
          <div className="lesson-section-label">06 · ASSESSMENT</div>
          <h1>Comprueba lo que aprendiste</h1>
          <p className="lesson-intro">Answer five questions to check whether you can recognize and use the regular preterite in context.</p>
          <div className="quiz-list">{quiz.map((item,i)=><div className="quiz-item" key={item.q}><b>{i+1}. {item.q}</b><div className="quiz-options">{item.options.map(option=><button key={option} className={quizAnswers[i]===option?"quiz-selected":""} onClick={()=>updateQuiz(i,option)}>{option}</button>)}</div>{quizSubmitted&&<div className={quizAnswers[i]===item.answer?"inline-feedback correct":"inline-feedback incorrect"}>{quizAnswers[i]===item.answer?"Correct. ":"Review this. "}{item.why}</div>}</div>)}</div>
          {quizSubmitted&&<div className="score-panel"><span>YOUR RESULT</span><strong>{quizScore}/5</strong><p>{quizScore===5?"Excellent. You have demonstrated strong control of this learning objective.":quizScore>=3?"Good work. Review the explanations and practise the forms you found difficult.":"Review the explanation and repeat the practice before moving on."}</p></div>}
          <button className="lesson-primary" onClick={()=>setQuizSubmitted(true)} disabled={quizAnswers.some(a=>!a)}>Submit assessment →</button>
        </article>}
        <footer className="lesson-navigation"><button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Anterior</button><span>{step+1} de {steps.length}</span>{step<5?<button className="lesson-next" onClick={()=>setStep(s=>Math.min(5,s+1))}>Siguiente: {steps[step+1]} →</button>:<Link className="lesson-next" href="/dashboard">Volver al panel →</Link>}</footer>
      </section>
    </div>
  </main>;
}

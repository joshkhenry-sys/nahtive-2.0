"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const steps = ["Lectura", "Gramática", "Comprensión", "Práctica", "Producción", "Evaluación"];
const passage = "Ayer fue un día bastante ocupado. Por la mañana, me desperté a las siete, preparé café y desayuné con mi hermana. Después, caminamos hasta el centro porque queríamos comprar un regalo para nuestra madre. Primero, visitamos una librería y encontramos un libro interesante. Luego, almorzamos en un pequeño restaurante. Yo pedí una ensalada y mi hermana comió tacos. Por la tarde, regresamos a casa y envolvimos el regalo. Más tarde, llamé a mi madre para preguntarle si estaba en casa. No le dije nada del regalo porque quería darle una sorpresa. Al final del día, vimos una película y descansamos.";
const blanks = [
  { prompt: "Ayer yo _____ (preparar) café.", answer: "preparé", hint: "yo · preparar" },
  { prompt: "Nosotros _____ (caminar) hasta el centro.", answer: "caminamos", hint: "nosotros · caminar" },
  { prompt: "Mi hermana _____ (comer) tacos.", answer: "comió", hint: "ella · comer" },
  { prompt: "Por la tarde, _____ (regresar) a casa.", answer: "regresamos", hint: "nosotros · regresar" },
];
const quiz = [
  { q: "El sábado pasado, nosotros _____ en casa.", options: ["estudiamos", "estudiábamos", "estudiar"], answer: "estudiamos", why: "“El sábado pasado” señala un momento terminado. “Estudiamos” es el pretérito de nosotros." },
  { q: "Ayer, Marta _____ una película.", options: ["miró", "mira", "miraba"], answer: "miró", why: "“Miró” es la forma de pretérito para ella/él/usted." },
  { q: "¿Cuál es la forma de yo para “beber” en pretérito?", options: ["bebí", "bebió", "bebía"], answer: "bebí", why: "Los verbos -er/-ir usan -í en la forma yo del pretérito." },
  { q: "Completa: Anoche, mis amigos _____ tarde.", options: ["llegaron", "llegamos", "llegan"], answer: "llegaron", why: "“Mis amigos” = ellos; llegar → llegaron." },
  { q: "¿Qué frase describe una acción terminada ayer?", options: ["Normalmente cocino.", "Ayer cociné.", "Estoy cocinando."], answer: "Ayer cociné.", why: "El pretérito presenta la acción como un hecho completado en el pasado." },
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
        <div className="outline-tip"><b>Objetivo de hoy</b><p>Al terminar, podrás contar una secuencia sencilla de acciones que ya ocurrieron.</p></div>
      </aside>
      <section className="lesson-main">
        <div className="lesson-topline"><span>ESPAÑOL · NIVEL A2</span><span>25–30 MIN</span></div>
        {step === 0 && <article className="lesson-panel">
          <div className="lesson-section-label">01 · LEE PARA COMPRENDER</div>
          <h1>Un día en el centro</h1>
          <p className="lesson-intro">Lee el texto dos veces. Primero, busca la idea general. Después, identifica las acciones que ocurrieron y el orden en que sucedieron.</p>
          <div className="reading-card"><div className="reading-card-top"><span>LECTURA</span><span>≈ 130 PALABRAS</span></div><p>{passage}</p><div className="reading-gloss"><b>Fíjate en estas formas:</b><span>me desperté · preparé · caminamos · visitamos · encontramos · almorzamos · pedí · comió · regresamos · llamé · vimos</span></div></div>
          <label className="lesson-checkline"><input type="checkbox" checked={readDone} onChange={e => setReadDone(e.target.checked)} /> He leído el texto dos veces y puedo explicar de qué trata.</label>
          <div className="lesson-callout"><b>Estrategia</b><p>No traduzcas cada palabra. Busca quién hizo cada acción, qué hizo y cuándo ocurrió.</p></div>
        </article>}
        {step === 1 && <article className="lesson-panel">
          <div className="lesson-section-label">02 · OBSERVA LA ESTRUCTURA</div>
          <h1>El pretérito: acciones terminadas</h1>
          <p className="lesson-intro">Usamos el pretérito para presentar acciones como hechos completados en un momento pasado. Es frecuente con expresiones como <em>ayer</em>, <em>anoche</em>, <em>el lunes pasado</em> y <em>la semana pasada</em>.</p>
          <div className="grammar-example"><span>AYER</span><strong>Ayer <em>preparé</em> café y <em>desayuné</em> con mi hermana.</strong><small>Dos acciones completadas en el pasado.</small></div>
          <h3 className="lesson-h3">Terminaciones regulares</h3>
          <div className="conjugation-grid"><div><b>Verbos -AR · preparar</b>{[["yo","preparé"],["tú","preparaste"],["él / ella / usted","preparó"],["nosotros/as","preparamos"],["ellos / ellas / ustedes","prepararon"]].map(([p,v])=><div key={p}><span>{p}</span><strong>{v}</strong></div>)}</div><div><b>Verbos -ER / -IR · comer / vivir</b>{[["yo","comí / viví"],["tú","comiste / viviste"],["él / ella / usted","comió / vivió"],["nosotros/as","comimos / vivimos"],["ellos / ellas / ustedes","comieron / vivieron"]].map(([p,v])=><div key={p}><span>{p}</span><strong>{v}</strong></div>)}</div></div>
          <div className="lesson-callout"><b>Ojo: una forma puede tener más de un significado</b><p><strong>Hablamos</strong> puede ser presente o pretérito. El contexto indica el tiempo: “Normalmente hablamos” (presente) / “Ayer hablamos” (pretérito).</p></div>
          <h3 className="lesson-h3">Irregulares muy frecuentes</h3><p className="lesson-body"><strong>ir / ser → fui, fuiste, fue, fuimos, fueron</strong><br/><strong>hacer → hice, hiciste, hizo, hicimos, hicieron</strong><br/><strong>ver → vi, viste, vio, vimos, vieron</strong></p>
          <p className="lesson-note">En esta lección, concéntrate primero en las terminaciones regulares. Los irregulares aparecen como vocabulario de alta frecuencia que conviene reconocer.</p>
        </article>}
        {step === 2 && <article className="lesson-panel">
          <div className="lesson-section-label">03 · COMPRUEBA EL SIGNIFICADO</div>
          <h1>¿Qué pasó en la historia?</h1>
          <p className="lesson-intro">Responde en español con frases breves. No necesitas copiar el texto palabra por palabra.</p>
          <div className="comprehension-list">
            {[["¿Por qué caminaron hasta el centro?","Porque querían comprar un regalo para su madre."],["¿Qué pidió la persona que narra?","Pidió una ensalada."],["¿Qué hizo después de regresar a casa?","Envolvió el regalo y después llamó a su madre."]].map(([q,a],i)=><div className="response-field" key={q}><label>{i+1}. {q}</label><textarea value={comprehension[i]} onChange={e=>setComprehension(old=>old.map((v,j)=>i===j?e.target.value:v))} placeholder="Escribe tu respuesta en español..." rows={2}/>{comprehensionChecked&&<small className="model-answer">Respuesta posible: {a}</small>}</div>)}
          </div>
          <button className="lesson-secondary" onClick={()=>setComprehensionChecked(v=>!v)}>{comprehensionChecked?"Ocultar respuestas posibles":"Ver respuestas posibles"}</button>
        </article>}
        {step === 3 && <article className="lesson-panel">
          <div className="lesson-section-label">04 · PRÁCTICA GUIADA</div>
          <h1>Elige la forma correcta</h1>
          <p className="lesson-intro">Completa cada frase con el pretérito del verbo entre paréntesis. Presta atención al sujeto.</p>
          <div className="fill-list">{blanks.map((item,i)=><div className="fill-item" key={item.prompt}><label>{i+1}. {item.prompt}</label><input value={blankAnswers[i]} onChange={e=>{updateBlank(i,e.target.value);setBlanksChecked(false);}} placeholder="Escribe la forma..." /><small>{item.hint}</small>{blanksChecked&&<div className={blankAnswers[i].trim().toLowerCase()===item.answer?"inline-feedback correct":"inline-feedback incorrect"}>{blankAnswers[i].trim().toLowerCase()===item.answer?"¡Correcto!":"Respuesta: "+item.answer}</div>}</div>)}</div>
          <button className="lesson-secondary" onClick={()=>setShowHints(v=>!v)}>{showHints?"Ocultar pista":"Necesito una pista"}</button>{showHints&&<div className="lesson-callout"><b>Pista</b><p>-AR: é, aste, ó, amos, aron. -ER/-IR: í, iste, ió, imos, ieron.</p></div>}
          <button className="lesson-primary" onClick={()=>setBlanksChecked(true)}>Comprobar respuestas →</button>
        </article>}
        {step === 4 && <article className="lesson-panel">
          <div className="lesson-section-label">05 · PRODUCCIÓN INDEPENDIENTE</div>
          <h1>Cuenta algo que hiciste</h1>
          <p className="lesson-intro">Ahora usa la estructura para hablar de tu propia vida. Escribe frases completas; intenta conectar las acciones con <em>primero</em>, <em>después</em>, <em>luego</em> y <em>al final</em>.</p>
          <div className="production-prompts">{["¿Qué hiciste ayer por la mañana?","¿Adónde fuiste o qué hiciste después?","¿Cómo terminó tu día?"].map((q,i)=><div className="response-field" key={q}><label>{i+1}. {q}</label><textarea value={responses[i]} onChange={e=>updateResponse(i,e.target.value)} rows={3} placeholder="Ayer por la mañana..."/></div>)}</div>
          <div className="lesson-callout"><b>Revisa tu texto</b><p>¿Usaste el pretérito para las acciones terminadas? ¿Concuerdan los verbos con el sujeto? ¿El orden de las ideas está claro?</p></div>
        </article>}
        {step === 5 && <article className="lesson-panel">
          <div className="lesson-section-label">06 · EVALUACIÓN</div>
          <h1>Comprueba lo que aprendiste</h1>
          <p className="lesson-intro">Cinco preguntas para comprobar si puedes reconocer y usar el pretérito regular en contexto.</p>
          <div className="quiz-list">{quiz.map((item,i)=><div className="quiz-item" key={item.q}><b>{i+1}. {item.q}</b><div className="quiz-options">{item.options.map(option=><button key={option} className={quizAnswers[i]===option?"quiz-selected":""} onClick={()=>updateQuiz(i,option)}>{option}</button>)}</div>{quizSubmitted&&<div className={quizAnswers[i]===item.answer?"inline-feedback correct":"inline-feedback incorrect"}>{quizAnswers[i]===item.answer?"Correcto. ":"Revisa esto. "}{item.why}</div>}</div>)}</div>
          {quizSubmitted&&<div className="score-panel"><span>RESULTADO</span><strong>{quizScore}/5</strong><p>{quizScore===5?"Excelente. Has demostrado un buen control de este objetivo.":quizScore>=3?"Buen trabajo. Revisa las explicaciones y practica las formas que te costaron.":"Vuelve a la explicación y repite la práctica antes de avanzar."}</p></div>}
          <button className="lesson-primary" onClick={()=>setQuizSubmitted(true)} disabled={quizAnswers.some(a=>!a)}>Calificar evaluación →</button>
        </article>}
        <footer className="lesson-navigation"><button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Anterior</button><span>{step+1} de {steps.length}</span>{step<5?<button className="lesson-next" onClick={()=>setStep(s=>Math.min(5,s+1))}>Siguiente: {steps[step+1]} →</button>:<Link className="lesson-next" href="/dashboard">Volver al panel →</Link>}</footer>
      </section>
    </div>
  </main>;
}

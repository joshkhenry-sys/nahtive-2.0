"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Mode = "repeat" | "guided" | "free";
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const modes: { id: Mode; title: string; description: string }[] = [
  { id: "repeat", title: "Listen & repeat", description: "Hear a natural phrase, repeat it, and get clear pronunciation and grammar feedback." },
  { id: "guided", title: "Guided conversation", description: "Practise a real-life situation with prompts and helpful corrections." },
  { id: "free", title: "Free conversation", description: "Have a more natural Spanish conversation with the tutor." },
];

const levelNotes: Record<Level, string> = {
  A1: "Use very common words, short sentences, and slow, clear Spanish. Offer English support when needed.",
  A2: "Use everyday situations, familiar vocabulary, and connected simple sentences. Explain important corrections in clear English.",
  B1: "Keep the conversation natural and practical. Ask follow-up questions and help the learner narrate, explain, and give opinions.",
  B2: "Use natural conversational Spanish, varied structures, idioms, and nuanced follow-up questions. Correct recurring errors without interrupting every sentence.",
  C1: "Use precise, fluent Spanish with nuance, register shifts, idiomatic language, and complex discussion. Give sophisticated feedback.",
  C2: "Use highly natural, nuanced Spanish. Explore subtle meaning, style, humor, idioms, and regional variation while maintaining an authentic conversation.",
};

function tutorInstructions(level: Level, mode: Mode) {
  const modeInstruction = mode === "repeat"
    ? "Run a listen-and-repeat drill. Say ONE short, useful Latin American Spanish phrase clearly, then stop and wait for the learner to repeat it. Compare their attempt with the target phrase. Give specific, kind feedback on pronunciation, stress, rhythm, and grammar. Then offer the next phrase. Never pretend you can hear a sound that is not present in the audio."
    : mode === "guided"
      ? "Run a guided role-play based on a practical everyday Latin American situation such as ordering food, meeting someone, making plans, shopping, travel, or handling an everyday problem. Stay in character, ask one manageable question at a time, and give concise corrections after the learner responds."
      : "Have a natural, engaging conversation in Latin American Spanish. Ask one question at a time, respond to what the learner actually says, ask relevant follow-ups, and avoid turning the conversation into a lecture.";
  return "You are Nahtive, a warm, patient, highly capable Latin American Spanish conversation tutor. Teach Spanish only; English is the learner's support language. Avoid Spain-specific vosotros and Spain-only phrasing. Prefer broadly understood Latin American Spanish and explain regional alternatives when useful. CEFR level: " + level + ". " + levelNotes[level] + " Mode: " + modeInstruction + " Speak at a natural but level-appropriate pace. Do not overpraise. Correct meaningful mistakes with the improved Spanish version and a brief explanation in English when helpful. Keep your spoken turns concise so the learner gets plenty of speaking time. Start now with a short welcome and the first activity.";
}

function pcm16ToBase64(float32: Float32Array) {
  const bytes = new Uint8Array(float32.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < float32.length; i++) {
    const sample = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default function SpeakPage() {
  const [level, setLevel] = useState<Level>("A2");
  const [mode, setMode] = useState<Mode>("guided");
  const [status, setStatus] = useState<"idle" | "connecting" | "live">("idle");
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState<{ who: string; text: string }[]>([]);
  const [muted, setMuted] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextPlayTimeRef = useRef(0);

  function stopSession() {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(track => track.stop());
    inputContextRef.current?.close().catch(() => {});
    outputContextRef.current?.close().catch(() => {});
    socketRef.current?.close();
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    inputContextRef.current = null;
    outputContextRef.current = null;
    socketRef.current = null;
    nextPlayTimeRef.current = 0;
    setStatus("idle");
    setMuted(false);
  }

  async function startSession() {
    setError("");
    setTranscript([]);
    setStatus("connecting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone access is unavailable. Open Nahtive in a secure browser tab and allow microphone access.");
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      streamRef.current = micStream;

      const tokenResponse = await fetch("/api/gemini/token", { method: "POST" });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenData.token) throw new Error(tokenData.error || "Could not create a secure voice session.");

      const socket = new WebSocket("wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=" + encodeURIComponent(tokenData.token));
      socketRef.current = socket;
      const outputContext = new AudioContext({ sampleRate: 24000 });
      const inputContext = new AudioContext({ sampleRate: 16000 });
      outputContextRef.current = outputContext;
      inputContextRef.current = inputContext;
      await outputContext.resume();
      await inputContext.resume();

      socket.onopen = () => {
        socket.send(JSON.stringify({
          setup: {
            model: "models/gemini-3.8-live",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } },
            },
            systemInstruction: { parts: [{ text: tutorInstructions(level, mode) }] },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        }));
      };

      socket.onmessage = async event => {
        try {
          const message = JSON.parse(typeof event.data === "string" ? event.data : await event.data.text());
          if (message.setupComplete) {
            setStatus("live");
            socket.send(JSON.stringify({ clientContent: { turns: [{ role: "user", parts: [{ text: "Begin the activity now. Speak first." }] }], turnComplete: true } }));
            if (inputContextRef.current && streamRef.current) {
              const context = inputContextRef.current;
              const source = context.createMediaStreamSource(streamRef.current);
              const processor = context.createScriptProcessor(2048, 1, 1);
              source.connect(processor);
              processor.connect(context.destination);
              sourceRef.current = source;
              processorRef.current = processor;
              processor.onaudioprocess = audioEvent => {
                if (muted || socket.readyState !== WebSocket.OPEN) return;
                const input = audioEvent.inputBuffer.getChannelData(0);
                const targetLength = Math.round(input.length * 16000 / context.sampleRate);
                const resampled = new Float32Array(targetLength);
                for (let i = 0; i < targetLength; i++) {
                  const sourceIndex = i * context.sampleRate / 16000;
                  const left = Math.floor(sourceIndex);
                  const right = Math.min(left + 1, input.length - 1);
                  const fraction = sourceIndex - left;
                  resampled[i] = input[left] * (1 - fraction) + input[right] * fraction;
                }
                socket.send(JSON.stringify({ realtimeInput: { audio: { mimeType: "audio/pcm;rate=16000", data: pcm16ToBase64(resampled) } } }));
              };
            }
          }
          if (message.inputTranscription?.text) {
            setTranscript(old => {
              const text = message.inputTranscription.text;
              const last = old[old.length - 1];
              if (last?.who === "You") return [...old.slice(0, -1), { who: "You", text: last.text + text }];
              return [...old, { who: "You", text }];
            });
          }
          if (message.outputTranscription?.text) {
            setTranscript(old => {
              const text = message.outputTranscription.text;
              const last = old[old.length - 1];
              if (last?.who === "Nahtive") return [...old.slice(0, -1), { who: "Nahtive", text: last.text + text }];
              return [...old, { who: "Nahtive", text }];
            });
          }
          if (message.serverContent?.interrupted && outputContextRef.current) nextPlayTimeRef.current = outputContextRef.current.currentTime;
          for (const part of message.serverContent?.modelTurn?.parts || []) {
            if (part.inlineData?.data && outputContextRef.current) {
              const bytes = base64ToBytes(part.inlineData.data);
              const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
              const samples = new Float32Array(pcm.length);
              for (let i = 0; i < pcm.length; i++) samples[i] = pcm[i] / 32768;
              const ctx = outputContextRef.current;
              const buffer = ctx.createBuffer(1, samples.length, 24000);
              buffer.copyToChannel(samples, 0);
              const player = ctx.createBufferSource();
              player.buffer = buffer;
              player.connect(ctx.destination);
              const startAt = Math.max(ctx.currentTime + 0.03, nextPlayTimeRef.current);
              player.start(startAt);
              nextPlayTimeRef.current = startAt + buffer.duration;
            }
          }
        } catch (e) {
          console.error("Could not process Gemini voice message:", e);
        }
      };
      socket.onerror = () => setError("The live voice connection hit a network error. Please try again.");
      socket.onclose = event => {
        setStatus("idle");
        if (event.code !== 1000) setError("Google ended the voice connection. Please start a new session.");
      };
    } catch (e) {
      stopSession();
      setError(e instanceof Error ? e.message : "Something went wrong starting voice practice.");
    }
  }

  const activeMode = modes.find(item => item.id === mode)!;
  const levelLabels: Record<Level, string> = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper intermediate", C1: "Advanced", C2: "Proficient" };

  return (
    <main className="speak-page">
      <header className="speak-header">
        <Link className="brand" href="/dashboard"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
        <Link href="/dashboard" className="speak-back">← My course</Link>
      </header>
      <div className="speak-wrap">
        <div className="speak-heading">
          <span className="speak-eyebrow">NAHTIVE SPEAK · LIVE AI TUTOR</span>
          <h1>Speak Spanish.<br /><span>Build real fluency.</span></h1>
          <p>Listen, repeat, and have real conversations in Latin American Spanish. Your tutor adapts to your level.</p>
        </div>
        <section className="speak-settings">
          <div className="speak-settings-top"><div><small>YOUR PRACTICE LEVEL</small><h2>Choose your level</h2></div><span>CEFR · A1–C2</span></div>
          <div className="speak-levels">
            {(["A1", "A2", "B1", "B2", "C1", "C2"] as Level[]).map(item => (
              <button key={item} className={level === item ? "selected" : ""} onClick={() => setLevel(item)} disabled={status !== "idle"}><b>{item}</b><small>{levelLabels[item]}</small></button>
            ))}
          </div>
          <div className="speak-settings-top speak-mode-heading"><div><small>HOW DO YOU WANT TO PRACTISE?</small><h2>Choose a speaking mode</h2></div></div>
          <div className="speak-modes">
            {modes.map(item => <button key={item.id} className={mode === item.id ? "selected" : ""} onClick={() => setMode(item.id)} disabled={status !== "idle"}><b>{item.title}</b><span>{item.description}</span></button>)}
          </div>
        </section>
        <section className="speak-console">
          <div className="speak-console-top"><div><span className={status === "live" ? "live-dot on" : "live-dot"} />{status === "live" ? "Tutor connected" : status === "connecting" ? "Connecting to your tutor…" : "Ready when you are"}</div><span>VOICE · SPANISH</span></div>
          <div className="speak-orb"><div className={status === "live" ? "orb-core active" : "orb-core"}><span>n</span></div></div>
          <h2>{status === "live" ? "You're in the conversation." : status === "connecting" ? "Getting your tutor ready…" : "Your Spanish tutor is ready."}</h2>
          <p>{status === "live" ? "Speak naturally. You can interrupt, pause, or stop whenever you like." : activeMode.description}</p>
          {error && <div className="speak-error" role="alert">{error}</div>}
          <div className="speak-controls">
            {status === "idle" ? <button className="speak-start" onClick={startSession}>Start speaking <span>→</span></button> : <><button className="speak-mute" onClick={() => setMuted(v => !v)}>{muted ? "Turn microphone on" : "Mute microphone"}</button><button className="speak-stop" onClick={stopSession}>End session</button></>}
          </div>
          <small className="speak-mic-note">Your browser will ask for microphone permission. Use headphones for the best experience.</small>
        </section>
        <section className="speak-transcript">
          <div><small>LIVE CONVERSATION</small><h2>What you and your tutor say</h2></div>
          {transcript.length === 0 ? <p className="speak-empty">Your conversation transcript will appear here when you start speaking.</p> : transcript.map((line, index) => <div className="transcript-line" key={index}><b>{line.who}</b><p>{line.text}</p></div>)}
        </section>
        <p className="speak-footnote">Nahtive Speak is in early testing. Voice availability and response speed depend on Google's Gemini Live service and your connection.</p>
      </div>
    </main>
  );
}

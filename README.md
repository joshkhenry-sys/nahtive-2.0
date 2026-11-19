# Nahtive 2.0

A Spanish-learning platform built around a structured CEFR curriculum, practical language use, and adaptive AI tutoring.

## Principles
- Spanish only in the first release.
- Contemporary, broadly useful Latin American Spanish.
- Structured lessons with level-appropriate objectives.
- Practice that builds independent sentence construction.
- Light-first, accessible, responsive interface.
- Existing Parla production remains untouched.

## Stack
Next.js App Router, React, TypeScript, custom CSS. Supabase Auth is integrated with the existing account system. Learner progress persistence and AI tutoring are being connected next.

## Local development
Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Status
This first release is a front-end prototype. Sample progress and lesson interactions are local demo state; the lesson player still uses demo progress state; saved lesson attempts and AI tutoring are not yet connected.

## Gemini Live voice practice

The Speak page uses Google's Gemini Live API for two-way Spanish voice conversations. It creates short-lived, single-use Live API tokens on the server; the long-lived API key is never sent to the browser.

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey).
2. In Vercel, open the Nahtive 2.0 project → Settings → Environment Variables.
3. Add `GEMINI_API_KEY` with the key value. Do not add a `NEXT_PUBLIC_` prefix.
4. Apply it to the Production environment (and Preview if you want to test preview deployments), save, then redeploy.
5. Open `/speak`, allow microphone access, choose a CEFR level and speaking mode, and start a session.

For local development, put the same variable in `.env.local`. Never commit the real key.

The current voice tutor is an early test integration. Before public launch, add account-level usage controls and server-side abuse protection, and review Gemini API billing and data-use settings. Google's Live API uses real-time audio input/output; check the [Live API guide](https://ai.google.dev/gemini-api/docs/live) and [pricing](https://ai.google.dev/gemini-api/docs/pricing) before wider release.

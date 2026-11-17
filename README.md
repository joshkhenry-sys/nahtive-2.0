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

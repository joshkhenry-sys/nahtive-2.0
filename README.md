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
Next.js App Router, React, TypeScript, custom CSS. Supabase integration will follow after the data model and security model are validated.

## Local development
Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Status
This first release is a front-end prototype. Sample progress and lesson interactions are local demo state; authentication, persistence, AI tutoring, and curriculum APIs are not connected yet.

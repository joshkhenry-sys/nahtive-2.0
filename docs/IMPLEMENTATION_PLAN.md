# Nahtive 2.0 — Implementation Plan

**Build:** Parallel application; existing production remains untouched.  
**Initial course:** Spanish only.  
**Design:** Light-first, responsive.  
**Learning model:** Structured CEFR curriculum + constrained AI tutoring.

## Architecture
- Web application: Next.js App Router, React, TypeScript.
- UI: reusable components and a documented light-first design system.
- Data/auth: existing Supabase project only after schema, ownership, RLS, and migration audit.
- AI: server-side endpoints, authenticated requests, input validation, quotas, and structured evaluation.
- Hosting: separate Vercel project/preview; no production domain cutover until approved.

## Core boundaries
1. Curriculum: levels, modules, prerequisites, objectives, lesson blueprints.
2. Content: reviewed, versioned lesson content and validated variants.
3. Learning: enrollments, attempts, responses, skill evidence, review schedules.
4. Tutor: feedback and practice constrained by the current objective and rubric.
5. Application: authenticated dashboard, lesson player, practice, review, and progress.

AI must not invent course progression. Curriculum controls what is taught next.

## Phases
### 0 — Foundation and audit
Inspect current repository, deployment, Supabase schema/relations, RLS, API security, and reusable content. No production changes.

### 1 — Application shell
Build design system, landing page, learner dashboard, navigation, responsive states, and accessible controls.

### 2 — Curriculum and lesson engine
Define a versioned lesson contract; implement one complete representative lesson; validate level, grammar, naturalness, reading length, answer keys, accepted alternatives, and objective alignment.

### 3 — Adaptive practice
Record response-level evidence; identify recurring errors; provide targeted practice and spaced review; make skill progress explainable.

### 4 — Persistence and controlled launch
Connect authentication and learner data with tested RLS; migrate eligible records only after mapping; test responsive UX, accessibility, security, and rollback; launch only after explicit cutover approval.

## First-release acceptance criteria
- Spanish is the only available course.
- Learner can register, sign in, and resume saved progress.
- Learner can complete a lesson through assessment.
- Feedback handles natural alternatives and explains actual errors.
- Published lessons pass automated validation and human review.
- Dashboard metrics come from saved learning evidence, not placeholders.
- Learner-owned data is protected by tested RLS and authenticated APIs.
- AI endpoints have abuse controls; secrets stay server-side.
- Existing production remains available until cutover is explicitly approved.

## Current milestone
The initial public landing page and interactive dashboard preview are scaffolded. Sample learner metrics and completion state are local demo data. Auth, database persistence, curriculum APIs, and AI tutoring are not connected yet.

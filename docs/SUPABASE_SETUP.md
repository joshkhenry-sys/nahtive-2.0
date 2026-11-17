# Supabase setup for Nahtive 2.0

Nahtive 2.0 uses the existing Supabase project that already holds the current Nahtive/Parla account and learning data. The new app uses the existing Auth user pool and existing Spanish language enrollment tables. Do not delete, rename, or bulk-update existing tables or users.

## Vercel environment variables

Add these to the Nahtive 2.0 Vercel project for Production, Preview, and Development:

- `NEXT_PUBLIC_SUPABASE_URL=https://tobzuasbijyblusnuics.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<copy the active sb_publishable key from Supabase Project Settings → API Keys>`
- `NEXT_PUBLIC_SITE_URL=https://nahtive-20.vercel.app`

The publishable key is designed for browser use. Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_*` variable or commit it to Git.

## Auth redirect allowlist

In Supabase → Authentication → URL Configuration, preserve the current Site URL and all existing redirect URLs. Add:

- `https://nahtive-20.vercel.app/auth/callback`
- `http://localhost:3000/auth/callback`

If the app later moves to a custom domain, add that callback URL too. Do not replace the existing production site's Site URL or remove its redirects.

## What the app currently does

- Email/password sign-up and sign-in.
- Email confirmation callback using PKCE.
- Session refresh in Next.js 16 `proxy.ts`.
- Protects the dashboard and lesson routes.
- Creates a profile and Spanish learner enrollment on first authenticated sign-in, without overwriting an existing profile or enrollment.
- Uses the English native-language default and Spanish as the course language.

## Before public launch

1. Add the environment variables in Vercel and redeploy.
2. Confirm the callback URLs in Supabase.
3. Test sign-up, email confirmation, sign-in, sign-out, and protected routes.
4. Verify lesson attempts and progress are written to the database before advertising saved progress.
5. Enable leaked-password protection in Supabase Auth settings.

import Link from "next/link";
import { signIn, signInWithGoogle } from "@/app/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
        <h1>Welcome back.</h1>
        <p>Sign in to continue learning Spanish.</p>
        {params.message && <p className="auth-message" role="status">{params.message}</p>}
        {params.error && <p className="auth-error" role="alert">{params.error}</p>}
        <form action={signInWithGoogle} className="auth-form"><button type="submit">Continue with Google</button></form>
        <p className="auth-switch">or sign in with email</p>
        <form className="auth-form" action={signIn}>
          <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" required /></label>
          <button type="submit">Sign in</button>
        </form>
        <p className="auth-switch">New to Nahtive? <Link href="/signup">Create an account</Link></p>
        <Link className="auth-back" href="/">← Back to home</Link>
      </section>
    </main>
  );
}

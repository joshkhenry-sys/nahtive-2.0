import Link from "next/link";
import { signUp, signInWithGoogle } from "@/app/auth/actions";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand" href="/"><span className="brand-symbol">n</span><span>nahtive<span className="brand-dot">.</span></span></Link>
        <h1>Start learning Spanish.</h1>
        <p>Create your account. Your course interface and explanations are in English; the learning happens in Spanish.</p>
        {params.error && <p className="auth-error" role="alert">{params.error}</p>}
        <form action={signInWithGoogle} className="auth-form"><button type="submit">Continue with Google</button></form>
        <p className="auth-switch">or sign up with email</p>
        <form className="auth-form" action={signUp}>
          <label>Your name<input type="text" name="displayName" autoComplete="name" /></label>
          <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
          <label>Password<input type="password" name="password" autoComplete="new-password" minLength={8} required /></label>
          <button type="submit">Create account</button>
        </form>
        <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
        <Link className="auth-back" href="/">← Back to home</Link>
      </section>
    </main>
  );
}

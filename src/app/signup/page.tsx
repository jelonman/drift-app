"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Sign up failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-6 pt-20 pb-32">
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create your account</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        One account for all four apps. Free tiers included.
      </p>
      <form onSubmit={onSubmit} className="card space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
            At least 8 characters.
          </p>
        </div>
        {err && <p style={{ color: "var(--color-clay-700)", fontSize: "0.9rem" }}>{err}</p>}
        <button type="submit" className="btn-primary w-full justify-center" disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="muted" style={{ marginTop: "1.5rem", textAlign: "center" }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
      <p className="muted" style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.8rem" }}>
        By signing up you agree to our <Link href="/terms">Terms</Link> and{" "}
        <Link href="/privacy">Privacy</Link>.
      </p>
    </div>
  );
}

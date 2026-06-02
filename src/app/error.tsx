"use client";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-6 pt-20 pb-32 text-center">
      <p className="muted" style={{ marginBottom: "0.5rem" }}>Something went sideways</p>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>That did not work.</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        It happens. Try again, or come back in a minute.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  );
}

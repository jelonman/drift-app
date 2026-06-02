import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-20 pb-32 text-center">
      <p className="muted" style={{ marginBottom: "0.5rem" }}>404</p>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Nothing here.</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        The page you were looking for is not here.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/a" className="btn-ghost">Three Dots</Link>
        <Link href="/b" className="btn-ghost">Tag In</Link>
        <Link href="/c" className="btn-ghost">Tonight</Link>
        <Link href="/d" className="btn-ghost">Still Here</Link>
      </div>
    </div>
  );
}

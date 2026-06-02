import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://drift-app-gamma.vercel.app"
  ),
  title: "Four — small tools for the friction in your life",
  description: "Four separate apps for things you keep meaning to do.",
  openGraph: {
    title: "Four",
    description: "The friction in your life, four small fixes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Four",
    description: "The friction in your life, four small fixes.",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <nav style={{ borderBottom: "1px solid var(--color-ink-100)", background: "var(--color-cream-50)" }}>
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="serif" style={{ fontSize: "1.35rem", fontWeight: 500, color: "var(--color-ink-900)" }}>
              Four
            </Link>
            <div className="flex items-center gap-1 text-sm" style={{ color: "var(--color-ink-500)" }}>
              <Link href="/a" className="btn-ghost">Three Dots</Link>
              <Link href="/b" className="btn-ghost">Tag In</Link>
              <Link href="/c" className="btn-ghost">Tonight</Link>
              <Link href="/d" className="btn-ghost">Still Here</Link>
              <span style={{ width: 1, height: 24, background: "var(--color-ink-100)", margin: "0 0.5rem" }} />
                {session ? (
                  <>
                    <Link href="/account" className="btn-ghost">{session.email.split("@")[0]}</Link>
                  </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost">Log in</Link>
                  <Link href="/signup" className="btn-primary" style={{ padding: "0.5rem 0.875rem", fontSize: "0.9rem" }}>Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <Analytics />
        <footer style={{ borderTop: "1px solid var(--color-ink-100)", marginTop: "6rem", padding: "2rem 0", color: "var(--color-ink-300)", fontSize: "0.85rem" }}>
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between flex-wrap gap-2">
            <span>Four — small tools for the friction in your life</span>
            <span className="flex items-center gap-4">
              <Link href="/help" className="hover:text-[var(--color-ink-700)]">Help</Link>
              <Link href="/pricing" className="hover:text-[var(--color-ink-700)]">Pricing</Link>
              <Link href="/privacy" className="hover:text-[var(--color-ink-700)]">Privacy</Link>
              <Link href="/terms" className="hover:text-[var(--color-ink-700)]">Terms</Link>
              <a href="mailto:hello@four.tools" className="hover:text-[var(--color-ink-700)]">Contact</a>
              <span>· Built quietly on Vercel</span>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

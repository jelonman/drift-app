import Link from "next/link";
import { getSession } from "@/lib/auth";

const APPS = [
  {
    slug: "a",
    name: "Three Dots",
    tagline: "Stop staring at the keyboard. Get three replies that fit how you actually want to sound.",
    body: "Paste the chat. Tell it how you're feeling. It reads the whole conversation, notices the loop you're stuck in, and gives you three reply options with the reason each one works.",
    cta: "Try Three Dots",
  },
  {
    slug: "b",
    name: "Tag In",
    tagline: "You shouldn't be the one who remembers everything.",
    body: "Snap a school flyer, a text from the teacher, a voice memo in the middle of the night. Tag In pulls out the tasks, splits them between you and your partner, and drafts the text back.",
    cta: "Try Tag In",
  },
  {
    slug: "c",
    name: "Tonight",
    tagline: "Stop deciding what to cook every single night.",
    body: "Snap what's in your fridge on Sunday. Get five nights of meals, one grouped grocery list, and a note about which leftover feeds Tuesday lunch. It remembers what you actually ate.",
    cta: "Try Tonight",
  },
  {
    slug: "d",
    name: "Still Here",
    tagline: "Stay close to the people who used to be close.",
    body: "Add the friends you keep meaning to text. Still Here keeps a quiet eye on who you haven't talked to in a while, drafts a personal opener, and reminds you a month later to see how it went.",
    cta: "Try Still Here",
  },
];

export const metadata = {
  title: "Four — small tools for the friction in your life",
  description: "Four separate apps for things you keep meaning to do.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const session = await getSession();
  return (
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-32">
      <div className="max-w-2xl">
        <p className="pill pill-forest mb-6">Four small tools, one quiet site</p>
        <h1 className="mb-6">
          The friction in your life, four small fixes.
        </h1>
        <p style={{ fontSize: "1.15rem", lineHeight: 1.55, color: "var(--color-ink-500)" }}>
          Four separate apps for the things you keep meaning to do. Each one is
          a single page, a single habit, and a single subscription. No
          dashboards, no streaks, no notifications begging for attention.
        </p>
        {!session && (
          <div className="mt-8">
            <Link href="/signup" className="btn-primary" style={{ fontSize: "1rem", padding: "0.7rem 1.4rem" }}>
              Sign up free
            </Link>
            <span className="muted" style={{ marginLeft: "0.75rem", fontSize: "0.9rem" }}>
              No card required.
            </span>
          </div>
        )}
      </div>

      <div className="mt-20 space-y-3">
        {APPS.map((app) => (
          <Link
            key={app.slug}
            href={`/${app.slug}`}
            className="card block hover:border-[var(--color-ink-300)] transition-colors"
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {app.name}
              </h2>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                → {app.cta}
              </span>
            </div>
            <p style={{ fontSize: "1.05rem", color: "var(--color-ink-500)", marginBottom: "0.75rem" }}>
              {app.tagline}
            </p>
            <p style={{ color: "var(--color-ink-300)", fontSize: "0.95rem" }}>
              {app.body}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-24 card-soft" style={{ maxWidth: "42rem" }}>
        <h3 style={{ marginBottom: "0.75rem" }}>How this works</h3>
        <p style={{ color: "var(--color-ink-500)", lineHeight: 1.6 }}>
          You sign up once. Then each app is a separate thing with its own
          free tier (3 to 14 uses), and its own $5-9/mo unlimited plan. Your
          data lives in your account. Cancel any of them any time. No streaks.
          No badges. No "AI-powered" badges.
        </p>
      </div>
    </div>
  );
}

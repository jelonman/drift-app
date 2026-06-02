import { readFileSync } from "fs";
import path from "path";

export const metadata = {
  title: "What's new — omicron",
  description: "Recent changes to omicron.",
};

type Change = { date: string; title: string; body: string };

const CHANGES: Change[] = [
  {
    date: "2026-06-02",
    title: "Domain is omicron.ink",
    body: "The site now lives at https://omicron.ink. The brand changed from the working name to a real name. The 4 apps are unchanged.",
  },
  {
    date: "2026-06-02",
    title: "Pricing page and changelog",
    body: "A consolidated /pricing view shows all four apps with what they cost and what the free tier includes. A new /changelog tracks the changes that shipped. No fanfare, just the diffs.",
  },
  {
    date: "2026-06-02",
    title: "Image uploads for Tag In and Tonight",
    body: "Tag In can now read a photo of a school flyer. Tonight can now read a photo of your fridge. Drop the photo in, Tag In still extracts the tasks; Tonight still plans the week. Photos live in your history so you can find them later.",
  },
  {
    date: "2026-06-02",
    title: "Resend-powered emails (test mode)",
    body: "Welcome email on signup, receipt on subscription, cancel notice, and the Sunday Still Here digest now actually send. Full delivery to anyone with a verified domain; right now it only goes to the account owner while a real domain is being set up.",
  },
  {
    date: "2026-06-02",
    title: "Vercel Blob storage for uploaded images",
    body: "Server-side upload to Vercel Blob. 5MB max per image, JPEG / PNG / WebP / HEIC. Per-user path prefix keeps uploads tidy.",
  },
  {
    date: "2026-06-02",
    title: "Per-app subscriptions in Stripe (test mode)",
    body: "Four separate products, four separate prices. Subscribe to just Three Dots. Or just Still Here. Cancel any of them without losing the others. Webhook handles the DB; account page shows period end; customer portal handles upgrades and full cancel.",
  },
  {
    date: "2026-06-01",
    title: "Initial release",
    body: "All four apps working: Three Dots (4 reply tones for hard texts), Tag In (split tasks from a messy drop), Tonight (5-night plan from your fridge), Still Here (drafts openers to friends you keep meaning to text). Free tier per app. JWT auth. Postgres on Neon.",
  },
];

export default function Changelog() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32 space-y-8">
      <header>
        <h1 className="serif" style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>
          What's new
        </h1>
        <p className="muted">
          No fanfare. Just the changes that shipped.
        </p>
      </header>

      <ol className="space-y-6" style={{ listStyle: "none", padding: 0 }}>
        {CHANGES.map((c) => (
          <li key={c.date + c.title} className="card">
            <p className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
              {c.date}
            </p>
            <h2 className="serif" style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>
              {c.title}
            </h2>
            <p style={{ lineHeight: 1.6, color: "var(--color-ink-700)" }}>{c.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

import { PRICING } from "@/lib/stripe";

export const metadata = {
  title: "Pricing — Four",
  description: "One free tier per app. Subscribe to any of the four for $5-9 a month. Cancel any time.",
};

const APP_NAMES: Record<string, { name: string; tagline: string }> = {
  a: { name: "Three Dots", tagline: "Four reply tones for any text you dread sending." },
  b: { name: "Tag In", tagline: "Drop in a school flyer, a messy email, a voice memo. Tasks split fairly." },
  c: { name: "Tonight", tagline: "Five weeknight meals from what's in your fridge, with a small grocery list." },
  d: { name: "Still Here", tagline: "Drafts personal openers to friends you keep meaning to text." },
};

export default function Pricing() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 space-y-10">
      <header className="text-center">
        <h1 className="serif" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Pricing
        </h1>
        <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 540, margin: "0 auto" }}>
          Each app is free until you hit the limit. Then $5-9 a month. No bundles.
          Pick the ones you actually use. Cancel any time.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {(["a", "b", "c", "d"] as const).map((app) => {
          const p = PRICING[app];
          const info = APP_NAMES[app];
          return (
            <div key={app} className="card" style={{ padding: "1.5rem" }}>
              <h2 className="serif" style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>
                {info.name}
              </h2>
              <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                {info.tagline}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 500 }}>${p.price / 100}</span>
                <span className="muted" style={{ fontSize: "0.9rem" }}>/ month</span>
              </div>
              <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
                {p.freeUnit}
              </p>
              <a
                href={`/signup?next=/${app}/new`}
                className="btn-primary"
                style={{ display: "inline-block", textDecoration: "none" }}
              >
                Start free
              </a>
            </div>
          );
        })}
      </div>

      <div className="card-soft">
        <h2 className="serif" style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          How billing works
        </h2>
        <ul className="muted" style={{ paddingLeft: "1.2rem", lineHeight: 1.7 }}>
          <li>You only pay for the apps you use. There is no bundle.</li>
          <li>Each app is a separate subscription in Stripe. Manage or cancel any of them from your account page.</li>
          <li>Receipts go to your email. The Stripe customer portal has full invoice history.</li>
          <li>Your data stays put when you cancel. You just stop getting new generations past the free tier.</li>
        </ul>
      </div>

      <p className="text-center muted" style={{ fontSize: "0.85rem" }}>
        Stripe is in test mode. Use card 4242 4242 4242 4242 with any future date, any CVC, any ZIP.
      </p>
    </div>
  );
}

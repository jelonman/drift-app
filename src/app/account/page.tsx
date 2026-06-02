import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, AppKey, isStripeConfigured, getSubscriptionFor } from "@/lib/stripe";
import { getAppUsage } from "@/lib/limits";
import { BillingActions } from "./billing-actions";

export const dynamic = "force-dynamic";

const APP_META: Record<AppKey, { name: string; tagline: string; href: string }> = {
  a: { name: "Three Dots", tagline: "Reply options for the texts you dread sending.", href: "/a" },
  b: { name: "Tag In", tagline: "Drop a messy note. Get the tasks split fairly.", href: "/b" },
  c: { name: "Tonight", tagline: "Five nights of meals from what's in your fridge.", href: "/c" },
  d: { name: "Still Here", tagline: "Stay close to the people you keep meaning to text.", href: "/d" },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string; canceled?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const sp = await searchParams;
  const justSubscribed = sp?.subscribed as AppKey | undefined;
  const justCanceled = sp?.canceled as AppKey | undefined;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  const usages = await Promise.all(
    (Object.keys(PRICING) as AppKey[]).map((k) => getAppUsage(user.id, k))
  );

  const subs = await Promise.all(
    (Object.keys(PRICING) as AppKey[]).map((k) => getSubscriptionFor(user.id, k))
  );

  const stripeReady = isStripeConfigured();

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32 space-y-10">
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Your account</h1>
        <p className="muted">{user.email}</p>
      </div>

      {justSubscribed && (
        <div className="card-soft" style={{ background: "var(--color-forest-50)" }}>
          <p style={{ fontWeight: 500 }}>
            You&apos;re subscribed to {APP_META[justSubscribed].name}.
          </p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Welcome to the paid tier. We&apos;ve sent a receipt to {user.email}.
          </p>
        </div>
      )}
      {justCanceled && (
        <div className="card-soft">
          <p style={{ fontWeight: 500 }}>
            Checkout canceled for {APP_META[justCanceled].name}.
          </p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            No charge was made. You can come back any time.
          </p>
        </div>
      )}

      <div>
        <h2 className="serif" style={{ marginBottom: "0.5rem" }}>Your apps</h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Click into any of them to use them. Each one tracks its own usage and pricing.
        </p>
        <div className="space-y-2">
          {(Object.keys(PRICING) as AppKey[]).map((k, i) => {
            const usage = usages[i];
            const meta = APP_META[k];
            return (
              <div key={k} className="card flex items-center justify-between" style={{ padding: "1rem 1.25rem" }}>
                <div>
                  <Link href={meta.href} style={{ fontWeight: 500, textDecoration: "none", color: "inherit" }}>
                    {meta.name}
                  </Link>
                  <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.15rem" }}>
                    {meta.tagline}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  {usage.active ? (
                    <span className="pill pill-forest">Active</span>
                  ) : (
                    <span className="pill">
                      {usage.remaining}/{usage.limit} {usage.unit} left
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="pricing">
        <h2 className="serif" style={{ marginBottom: "0.5rem" }}>Pricing</h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Each app is free for a small number of uses, then a flat monthly
          subscription. Cancel any of them any time. Subscribe to as many as you want.
        </p>
        <div className="space-y-2">
          {(Object.keys(PRICING) as AppKey[]).map((k, i) => {
            const p = PRICING[k];
            const sub = subs[i];
            const usage = usages[i];
            return (
              <div key={k} className="card" style={{ padding: "1.25rem" }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                      {p.description}
                    </p>
                    <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                      {sub
                        ? `Renews on ${sub.currentPeriodEnd.toLocaleDateString()}`
                        : `${p.free} ${p.freeUnit} free, then $${(p.price / 100).toFixed(0)}/mo`}
                    </p>
                  </div>
                  <div style={{ minWidth: "120px", textAlign: "right" }}>
                    <BillingActions
                      app={k}
                      hasSubscription={Boolean(sub)}
                      stripeReady={stripeReady}
                      used={usage.used}
                      limit={usage.limit}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!stripeReady && (
          <p className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
            Stripe is not configured in this environment. Subscriptions are
            disabled until <code>STRIPE_SECRET_KEY</code> and the four
            <code> STRIPE_PRICE_*</code> env vars are set on Vercel.
          </p>
        )}
        {stripeReady && (
          <p className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
            Stripe is in test mode. Use card 4242 4242 4242 4242, any future
            date, any CVC, any ZIP.
          </p>
        )}
      </div>

      <div>
        <h2 className="serif" style={{ marginBottom: "0.5rem" }}>Sign out</h2>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn-ghost">Log out</button>
        </form>
      </div>
    </div>
  );
}

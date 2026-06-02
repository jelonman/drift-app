import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING } from "@/lib/stripe";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32 space-y-10">
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Your account</h1>
        <p className="muted">{user.email}</p>
      </div>

      <div>
        <h2 className="serif" style={{ marginBottom: "0.5rem" }}>Your apps</h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>Click into any of them to use them.</p>
        <div className="grid grid-cols-2 gap-3">
          {(["a", "b", "c", "d"] as const).map((k) => {
            const labels: Record<string, [string, string]> = {
              a: ["Three Dots", "Texting replies"],
              b: ["Tag In", "Parent load balancing"],
              c: ["Tonight", "Weekly meal plan"],
              d: ["Still Here", "Friend nudges"],
            };
            const [name, desc] = labels[k];
            return (
              <Link
                key={k}
                href={`/${k}`}
                className="card block"
                style={{ textDecoration: "none", padding: "1.25rem" }}
              >
                <p style={{ fontWeight: 500 }}>{name}</p>
                <p className="muted" style={{ fontSize: "0.85rem" }}>{desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div id="pricing">
        <h2 className="serif" style={{ marginBottom: "0.5rem" }}>Pricing</h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Each app is free for a small number of uses, then a flat monthly
          subscription. Cancel any of them any time.
        </p>
        <div className="space-y-2">
          {(Object.keys(PRICING) as (keyof typeof PRICING)[]).map((k) => {
            const p = PRICING[k];
            return (
              <div key={k} className="card flex items-center justify-between" style={{ padding: "1rem 1.25rem" }}>
                <div>
                  <p style={{ fontWeight: 500 }}>{p.name}</p>
                  <p className="muted" style={{ fontSize: "0.85rem" }}>
                    Free for {p.free} uses, then ${p.price / 100}/mo
                  </p>
                </div>
                <span className="pill">Included in free tier</span>
              </div>
            );
          })}
        </div>
        <p className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          Stripe checkout is in test mode. Use card 4242 4242 4242 4242, any
          future date, any CVC, any ZIP.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, getFreeLimit } from "@/lib/stripe";

export default async function CLanding() {
  const session = await getSession();
  const free = getFreeLimit("c");
  const recent = session
    ? await prisma.mealPlan.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32">
      <p className="pill mb-6">App 3 of 4</p>
      <h1 style={{ fontSize: "3rem", lineHeight: 1.05, marginBottom: "1rem" }}>
        Tonight
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-ink-500)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
        Stop deciding what to cook every single night.
      </p>
      <p style={{ color: "var(--color-ink-500)", lineHeight: 1.6, marginBottom: "2rem" }}>
        Tell it what's in your fridge on Sunday. Get five nights of meals,
        one grouped grocery list, and a note about which leftover feeds
        Tuesday lunch. It remembers what you actually cooked and stops
        suggesting the same four chicken dishes.
      </p>

      {session ? (
        <div className="space-y-4">
          <Link href="/c/new" className="btn-primary" style={{ textDecoration: "none" }}>
            Plan this week
          </Link>
          {recent.length > 0 && (
            <div className="mt-10">
              <h3 className="serif" style={{ marginBottom: "1rem" }}>Recent plans</h3>
              <div className="space-y-2">
                {recent.map((p) => (
                  <Link
                    key={p.id}
                    href={`/c/plan/${p.id}`}
                    className="card block"
                    style={{ textDecoration: "none", padding: "1rem 1.25rem" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span style={{ fontWeight: 500 }}>
                        Week of {new Date(p.weekStart).toLocaleDateString()}
                      </span>
                      <span className="muted" style={{ fontSize: "0.85rem" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card-soft">
          <p style={{ marginBottom: "0.75rem" }}>
            <Link href="/signup" style={{ fontWeight: 500 }}>Create an account</Link> to
            save your plans and unlock {free} free uses.
          </p>
          <p className="muted">
            Or <Link href="/login">log in</Link> if you have one.
          </p>
        </div>
      )}

      <div className="mt-16">
        <h3 className="serif" style={{ marginBottom: "1rem" }}>What you get</h3>
        <ul style={{ color: "var(--color-ink-500)", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
          <li>Five nights of meals that use what you already have</li>
          <li>One grocery list, grouped by aisle</li>
          <li>Leftover rotation: Tuesday lunch comes from Monday's dinner</li>
          <li>Substitution suggestions if you are missing one thing</li>
          <li>It remembers what you cooked, so it stops repeating itself</li>
        </ul>
      </div>

      <p className="muted" style={{ marginTop: "2rem" }}>
        Free for {free} weekly plans. Then ${PRICING.c.price / 100}/mo for unlimited.
      </p>
    </div>
  );
}

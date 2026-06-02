import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PlanActions from "./actions";

type Day = {
  day: string;
  name: string;
  uses_from_pantry: string[];
  you_need: string[];
  instructions: string;
  leftover_note: string | null;
};
type PlanData = { days: Day[]; grocery_by_aisle: Record<string, string[]> };

export default async function CPlanView({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const plan = await prisma.mealPlan.findUnique({ where: { id } });
  if (!plan || plan.userId !== session.userId) notFound();
  const data: PlanData = JSON.parse(plan.planJson);
  const grocery: Record<string, string[]> = JSON.parse(plan.groceryList || "{}");
  const cookedThisWeek = await prisma.meal.count({
    where: {
      userId: session.userId,
      date: { gte: plan.weekStart, lt: new Date(plan.weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) },
      cooked: true,
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32 space-y-8">
      <div className="flex items-baseline justify-between">
        <div>
          <Link href="/c" className="btn-ghost">← Tonight</Link>
          <h1 className="serif" style={{ fontSize: "1.75rem", marginTop: "0.5rem" }}>
            Week of {new Date(plan.weekStart).toLocaleDateString()}
          </h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            {cookedThisWeek} of {data.days.length} cooked
          </p>
        </div>
        <Link href="/c/new" className="btn-secondary" style={{ textDecoration: "none" }}>
          New plan
        </Link>
      </div>

      <section>
        <h2 className="serif" style={{ marginBottom: "0.75rem" }}>The week</h2>
        <div className="space-y-3">
          {data.days.map((d, i) => (
            <div key={i} className="card">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="serif" style={{ fontSize: "1.2rem" }}>{d.day} · {d.name}</h3>
                <PlanActions
                  planId={plan.id}
                  index={i}
                  dayName={d.name}
                  weekStart={plan.weekStart.toISOString()}
                />
              </div>
              <p style={{ lineHeight: 1.6, marginBottom: "0.75rem" }}>{d.instructions}</p>
              {d.uses_from_pantry.length > 0 && (
                <p className="muted" style={{ fontSize: "0.85rem" }}>
                  <strong>From your pantry:</strong> {d.uses_from_pantry.join(", ")}
                </p>
              )}
              {d.you_need.length > 0 && (
                <p className="muted" style={{ fontSize: "0.85rem" }}>
                  <strong>You need:</strong> {d.you_need.join(", ")}
                </p>
              )}
              {d.leftover_note && (
                <p style={{ fontSize: "0.85rem", color: "var(--color-forest-700)", marginTop: "0.5rem" }}>
                  {d.leftover_note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="serif" style={{ marginBottom: "0.75rem" }}>Grocery list</h2>
        <div className="card">
          {Object.entries(grocery).length === 0 ? (
            <p className="muted">You might already have everything.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(grocery).map(([aisle, items]) => (
                <div key={aisle}>
                  <p className="label">{aisle}</p>
                  <ul style={{ paddingLeft: "1rem", color: "var(--color-ink-700)" }}>
                    {items.map((item, i) => (
                      <li key={i} style={{ lineHeight: 1.7 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

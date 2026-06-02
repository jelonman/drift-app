import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NewPlanForm from "./form";

export default async function CNew() {
  const session = await getSession();
  if (!session) redirect("/signup?next=/c/new");

  const thisMonth = await prisma.mealPlan.count({
    where: {
      userId: session.userId,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  const FREE = 3;
  const remaining = Math.max(0, FREE - thisMonth);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32">
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Plan this week</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        List what's in your fridge and pantry. Be specific (half a bag of
        spinach, two chicken thighs). Tell it about anyone with restrictions.
      </p>
      <NewPlanForm remaining={remaining} free={FREE} />
    </div>
  );
}

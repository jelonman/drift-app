import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { aiJson, NO_SLOP_RULES } from "@/lib/ai";
import { canUseApp } from "@/lib/limits";
import { PRICING } from "@/lib/stripe";

const Body = z.object({
  pantry: z.string().max(4000).default(""),
  restrictions: z.string().max(1000).default(""),
  servings: z.number().int().min(1).max(8).default(2),
  cuisines: z.array(z.string()).max(20).default([]),
  imageUrl: z.string().url().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const allowed = await canUseApp(session.userId, "c");
  if (!allowed) {
    return NextResponse.json(
      {
        error: `You've used your ${PRICING.c.free} free meal plans this month. Subscribe to keep planning.`,
        needsSubscription: true,
      },
      { status: 402 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please list a few things you have." }, { status: 400 });
  }
  const { pantry, restrictions, servings, cuisines, imageUrl } = parsed.data;
  if (pantry.trim().length < 5 && !imageUrl) {
    return NextResponse.json(
      { error: "List a few things you have, or upload a fridge photo." },
      { status: 400 }
    );
  }

  const recent = await prisma.meal.findMany({
    where: { userId: session.userId, cooked: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { name: true },
  });
  const recentNames = recent.map((m) => m.name).filter(Boolean);

  // Week starts today
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);

  const system = `You are a practical weeknight meal planner. The user gives you what's in their fridge and pantry. You give them a 5-night meal plan that uses what they have, plus one grocery list for what they need to buy.

Constraints:
- Use what's in the pantry first. The grocery list should be small.
- Each meal should take 30-45 minutes on a weeknight.
- If a dinner makes good leftovers for the next day's lunch, note that.
- Vary the protein across the week. No "chicken four ways."
- Respect any restrictions.
- The user is cooking for ${servings} people.
${cuisines.length > 0 ? `- Bias toward these cuisines: ${cuisines.join(", ")}.` : ""}

Things the user has recently cooked (so you don't repeat):
${recentNames.length > 0 ? recentNames.join(", ") : "(none yet)"}

Pantry:
"""
${pantry}
"""

${restrictions ? `Restrictions:\n${restrictions}\n` : ""}

${NO_SLOP_RULES}

Output JSON with this exact shape:
{
  "days": [
    {
      "day": "Monday",
      "name": "Short meal name",
      "uses_from_pantry": ["chicken thighs", "broccoli"],
      "you_need": ["sesame oil", "scallions"],
      "instructions": "Three to five short steps, plain English. No 'sauté until fragrant' jargon.",
      "leftover_note": "Lunch tomorrow" or null
    }
  ],
  "grocery_by_aisle": {
    "Produce": ["scallions", "ginger"],
    "Meat": ["ground pork"],
    "Pantry": ["soy sauce"]
  }
}`;

  const result = await aiJson<{
    days: {
      day: string;
      name: string;
      uses_from_pantry: string[];
      you_need: string[];
      instructions: string;
      leftover_note: string | null;
    }[];
    grocery_by_aisle: Record<string, string[]>;
  }>({
    system,
    messages: [{ role: "user", content: "Plan the week." }],
    temperature: 0.7,
    maxTokens: 3072,
  });

  const plan = await prisma.mealPlan.create({
    data: {
      userId: session.userId,
      weekStart,
      planJson: JSON.stringify(result),
      groceryList: JSON.stringify(result.grocery_by_aisle),
      imageUrl: imageUrl ?? null,
    },
  });

  return NextResponse.json({ id: plan.id });
  } catch (err) {
    console.error("[c/plans] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

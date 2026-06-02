import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  planId: z.string(),
  name: z.string(),
  date: z.string(),
  cooked: z.boolean(),
  rating: z.number().int().min(1).max(5).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  const plan = await prisma.mealPlan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan || plan.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const meal = await prisma.meal.create({
    data: {
      userId: session.userId,
      date: new Date(parsed.data.date),
      name: parsed.data.name,
      cooked: parsed.data.cooked,
      rating: parsed.data.rating,
    },
  });
  return NextResponse.json({ id: meal.id });
}

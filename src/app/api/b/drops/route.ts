import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { aiJson, NO_SLOP_RULES } from "@/lib/ai";
import { canUseApp } from "@/lib/limits";
import { PRICING } from "@/lib/stripe";

const Body = z.object({
  familyId: z.string(),
  text: z.string().min(10).max(8000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const allowed = await canUseApp(session.userId, "b");
  if (!allowed) {
    return NextResponse.json(
      {
        error: `Your free ${PRICING.b.free}-day trial is over. Subscribe to keep using Tag In.`,
        needsSubscription: true,
      },
      { status: 402 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please type a sentence or two." }, { status: 400 });
  }
  const { familyId, text } = parsed.data;

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      tasks: { where: { status: { not: "done" } }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!family || family.ownerId !== session.userId) {
    return NextResponse.json({ error: "Family not found" }, { status: 404 });
  }

  const recentAssignees = family.tasks
    .map((t) => (t.assigneeId === family.ownerId ? "self" : "partner"))
    .reduce<Record<string, number>>((acc, k) => { acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});

  const system = `You are a calm, practical family-load coordinator. You read a note from one parent and turn it into a clear list of tasks, split between the two parents, plus a draft reply if one is needed.

The user's family has two parents:
- "self" = the person who just sent this note
- "partner" = the other parent

Recent task load (so the split is fair, not first-claim):
${JSON.stringify(recentAssignees)}

The note:
"""
${text}
"""

Your job:
1. Extract the action items. Each is a concrete thing one parent has to do.
2. Assign each to "self" or "partner" based on what is fair given recent load and what makes sense.
3. If the note is a reply to someone, draft a short, kind reply in the parent's voice. No corporate speak.
4. If a deadline is mentioned ("by Wed", "tomorrow"), set the due date relative to today in ISO format.
5. If the note is too vague to act on, set needs_clarification to a one-line question.

${NO_SLOP_RULES}

Output JSON with this exact shape:
{
  "tasks": [
    { "title": "Short verb-led title, 3-8 words", "description": "One short sentence (or empty)", "assignee": "self" or "partner", "due": "YYYY-MM-DD" or null }
  ],
  "draft_reply": "..."  or null,
  "needs_clarification": "..."  or null
}`;

  const result = await aiJson<{
    tasks: { title: string; description: string; assignee: "self" | "partner"; due: string | null }[];
    draft_reply: string | null;
    needs_clarification: string | null;
  }>({
    system,
    messages: [{ role: "user", content: "Sort the note." }],
    temperature: 0.5,
    maxTokens: 900,
  });

  const created: string[] = [];
  for (const t of result.tasks) {
    const created_task = await prisma.task.create({
      data: {
        familyId: family.id,
        assigneeId: t.assignee === "self" ? family.ownerId : null,
        title: t.title,
        description: t.description || null,
        dueDate: t.due ? new Date(t.due) : null,
        source: "ai",
      },
    });
    created.push(created_task.id);
  }

  // Store the drop's metadata in a special "drop" task so we can show the result page
  const meta = JSON.stringify({
    raw: text,
    draft_reply: result.draft_reply,
    needs_clarification: result.needs_clarification,
    task_ids: created,
  });
  const drop = await prisma.task.create({
    data: {
      familyId: family.id,
      assigneeId: null,
      title: `__drop__${meta}`,
      source: "ai",
    },
  });

  return NextResponse.json({ id: drop.id });
}

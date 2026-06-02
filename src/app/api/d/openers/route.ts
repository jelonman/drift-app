import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { aiJson, NO_SLOP_RULES } from "@/lib/ai";

const Body = z.object({ friendId: z.string() });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  const friend = await prisma.friend.findUnique({
    where: { id: parsed.data.friendId },
    include: { touchpoints: { orderBy: { date: "desc" }, take: 10 } },
  });
  if (!friend || friend.userId !== session.userId) {
    return NextResponse.json({ error: "Friend not found" }, { status: 404 });
  }

  const lastContact = friend.lastContactAt
    ? `${Math.floor((Date.now() - new Date(friend.lastContactAt).getTime()) / (7 * 24 * 60 * 60 * 1000))} weeks ago`
    : "never";

  const recent = friend.touchpoints.map((t) => ({
    when: new Date(t.date).toLocaleDateString(),
    what: t.note || "touched base",
  }));

  const system = `You are a gentle, perceptive friend. You help someone reach out to a friend they have lost touch with. You draft a personal opener that does not feel awkward, desperate, or performative.

Friend's name: ${friend.name}
How you know them: ${friend.relationship}
Your note about them: ${friend.notes || "(none)"}
Last contact: ${lastContact}
Recent touchpoints:
${recent.length > 0 ? JSON.stringify(recent) : "(none logged)"}

Your job: write 3 different openers.
- "warm" — a soft, low-pressure check-in. 1-2 sentences.
- "callback" — a specific reference to something from a recent touchpoint or the note. 1-2 sentences.
- "forward" — a forward-looking opener (sharing something, asking about something upcoming). 1-2 sentences.

For each opener, write a 1-sentence "why" explaining why this works for this person.

${NO_SLOP_RULES}

Output JSON:
{
  "replies": [
    { "tone": "warm",     "text": "...", "why": "..." },
    { "tone": "callback", "text": "...", "why": "..." },
    { "tone": "forward",  "text": "...", "why": "..." }
  ]
}`;

  const result = await aiJson<{ replies: { tone: string; text: string; why: string }[] }>({
    system,
    messages: [{ role: "user", content: "Draft openers." }],
    temperature: 0.85,
    maxTokens: 3072,
  });

  // Persist all three (none sent yet) so the history shows up
  for (const r of result.replies) {
    await prisma.opener.create({
      data: { friendId: friend.id, tone: r.tone, text: r.text, sent: false },
    });
  }

  return NextResponse.json({ replies: result.replies });
}

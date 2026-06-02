import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { aiJson, NO_SLOP_RULES } from "@/lib/ai";

const Body = z.object({
  stage: z.string(),
  mood: z.string(),
  pastedText: z.string().min(20).max(8000),
});

const STAGE_LABELS: Record<string, string> = {
  new_match: "just matched on a dating app",
  chatting: "been chatting for a while",
  pre_date: "about to meet for a date",
  post_date: "just had a first date or early date",
  seeing_each_other: "seeing each other, not labeled",
  situationship: "in a situationship",
  exclusivity: "talking about becoming exclusive",
  long_term: "in a long-term relationship",
};

const MOOD_LABELS: Record<string, string> = {
  anxious: "anxious and overthinking",
  playful: "playful and relaxed",
  tired: "exhausted",
  frustrated: "frustrated",
  hopeful: "hopeful",
  guarded: "guarded",
  neutral: "neutral",
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please paste a real conversation (20+ characters)." }, { status: 400 });
  }
  const { stage, mood, pastedText } = parsed.data;

  const convo = await prisma.conversation.create({
    data: { userId: session.userId, stage, mood, pastedText },
  });

  const system = `You are a calm, perceptive texting coach. You help someone draft a reply to a chat they are stuck on.

Stage: ${STAGE_LABELS[stage] ?? stage}
Their mood: ${MOOD_LABELS[mood] ?? mood}

Your job:
1. Read the whole conversation. Notice the loop the user is in (overthinking, matching energy, avoiding, performing).
2. Generate exactly 4 reply options, each in a different tone:
   - "warm" — soft, low-pressure, generous
   - "playful" — light, fun, with a small hook
   - "direct" — clear, no games, says what it means
   - "leave_space" — short, calm, opens a door without pushing through it
3. For each reply, write a 1-sentence "why" that explains what it does for the user, not for the other person.
4. End with a single "coaching" sentence: what the hesitation is probably about. Not advice. Just naming the pattern.

${NO_SLOP_RULES}

Output JSON with this exact shape:
{
  "replies": [
    { "tone": "warm",      "text": "...", "why": "..." },
    { "tone": "playful",   "text": "...", "why": "..." },
    { "tone": "direct",    "text": "...", "why": "..." },
    { "tone": "leave_space","text": "...", "why": "..." }
  ],
  "coaching": "..."
}`;

  const result = await aiJson<{
    replies: { tone: string; text: string; why: string }[];
    coaching: string;
  }>({
    system,
    messages: [
      { role: "user", content: `Here is the conversation:\n\n${pastedText}` },
    ],
    temperature: 0.8,
    maxTokens: 900,
  });

  for (const r of result.replies) {
    await prisma.reply.create({
      data: {
        conversationId: convo.id,
        tone: r.tone,
        text: r.text,
        rationale: r.why,
      },
    });
  }
  // Save coaching as a meta reply on the first reply slot (tone: "_coaching")
  await prisma.reply.create({
    data: {
      conversationId: convo.id,
      tone: "_coaching",
      text: result.coaching,
      rationale: "",
    },
  });

  return NextResponse.json({ id: convo.id });
}

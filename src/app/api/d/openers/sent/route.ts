import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({ friendId: z.string(), tone: z.string(), text: z.string() });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  const friend = await prisma.friend.findUnique({ where: { id: parsed.data.friendId } });
  if (!friend || friend.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Mark the most recent opener of this tone as sent
  await prisma.opener.updateMany({
    where: { friendId: friend.id, tone: parsed.data.tone, sent: false },
    data: { sent: true },
  });
  return NextResponse.json({ ok: true });
}

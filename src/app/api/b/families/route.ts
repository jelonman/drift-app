import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  partnerEmail: z.string().email().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  const family = await prisma.family.create({
    data: {
      ownerId: session.userId,
      partnerEmail: parsed.data.partnerEmail || null,
      pairedAt: parsed.data.partnerEmail ? new Date() : null,
    },
  });
  return NextResponse.json({ id: family.id });
}

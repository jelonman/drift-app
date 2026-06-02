import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  name: z.string().min(1).max(100),
  relationship: z.string().max(100).default("Friend"),
  contactInfo: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const friend = await prisma.friend.create({
    data: {
      userId: session.userId,
      name: parsed.data.name,
      relationship: parsed.data.relationship,
      contactInfo: parsed.data.contactInfo || null,
      notes: parsed.data.notes || null,
    },
  });
  return NextResponse.json({ id: friend.id });
}

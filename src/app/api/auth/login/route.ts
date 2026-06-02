import { NextResponse } from "next/server";
import { z } from "zod";
import { logIn, destroySession } from "@/lib/auth";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  try {
    const user = await logIn(parsed.data.email, parsed.data.password);
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Log in failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}

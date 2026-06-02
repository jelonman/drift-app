import { NextResponse } from "next/server";
import { z } from "zod";
import { signUp } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

const Body = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and a password of 8+ characters required" }, { status: 400 });
  }
  try {
    const user = await signUp(parsed.data.email, parsed.data.password);
    sendWelcomeEmail(user.email).catch((e) => console.error("[signup] welcome email failed:", e));
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Sign up failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

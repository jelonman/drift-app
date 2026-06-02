import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendStillHereSundayDigest, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isEmailConfigured()) {
    return NextResponse.json({ ok: false, error: "Email not configured" });
  }

  const allFriends = await prisma.friend.findMany({
    include: { user: true },
  });

  const byUser = new Map<string, { email: string; name: string; days: number }[]>();
  for (const f of allFriends) {
    if (!f.user.email) continue;
    const lastContacted = f.lastContactAt || f.createdAt;
    const daysSince = Math.floor(
      (Date.now() - new Date(lastContacted).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < 30) continue;
    if (!byUser.has(f.user.id)) byUser.set(f.user.id, []);
    byUser.get(f.user.id)!.push({
      email: f.user.email,
      name: f.name,
      days: daysSince,
    });
  }

  let sent = 0;
  for (const [userId, friends] of byUser) {
    if (friends.length === 0) continue;
    const email = friends[0].email;
    const list = friends
      .sort((a, b) => b.days - a.days)
      .slice(0, 5)
      .map((f) => ({ name: f.name, daysSinceContact: f.days }));
    const res = await sendStillHereSundayDigest(email, list);
    if (res.ok) sent++;
  }

  return NextResponse.json({ ok: true, sent, users: byUser.size });
}

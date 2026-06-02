import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import FriendActions from "./actions";

export default async function DFriendDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const friend = await prisma.friend.findUnique({
    where: { id },
    include: {
      touchpoints: { orderBy: { date: "desc" }, take: 10 },
      openers: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!friend || friend.userId !== session.userId) notFound();

  const thisMonth = await prisma.opener.count({
    where: {
      friend: { userId: session.userId },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  const FREE = 3;
  const remaining = Math.max(0, FREE - thisMonth);

  async function markTouch(formData: FormData) {
    "use server";
    const ses = await getSession();
    if (!ses) return;
    const note = ((formData.get("note") as string) || "").trim() || null;
    await prisma.touchpoint.create({
      data: { friendId: id, date: new Date(), note },
    });
    await prisma.friend.update({
      where: { id },
      data: { lastContactAt: new Date() },
    });
    revalidatePath(`/d/friends/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-32 space-y-6">
      <div>
        <Link href="/d/friends" className="btn-ghost" style={{ fontSize: "0.85rem" }}>← Friends</Link>
        <h1 className="serif" style={{ fontSize: "2.25rem", marginTop: "0.5rem", marginBottom: "0.25rem" }}>{friend.name}</h1>
        <p className="muted">
          {friend.relationship} {friend.lastContactAt && (
            <>· last contact {new Date(friend.lastContactAt).toLocaleDateString()}</>
          )}
        </p>
      </div>

      {friend.notes && (
        <div className="card-soft">
          <p className="label">Your note</p>
          <p style={{ whiteSpace: "pre-wrap", color: "var(--color-ink-500)" }}>{friend.notes}</p>
        </div>
      )}

      <section>
        <h3 className="serif" style={{ marginBottom: "0.75rem" }}>Draft an opener</h3>
        {remaining === 0 ? (
          <div className="card-soft">
            <p className="muted" style={{ marginBottom: "0.5rem" }}>You have used all {FREE} free opener drafts this month.</p>
            <a href="/account#pricing" className="btn-primary" style={{ textDecoration: "none" }}>See pricing</a>
          </div>
        ) : (
          <FriendActions
            friendId={friend.id}
            friendName={friend.name}
            relationship={friend.relationship}
            notes={friend.notes}
            touchpoints={friend.touchpoints.map((t) => ({ date: t.date.toISOString(), note: t.note }))}
          />
        )}
      </section>

      <section>
        <h3 className="serif" style={{ marginBottom: "0.75rem" }}>Mark a touchpoint</h3>
        <form action={markTouch} className="card space-y-3">
          <div>
            <label className="label">What happened? (optional)</label>
            <input name="note" placeholder="Quick text, hour-long call, grabbed coffee, etc." />
          </div>
          <button type="submit" className="btn-primary">I reached out</button>
        </form>
      </section>

      {friend.touchpoints.length > 0 && (
        <section>
          <h3 className="serif" style={{ marginBottom: "0.75rem" }}>History</h3>
          <div className="space-y-2">
            {friend.touchpoints.map((t) => (
              <div key={t.id} className="card" style={{ padding: "0.75rem 1.25rem" }}>
                <div className="flex items-baseline justify-between">
                  <span style={{ fontSize: "0.95rem" }}>{t.note || "Touched base"}</span>
                  <span className="muted" style={{ fontSize: "0.8rem" }}>{new Date(t.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {friend.openers.length > 0 && (
        <section>
          <h3 className="serif" style={{ marginBottom: "0.75rem" }}>Past openers</h3>
          <div className="space-y-2">
            {friend.openers.map((o) => (
              <div key={o.id} className="card" style={{ padding: "0.75rem 1.25rem", opacity: 0.7 }}>
                <p style={{ fontSize: "0.9rem" }}>{o.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="pill" style={{ fontSize: "0.7rem" }}>{o.tone}</span>
                  {o.sent && <span className="pill pill-forest" style={{ fontSize: "0.7rem" }}>sent</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <DeleteFriendButton id={friend.id} />
    </div>
  );
}

function DeleteFriendButton({ id }: { id: string }) {
  async function del() {
    "use server";
    const ses = await getSession();
    if (!ses) return;
    await prisma.friend.deleteMany({ where: { id, userId: ses.userId } });
    redirect("/d/friends");
  }
  return (
    <form action={del} className="pt-8">
      <button type="submit" className="btn-ghost" style={{ color: "var(--color-clay-700)", fontSize: "0.85rem" }}>
        Remove this friend
      </button>
    </form>
  );
}

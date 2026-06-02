import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const EIGHT_WEEKS = 8 * 7 * 24 * 60 * 60 * 1000;

export default async function DFriends() {
  const session = await getSession();
  if (!session) redirect("/signup?next=/d/friends");

  const friends = await prisma.friend.findMany({
    where: { userId: session.userId },
    orderBy: { lastContactAt: { sort: "asc", nulls: "first" } },
    include: { _count: { select: { touchpoints: true } } },
  });
  const now = Date.now();
  const drift = friends.filter(
    (f) => !f.lastContactAt || now - new Date(f.lastContactAt).getTime() > EIGHT_WEEKS
  );
  const fresh = friends.filter(
    (f) => f.lastContactAt && now - new Date(f.lastContactAt).getTime() <= EIGHT_WEEKS
  );

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32 space-y-8">
      <div className="flex items-baseline justify-between">
        <div>
          <Link href="/d" className="btn-ghost">← Still Here</Link>
          <h1 className="serif" style={{ fontSize: "1.75rem", marginTop: "0.5rem" }}>Your friends</h1>
        </div>
        <Link href="/d/friends/new" className="btn-primary" style={{ textDecoration: "none" }}>Add a friend</Link>
      </div>

      {friends.length === 0 ? (
        <div className="card-soft">
          <p className="muted" style={{ marginBottom: "0.75rem" }}>You have not added anyone yet.</p>
          <Link href="/d/friends/new" className="btn-primary" style={{ textDecoration: "none" }}>Add your first friend</Link>
        </div>
      ) : (
        <>
          {drift.length > 0 && (
            <section>
              <h3 className="serif" style={{ marginBottom: "0.75rem" }}>Drifting ({drift.length})</h3>
              <div className="space-y-2">
                {drift.map((f) => <FriendRow key={f.id} f={f} />)}
              </div>
            </section>
          )}
          {fresh.length > 0 && (
            <section>
              <h3 className="serif" style={{ marginBottom: "0.75rem", color: "var(--color-ink-500)" }}>Recently in touch ({fresh.length})</h3>
              <div className="space-y-2">
                {fresh.map((f) => <FriendRow key={f.id} f={f} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function FriendRow({ f }: { f: { id: string; name: string; relationship: string; notes: string | null; lastContactAt: Date | null; _count: { touchpoints: number } } }) {
  const last = f.lastContactAt ? new Date(f.lastContactAt) : null;
  const daysAgo = last ? Math.floor((Date.now() - last.getTime()) / (24 * 60 * 60 * 1000)) : null;
  return (
    <Link
      href={`/d/friends/${f.id}`}
      className="card block"
      style={{ textDecoration: "none", padding: "1rem 1.25rem" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span style={{ fontWeight: 500 }}>{f.name}</span>
          <span className="muted" style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
            {f.relationship}
          </span>
        </div>
        <span className="muted" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          {last ? `${daysAgo}d ago` : "no contact logged"}
        </span>
      </div>
      {f.notes && <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>{f.notes}</p>}
    </Link>
  );
}

import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, getFreeLimit } from "@/lib/stripe";

export default async function DLanding() {
  const session = await getSession();
  const free = getFreeLimit("d");
  const friends = session
    ? await prisma.friend.findMany({
        where: { userId: session.userId },
        orderBy: { lastContactAt: { sort: "asc", nulls: "first" } },
      })
    : [];

  const now = Date.now();
  const EIGHT_WEEKS = 8 * 7 * 24 * 60 * 60 * 1000;
  const driftFriends = friends.filter(
    (f) => !f.lastContactAt || now - new Date(f.lastContactAt).getTime() > EIGHT_WEEKS
  );

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32">
      <p className="pill mb-6">App 4 of 4</p>
      <h1 style={{ fontSize: "3rem", lineHeight: 1.05, marginBottom: "1rem" }}>
        Still Here
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-ink-500)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
        Stay close to the people who used to be close.
      </p>
      <p style={{ color: "var(--color-ink-500)", lineHeight: 1.6, marginBottom: "2rem" }}>
        Add the friends you keep meaning to text. Still Here keeps a quiet
        eye on who you have not talked to in a while, drafts a personal
        opener so you do not have to start from scratch, and remembers to
        ask how it went a month later.
      </p>

      {session ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link href="/d/friends" className="btn-primary" style={{ textDecoration: "none" }}>
              Open Still Here
            </Link>
            <Link href="/d/friends/new" className="btn-secondary" style={{ textDecoration: "none" }}>
              Add a friend
            </Link>
          </div>
          {friends.length === 0 ? (
            <p className="muted">No friends yet. Add someone to get started.</p>
          ) : (
            <div className="card-soft">
              <p style={{ fontSize: "0.95rem" }}>
                <strong>{driftFriends.length}</strong> friend{driftFriends.length === 1 ? "" : "s"} you have not talked to in 8+ weeks.
              </p>
              {driftFriends.length > 0 && (
                <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.4rem" }}>
                  {driftFriends.slice(0, 3).map((f) => f.name).join(", ")}
                  {driftFriends.length > 3 ? `, and ${driftFriends.length - 3} more` : ""}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="card-soft">
          <p style={{ marginBottom: "0.75rem" }}>
            <Link href="/signup" style={{ fontWeight: 500 }}>Create an account</Link> to
            save your friends and unlock {free} free uses.
          </p>
          <p className="muted">Or <Link href="/login">log in</Link> if you have one.</p>
        </div>
      )}

      <div className="mt-16">
        <h3 className="serif" style={{ marginBottom: "1rem" }}>How it works</h3>
        <ol style={{ color: "var(--color-ink-500)", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
          <li>Add the friends you care about. Just their name and a short note about who they are.</li>
          <li>Mark a touchpoint after you text, call, or see them. One tap.</li>
          <li>Open Still Here on Sunday. It picks 1-2 people you have not talked to in 8+ weeks.</li>
          <li>It drafts three openers in different tones. Pick one, send it.</li>
          <li>A month later, it pings you to see how it went.</li>
        </ol>
      </div>

      <div className="mt-12 card-soft" style={{ background: "var(--color-forest-50)", borderColor: "var(--color-forest-100)" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-500)" }}>
          <strong>Privacy.</strong> Your friends' data stays in your account. We
          never ask for access to your contacts. You type the names in
          yourself.
        </p>
      </div>

      <p className="muted" style={{ marginTop: "2rem" }}>
        Free for {free} friends. Then ${PRICING.d.price / 100}/mo for unlimited.
      </p>
    </div>
  );
}

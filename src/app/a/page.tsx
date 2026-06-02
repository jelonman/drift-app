import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, getFreeLimit } from "@/lib/stripe";

export default async function ALanding() {
  const session = await getSession();
  const free = getFreeLimit("a");
  const recent = session
    ? await prisma.conversation.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { replies: true },
      })
    : [];

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32">
      <p className="pill mb-6">App 1 of 4</p>
      <h1 style={{ fontSize: "3rem", lineHeight: 1.05, marginBottom: "1rem" }}>
        Three Dots
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-ink-500)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
        Stop staring at the keyboard. Get three replies that fit how you
        actually want to sound.
      </p>
      <p style={{ color: "var(--color-ink-500)", lineHeight: 1.6, marginBottom: "2rem" }}>
        Paste the chat. Tell it how you are feeling. It reads the whole
        conversation, notices the loop you are stuck in, and gives you three
        reply options with the reason each one works. The point is not to
        sound smoother. The point is to break the spiral so you actually
        send something.
      </p>

      {session ? (
        <div className="space-y-4">
          <Link href="/a/new" className="btn-primary" style={{ textDecoration: "none" }}>
            Start a new conversation
          </Link>
          {recent.length > 0 && (
            <div className="mt-10">
              <h3 className="serif" style={{ marginBottom: "1rem" }}>Recent</h3>
              <div className="space-y-2">
                {recent.map((c) => (
                  <Link
                    key={c.id}
                    href={`/a/c/${c.id}`}
                    className="card block"
                    style={{ textDecoration: "none", padding: "1rem 1.25rem" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span style={{ fontWeight: 500 }}>{c.stage} · {c.mood}</span>
                      <span className="muted" style={{ fontSize: "0.85rem" }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
                      {c.pastedText.slice(0, 120)}{c.pastedText.length > 120 ? "..." : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card-soft">
          <p style={{ marginBottom: "0.75rem" }}>
            <Link href="/signup" style={{ fontWeight: 500 }}>Create an account</Link> to
            save your conversations and unlock {free} free uses.
          </p>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            Or <Link href="/login">log in</Link> if you have one.
          </p>
        </div>
      )}

      <div className="mt-16">
        <h3 className="serif" style={{ marginBottom: "1rem" }}>What you get</h3>
        <ul style={{ color: "var(--color-ink-500)", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
          <li>Three reply options for every conversation (warm, playful, direct, or leave-space)</li>
          <li>A one-sentence note on what your hesitation is actually telling you</li>
          <li>A history of past conversations so you can see your own patterns</li>
          <li>No streak, no badge, no engagement loop. Just the next reply.</li>
        </ul>
      </div>

      <p className="muted" style={{ marginTop: "2rem" }}>
        Free for {free} conversations. Then ${PRICING.a.price / 100}/mo for unlimited.
      </p>
    </div>
  );
}

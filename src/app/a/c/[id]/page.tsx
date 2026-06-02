import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ConversationActions from "./actions";

export default async function ConversationView({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const convo = await prisma.conversation.findUnique({
    where: { id },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });
  if (!convo || convo.userId !== session.userId) notFound();

  const TONE_LABELS: Record<string, { label: string; bg: string; color: string }> = {
    warm:        { label: "Warm",        bg: "var(--color-clay-50)",   color: "var(--color-clay-700)" },
    playful:     { label: "Playful",     bg: "var(--color-forest-50)", color: "var(--color-forest-700)" },
    direct:      { label: "Direct",      bg: "var(--color-cream-200)", color: "var(--color-ink-700)" },
    leave_space: { label: "Leave space", bg: "var(--color-cream-200)", color: "var(--color-ink-500)" },
  };
  const visible = convo.replies.filter((r) => r.tone !== "_coaching");
  const coaching = convo.replies.find((r) => r.tone === "_coaching")?.text;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-32">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="serif" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
            Your replies
          </h1>
          <p className="muted">
            {convo.stage} · {convo.mood} · {new Date(convo.createdAt).toLocaleString()}
          </p>
        </div>
        <Link href="/a" className="btn-ghost">← All</Link>
      </div>

      {coaching && (
        <div
          className="card-soft"
          style={{
            background: "var(--color-forest-50)",
            borderColor: "var(--color-forest-100)",
            marginBottom: "2rem",
          }}
        >
          <p className="label" style={{ color: "var(--color-forest-700)" }}>A note on the hesitation</p>
          <p style={{ lineHeight: 1.6, color: "var(--color-ink-700)" }}>{coaching}</p>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((r) => {
          const m = TONE_LABELS[r.tone] ?? { label: r.tone, bg: "var(--color-cream-200)", color: "var(--color-ink-700)" };
          return (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="pill" style={{ background: m.bg, color: m.color, borderColor: "transparent" }}>
                  {m.label}
                </span>
                <ConversationActions id={convo.id} text={r.text} />
              </div>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.55, color: "var(--color-ink-900)", marginBottom: "0.75rem" }}>
                {r.text}
              </p>
              <p className="muted" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                {r.rationale}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link href="/a/new" className="btn-primary" style={{ textDecoration: "none" }}>
          Start another
        </Link>
      </div>
    </div>
  );
}

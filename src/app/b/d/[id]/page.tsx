import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type DropMeta = {
  raw: string;
  draft_reply: string | null;
  needs_clarification: string | null;
  task_ids: string[];
};

export default async function BDrop({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const drop = await prisma.task.findUnique({ where: { id } });
  if (!drop || !drop.title.startsWith("__drop__")) notFound();
  const family = await prisma.family.findUnique({ where: { id: drop.familyId } });
  if (!family || family.ownerId !== session.userId) notFound();

  const meta: DropMeta = JSON.parse(drop.title.slice("__drop__".length));
  const tasks = await prisma.task.findMany({
    where: { id: { in: meta.task_ids } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-32 space-y-6">
      <div>
        <Link href={`/b/family/${family.id}`} className="btn-ghost">← Family board</Link>
      </div>

      <div>
        <h1 className="serif" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Sorted
        </h1>
        <p className="muted">
          {tasks.length} new task{tasks.length === 1 ? "" : "s"} added to the board.
        </p>
      </div>

      {meta.needs_clarification && (
        <div className="card-soft" style={{ background: "var(--color-clay-50)", borderColor: "var(--color-clay-100)" }}>
          <p className="label" style={{ color: "var(--color-clay-700)" }}>Need to know</p>
          <p style={{ lineHeight: 1.55 }}>{meta.needs_clarification}</p>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="card flex items-start justify-between gap-4" style={{ padding: "1rem 1.25rem" }}>
              <div>
                <p style={{ fontWeight: 500 }}>{t.title}</p>
                {t.description && <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>{t.description}</p>}
                {t.dueDate && (
                  <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    Due {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="pill" style={{ flexShrink: 0 }}>
                {t.assigneeId === family.ownerId ? "You" : "Partner"}
              </span>
            </div>
          ))}
        </div>
      )}

      {meta.draft_reply && (
        <div>
          <h3 className="serif" style={{ marginBottom: "0.5rem" }}>Draft reply</h3>
          <div className="card">
            <p style={{ lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{meta.draft_reply}</p>
            <div className="mt-3">
              <CopyButton text={meta.draft_reply} />
            </div>
          </div>
        </div>
      )}

      <div className="card-soft">
        <p className="label">Your raw note</p>
        <p style={{ whiteSpace: "pre-wrap", color: "var(--color-ink-500)" }}>{meta.raw}</p>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  return (
    <form
      action="javascript:void(0)"
      onClick={async (e) => {
        e.preventDefault();
        await navigator.clipboard.writeText(text);
        const el = e.currentTarget.querySelector("button") as HTMLButtonElement;
        const orig = el.innerText;
        el.innerText = "Copied";
        setTimeout(() => { el.innerText = orig; }, 1200);
      }}
    >
      <button type="button" className="btn-ghost" style={{ fontSize: "0.85rem" }}>
        Copy draft
      </button>
    </form>
  );
}

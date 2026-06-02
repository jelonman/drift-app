import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function BDrop({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const drop = await prisma.drop.findUnique({ where: { id } });
  if (!drop) notFound();
  const family = await prisma.family.findUnique({ where: { id: drop.familyId } });
  if (!family || family.ownerId !== session.userId) notFound();

  let taskIds: string[] = [];
  try {
    taskIds = JSON.parse(drop.taskIds);
  } catch {
    taskIds = [];
  }
  const tasks = await prisma.task.findMany({
    where: { id: { in: taskIds } },
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

      {drop.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={drop.imageUrl}
          alt="Uploaded flyer"
          style={{ maxWidth: "100%", borderRadius: "12px", border: "1px solid var(--color-ink-100)" }}
        />
      )}

      {drop.needsClarification && (
        <div className="card-soft" style={{ background: "var(--color-clay-50)", borderColor: "var(--color-clay-100)" }}>
          <p className="label" style={{ color: "var(--color-clay-700)" }}>Need to know</p>
          <p style={{ lineHeight: 1.55 }}>{drop.needsClarification}</p>
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

      {drop.draftReply && (
        <div>
          <h3 className="serif" style={{ marginBottom: "0.5rem" }}>Draft reply</h3>
          <div className="card">
            <p style={{ lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{drop.draftReply}</p>
            <div className="mt-3">
              <CopyButton text={drop.draftReply} />
            </div>
          </div>
        </div>
      )}

      <div className="card-soft">
        <p className="label">Your raw note</p>
        <p style={{ whiteSpace: "pre-wrap", color: "var(--color-ink-500)" }}>{drop.rawText}</p>
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

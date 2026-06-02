import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function BFamilyBoard({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const family = await prisma.family.findUnique({ where: { id } });
  if (!family || family.ownerId !== session.userId) notFound();

  const allTasks = await prisma.task.findMany({
    where: { familyId: family.id },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });
  const realTasks = allTasks.filter((t) => !t.title.startsWith("__drop__"));
  const open = realTasks.filter((t) => t.status !== "done");
  const done = realTasks.filter((t) => t.status === "done");

  const recentDrops = await prisma.drop.findMany({
    where: { familyId: family.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  async function toggleTask(formData: FormData) {
    "use server";
    const ses = await getSession();
    if (!ses) return;
    const taskId = formData.get("taskId") as string;
    const next = formData.get("next") as string;
    const t = await prisma.task.findUnique({ where: { id: taskId }, include: { family: true } });
    if (!t || t.family.ownerId !== ses.userId) return;
    await prisma.task.update({
      where: { id: taskId },
      data: { status: next, completedAt: next === "done" ? new Date() : null },
    });
    revalidatePath(`/b/family/${id}`);
  }

  async function addTask(formData: FormData) {
    "use server";
    const ses = await getSession();
    if (!ses) return;
    const title = ((formData.get("title") as string) || "").trim();
    if (!title) return;
    await prisma.task.create({
      data: { familyId: id, title, source: "manual" },
    });
    revalidatePath(`/b/family/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32 space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <Link href="/b" className="btn-ghost" style={{ fontSize: "0.85rem" }}>← Tag In</Link>
          <h1 className="serif" style={{ fontSize: "1.75rem", marginTop: "0.5rem" }}>Family board</h1>
        </div>
        <Link href="/b/new" className="btn-primary" style={{ textDecoration: "none" }}>Drop something in</Link>
      </div>

      {family.partnerEmail && (
        <div className="card-soft" style={{ padding: "0.875rem 1.25rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-500)" }}>
            Paired with <strong>{family.partnerEmail}</strong>. They can sign up and
            join the board any time.
          </p>
        </div>
      )}

      <form action={addTask} className="flex gap-2">
        <input name="title" placeholder="Add a quick task..." style={{ flex: 1 }} />
        <button type="submit" className="btn-secondary">Add</button>
      </form>

      <div>
        <h3 className="serif" style={{ marginBottom: "0.75rem" }}>Open ({open.length})</h3>
        {open.length === 0 ? (
          <p className="muted" style={{ padding: "1.5rem 0" }}>Nothing open. Drop something in or add a task above.</p>
        ) : (
          <div className="space-y-2">
            {open.map((t) => (
              <TaskRow key={t.id} t={t} ownerId={family.ownerId} toggle={toggleTask} />
            ))}
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div>
          <h3 className="serif" style={{ marginBottom: "0.75rem", color: "var(--color-ink-300)" }}>Done ({done.length})</h3>
          <div className="space-y-2">
            {done.slice(0, 10).map((t) => (
              <TaskRow key={t.id} t={t} ownerId={family.ownerId} toggle={toggleTask} />
            ))}
          </div>
        </div>
      )}

      {recentDrops.length > 0 && (
        <div>
          <h3 className="serif" style={{ marginBottom: "0.75rem", color: "var(--color-ink-300)" }}>Recent drops</h3>
          <div className="space-y-2">
            {recentDrops.map((d) => (
              <Link
                key={d.id}
                href={`/b/d/${d.id}`}
                className="card flex items-center gap-3"
                style={{ padding: "0.75rem 1.25rem", textDecoration: "none", color: "inherit" }}
              >
                {d.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.imageUrl}
                    alt=""
                    style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-ink-700)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {d.rawText.slice(0, 80) || "(photo only)"}
                  </p>
                  <p className="muted" style={{ fontSize: "0.75rem" }}>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  t,
  ownerId,
  toggle,
}: {
  t: { id: string; title: string; description: string | null; dueDate: Date | null; status: string; assigneeId: string | null };
  ownerId: string;
  toggle: (fd: FormData) => Promise<void>;
}) {
  const isDone = t.status === "done";
  return (
    <form action={toggle} className="card flex items-start gap-3" style={{ padding: "0.875rem 1.25rem" }}>
      <input type="hidden" name="taskId" value={t.id} />
      <input type="hidden" name="next" value={isDone ? "open" : "done"} />
      <button
        type="submit"
        className="btn-ghost"
        style={{ padding: "0.25rem 0.5rem", fontSize: "1.1rem", color: isDone ? "var(--color-forest-700)" : "var(--color-ink-300)" }}
        aria-label={isDone ? "Mark open" : "Mark done"}
      >
        {isDone ? "✓" : "○"}
      </button>
      <div style={{ flex: 1, opacity: isDone ? 0.55 : 1 }}>
        <p style={{ fontWeight: 500, textDecoration: isDone ? "line-through" : "none" }}>{t.title}</p>
        {t.description && <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>{t.description}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span className="pill" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
            {t.assigneeId === ownerId ? "You" : t.assigneeId ? "Partner" : "Unassigned"}
          </span>
          {t.dueDate && (
            <span className="muted" style={{ fontSize: "0.75rem" }}>
              Due {new Date(t.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

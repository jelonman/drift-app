import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, getFreeLimit } from "@/lib/stripe";

export default async function BLanding() {
  const session = await getSession();
  const families = session
    ? await prisma.family.findMany({
        where: { ownerId: session.userId },
            include: { tasks: { where: { status: { not: "done" } } } },
        })
    : [];
  const free = getFreeLimit("b");

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32">
      <p className="pill mb-6">App 2 of 4</p>
      <h1 style={{ fontSize: "3rem", lineHeight: 1.05, marginBottom: "1rem" }}>
        Tag In
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-ink-500)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
        You should not be the one who remembers everything.
      </p>
      <p style={{ color: "var(--color-ink-500)", lineHeight: 1.6, marginBottom: "2rem" }}>
        Snap a school flyer. Forward a text from the dentist. Drop a voice
        memo at 11pm when the kindergarten teacher just emailed about
        tomorrow. Tag In pulls out the tasks, splits them between you and
        your partner, and drafts the reply you would have written if you
        were not already in bed.
      </p>

      {session ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link href="/b/new" className="btn-primary" style={{ textDecoration: "none" }}>
              Drop something in
            </Link>
            {families.length === 0 ? (
              <Link href="/b/family/new" className="btn-secondary" style={{ textDecoration: "none" }}>
                Set up your family
              </Link>
            ) : (
              <Link href={`/b/family/${families[0].id}`} className="btn-secondary" style={{ textDecoration: "none" }}>
                Open family board
              </Link>
            )}
          </div>
          {families.length > 0 && families[0].tasks.length > 0 && (
            <p className="muted">
              {families[0].tasks.length} open task{families[0].tasks.length === 1 ? "" : "s"} on the board.
            </p>
          )}
        </div>
      ) : (
        <div className="card-soft">
          <p style={{ marginBottom: "0.75rem" }}>
            <Link href="/signup" style={{ fontWeight: 500 }}>Create an account</Link> to
            set up a family and start dropping things in.
          </p>
          <p className="muted">
            {free} days free. Then ${PRICING.b.price / 100}/mo per family.
          </p>
        </div>
      )}

      <div className="mt-16">
        <h3 className="serif" style={{ marginBottom: "1rem" }}>What it does</h3>
        <ul style={{ color: "var(--color-ink-500)", lineHeight: 1.8, paddingLeft: "1.2rem" }}>
          <li>Reads the thing you dropped in (text, image, or voice note)</li>
          <li>Pulls out the action items: who needs to do what, by when</li>
          <li>Splits them between you and your partner based on who has done what lately</li>
          <li>Drafts the text or email reply that has to go out</li>
          <li>Both of you see the same board. Check things off. Add notes.</li>
        </ul>
      </div>
    </div>
  );
}

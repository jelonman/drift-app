import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function BFamilyNew() {
  const session = await getSession();
  if (!session) redirect("/signup?next=/b/family/new");

  // If a family already exists, just send them to the board
  const existing = await prisma.family.findFirst({ where: { ownerId: session.userId } });
  if (existing) redirect(`/b/family/${existing.id}`);

  async function createFamily(formData: FormData) {
    "use server";
    const ses = await getSession();
    if (!ses) return;
    const name = (formData.get("name") as string | null)?.trim() || "Our family";
    const partnerEmail = ((formData.get("partnerEmail") as string | null) || "").trim().toLowerCase() || null;
    const family = await prisma.family.create({
      data: { ownerId: ses.userId, partnerEmail, pairedAt: partnerEmail ? new Date() : null },
    });
    redirect(`/b/family/${family.id}`);
  }

  return (
    <div className="max-w-md mx-auto px-6 pt-16 pb-32">
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Set up your family</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Just a name and your partner's email (optional). You can add them
        later.
      </p>
      <form action={createFamily} className="card space-y-4">
        <div>
          <label className="label">Family name</label>
          <input name="name" placeholder="Our family" defaultValue="Our family" />
        </div>
        <div>
          <label className="label">Partner's email (optional)</label>
          <input
            name="partnerEmail"
            type="email"
            placeholder="partner@example.com"
          />
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
            They can sign up with this email later to share the board.
          </p>
        </div>
        <button type="submit" className="btn-primary w-full justify-center">Create family</button>
      </form>
    </div>
  );
}

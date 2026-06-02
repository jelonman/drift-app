import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NewDropForm from "./form";

export default async function BNew() {
  const session = await getSession();
  if (!session) redirect("/signup?next=/b/new");

  const family = await prisma.family.findFirst({
    where: { ownerId: session.userId },
  });
  if (!family) redirect("/b/family/new");

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32">
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Drop something in</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Paste a text, drop a photo of a flyer, or describe what just happened.
        Tag In will sort it.
      </p>
      <NewDropForm familyId={family.id} />
    </div>
  );
}

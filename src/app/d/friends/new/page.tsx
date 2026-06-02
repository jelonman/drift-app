import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DNewFriend() {
  const session = await getSession();
  if (!session) redirect("/signup?next=/d/friends/new");

  async function addFriend(formData: FormData) {
    "use server";
    const ses = await getSession();
    if (!ses) return;
    const name = ((formData.get("name") as string) || "").trim();
    if (!name) return;
    const relationship = ((formData.get("relationship") as string) || "friend").trim();
    const contactInfo = ((formData.get("contactInfo") as string) || "").trim() || null;
    const notes = ((formData.get("notes") as string) || "").trim() || null;
    const friend = await prisma.friend.create({
      data: { userId: ses.userId, name, relationship, contactInfo, notes },
    });
    revalidatePath("/d/friends");
    redirect(`/d/friends/${friend.id}`);
  }

  return (
    <div className="max-w-md mx-auto px-6 pt-16 pb-32">
      <Link href="/d/friends" className="btn-ghost" style={{ fontSize: "0.85rem" }}>← Friends</Link>
      <h1 style={{ fontSize: "2rem", margin: "0.75rem 0 0.5rem" }}>Add a friend</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Just the basics. You can always add more later.
      </p>
      <form action={addFriend} className="card space-y-4">
        <div>
          <label className="label">Name</label>
          <input name="name" required autoFocus placeholder="Maya Chen" />
        </div>
        <div>
          <label className="label">How do you know them?</label>
          <input name="relationship" placeholder="College roommate, work friend, neighbor, etc." defaultValue="Friend" />
        </div>
        <div>
          <label className="label">How to reach them (optional)</label>
          <input name="contactInfo" placeholder="Phone, IG handle, email, etc." />
        </div>
        <div>
          <label className="label">A note (optional)</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Anything that helps Still Here write a personal opener. New baby, just moved, hates small talk, etc."
          />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">Add friend</button>
      </form>
    </div>
  );
}

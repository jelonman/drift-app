import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NewConversationForm from "./form";

export default async function NewConversation() {
  const session = await getSession();
  if (!session) redirect("/signup?next=/a/new");

  const thisMonth = await prisma.conversation.count({
    where: {
      userId: session.userId,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  const FREE = 5;
  const remaining = Math.max(0, FREE - thisMonth);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32">
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>New conversation</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Paste the chat below. Be honest about how you are feeling. The more
        you give it, the more useful the replies are.
      </p>
      <NewConversationForm remaining={remaining} free={FREE} />
    </div>
  );
}

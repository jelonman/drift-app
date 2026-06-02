"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConversationActions({ id, text }: { id: string; text: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  async function del() {
    if (!confirm("Delete this conversation? It cannot be recovered.")) return;
    setDeleting(true);
    const res = await fetch(`/api/a/conversations/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) router.push("/a");
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={copy} className="btn-ghost" style={{ fontSize: "0.85rem" }}>
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={del}
        disabled={deleting}
        className="btn-ghost"
        style={{ fontSize: "0.85rem", color: "var(--color-clay-700)" }}
      >
        {deleting ? "..." : "Delete"}
      </button>
    </div>
  );
}

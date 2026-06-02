"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Touchpoint = { date: string; note: string | null };

export default function FriendActions({
  friendId,
  friendName,
  relationship,
  notes,
  touchpoints,
}: {
  friendId: string;
  friendName: string;
  relationship: string;
  notes: string | null;
  touchpoints: Touchpoint[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [replies, setReplies] = useState<{ tone: string; text: string; why: string }[] | null>(null);

  async function draft() {
    setErr(null);
    setBusy(true);
    const res = await fetch("/api/d/openers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Something went wrong.");
      return;
    }
    const data = await res.json();
    setReplies(data.replies);
  }

  async function markSent(tone: string, text: string) {
    await fetch("/api/d/openers/sent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ friendId, tone, text }),
    });
    router.refresh();
  }

  if (replies) {
    return (
      <div className="space-y-3">
        {replies.map((r, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="pill" style={{
                background: r.tone === "warm" ? "var(--color-clay-50)" : r.tone === "callback" ? "var(--color-forest-50)" : "var(--color-cream-200)",
                color: r.tone === "warm" ? "var(--color-clay-700)" : r.tone === "callback" ? "var(--color-forest-700)" : "var(--color-ink-700)",
                borderColor: "transparent",
              }}>
                {r.tone === "warm" ? "Warm" : r.tone === "callback" ? "Callback" : "Forward"}
              </span>
              <CopyButton text={r.text} onCopied={() => markSent(r.tone, r.text)} />
            </div>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.55, color: "var(--color-ink-900)", marginBottom: "0.5rem" }}>
              {r.text}
            </p>
            <p className="muted" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>{r.why}</p>
          </div>
        ))}
        <button onClick={() => setReplies(null)} className="btn-ghost" style={{ fontSize: "0.85rem" }}>
          ← Draft again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button onClick={draft} disabled={busy} className="btn-primary">
        {busy ? "Reading your notes..." : "Draft an opener"}
      </button>
      {err && <p style={{ color: "var(--color-clay-700)", fontSize: "0.9rem" }}>{err}</p>}
    </div>
  );
}

function CopyButton({ text, onCopied }: { text: string; onCopied?: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopied?.();
        setTimeout(() => setCopied(false), 1200);
      }}
      className="btn-ghost"
      style={{ fontSize: "0.85rem" }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

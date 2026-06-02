"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = [
  { value: "new_match", label: "Just matched" },
  { value: "chatting", label: "Been chatting" },
  { value: "pre_date", label: "Pre-date planning" },
  { value: "post_date", label: "After a date" },
  { value: "seeing_each_other", label: "Seeing each other" },
  { value: "situationship", label: "It's complicated" },
  { value: "exclusivity", label: "Defining it" },
  { value: "long_term", label: "Long-term partner" },
];

const MOODS = [
  { value: "anxious", label: "Anxious" },
  { value: "playful", label: "Playful" },
  { value: "tired", label: "Tired" },
  { value: "frustrated", label: "Frustrated" },
  { value: "hopeful", label: "Hopeful" },
  { value: "guarded", label: "Guarded" },
  { value: "neutral", label: "Neutral" },
];

export default function NewConversationForm({
  remaining,
  free,
}: {
  remaining: number;
  free: number;
}) {
  const router = useRouter();
  const [stage, setStage] = useState("chatting");
  const [mood, setMood] = useState("anxious");
  const [pastedText, setPastedText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (remaining === 0) {
    return (
      <div className="card-soft">
        <h3 className="serif" style={{ marginBottom: "0.5rem" }}>You have used all {free} free conversations</h3>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Subscribe for unlimited. Or wait until next month for your free
          uses to refresh.
        </p>
        <a href="/account#pricing" className="btn-primary" style={{ textDecoration: "none" }}>
          See pricing
        </a>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pastedText.trim().length < 20) {
      setErr("Paste at least the last few messages (20+ characters).");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/a/conversations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stage, mood, pastedText }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Something went wrong. Please try again.");
      return;
    }
    const { id } = await res.json();
    router.push(`/a/c/${id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Where are you two at?</label>
        <select value={stage} onChange={(e) => setStage(e.target.value)}>
          {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">How are you feeling about it?</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          {MOODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Paste the conversation</label>
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          rows={10}
          placeholder={`Them: ...\nYou: ...\nThem: ...\n\nInclude the most recent 5-15 messages. Names are fine to leave in.`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
        />
        <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
          Stays in your account. Not used to train anything. You can delete it
          any time.
        </p>
      </div>
      {err && <p style={{ color: "var(--color-clay-700)", fontSize: "0.9rem" }}>{err}</p>}
      <div className="flex items-center justify-between">
        <span className="muted" style={{ fontSize: "0.85rem" }}>
          {remaining} of {free} free uses left
        </span>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Reading the chat..." : "Get three replies"}
        </button>
      </div>
    </form>
  );
}

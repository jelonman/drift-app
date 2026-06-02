type Reply = { tone: string; text: string; why: string };

type Props = {
  sampleChat: { from: "them" | "you"; text: string }[];
  replies: Reply[];
  coaching?: string;
};

const TONE_LABEL: Record<string, string> = {
  warm: "Warm",
  playful: "Playful",
  direct: "Direct",
  leave_space: "Leave space",
  callback: "Callback",
  forward: "Forward",
};

const TONE_BG: Record<string, string> = {
  warm: "var(--color-forest-50)",
  playful: "var(--color-cream-100)",
  direct: "var(--color-ink-50)",
  leave_space: "var(--color-clay-50)",
  callback: "var(--color-cream-100)",
  forward: "var(--color-forest-50)",
};

export function SampleOutput({ sampleChat, replies, coaching }: Props) {
  return (
    <section>
      <h2 className="serif" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        What you actually get
      </h2>

      <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
        <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
          Sample conversation
        </p>
        <div className="space-y-2" style={{ fontSize: "0.95rem" }}>
          {sampleChat.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "0.5rem 0.75rem",
                background: m.from === "them" ? "var(--color-ink-50)" : "var(--color-forest-50)",
                borderRadius: 4,
                color: m.from === "them" ? "var(--color-ink-700)" : "var(--color-forest-700)",
                maxWidth: "80%",
                marginLeft: m.from === "them" ? 0 : "auto",
              }}
            >
              {m.text}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {replies.map((r, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: "1rem 1.25rem",
              background: TONE_BG[r.tone] ?? "var(--color-cream-50)",
            }}
          >
            <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                {TONE_LABEL[r.tone] ?? r.tone}
              </span>
            </div>
            <p style={{ marginBottom: "0.5rem", lineHeight: 1.45 }}>{r.text}</p>
            <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.5, fontStyle: "italic" }}>
              {r.why}
            </p>
          </div>
        ))}
      </div>

      {coaching && (
        <div
          className="card-soft"
          style={{
            marginTop: "1rem",
            padding: "1rem 1.25rem",
            background: "var(--color-cream-100)",
            fontStyle: "italic",
            color: "var(--color-ink-700)",
            lineHeight: 1.5,
          }}
        >
          <p className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.25rem", fontStyle: "normal" }}>
            Coaching
          </p>
          {coaching}
        </div>
      )}
    </section>
  );
}

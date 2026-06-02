type Step = {
  n: number;
  title: string;
  body: string;
};

type Props = { steps: Step[] };

export function HowItWorks({ steps }: Props) {
  return (
    <section>
      <h2 className="serif" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        How it works
      </h2>
      <ol className="space-y-4" style={{ listStyle: "none", paddingLeft: 0 }}>
        {steps.map((s) => (
          <li key={s.n} className="card flex gap-4" style={{ padding: "1.25rem 1.5rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {s.n}
            </div>
            <div>
              <p style={{ fontWeight: 500, marginBottom: "0.25rem" }}>{s.title}</p>
              <p className="muted" style={{ fontSize: "0.95rem", lineHeight: 1.55 }}>
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

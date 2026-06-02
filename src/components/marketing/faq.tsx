type Q = { q: string; a: string };

type Props = { items: Q[] };

export function Faq({ items }: Props) {
  return (
    <section>
      <h2 className="serif" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        Common questions
      </h2>
      <div className="space-y-3">
        {items.map((it, i) => (
          <details key={i} className="card" style={{ padding: "0" }}>
            <summary
              style={{
                padding: "1rem 1.25rem",
                cursor: "pointer",
                fontWeight: 500,
                listStyle: "none",
              }}
            >
              {it.q}
            </summary>
            <div style={{ padding: "0 1.25rem 1.25rem 1.25rem" }} className="muted">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

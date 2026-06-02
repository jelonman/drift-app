type Item = { text: string };

type Props = {
  title: string;
  items: Item[];
  variant?: "for" | "not";
};

export function ForWho({ title, items, variant = "for" }: Props) {
  const isFor = variant === "for";
  return (
    <section>
      <h2 className="serif" style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
        {title}
      </h2>
      <ul
        className="card-soft"
        style={{
          listStyle: "none",
          padding: "1.25rem 1.5rem",
          margin: 0,
        }}
      >
        {items.map((it, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              padding: "0.5rem 0",
              color: "var(--color-ink-700)",
              lineHeight: 1.55,
            }}
          >
            <span
              style={{
                color: isFor ? "var(--color-forest-600)" : "var(--color-clay-500)",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {isFor ? "+" : "—"}
            </span>
            <span>{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

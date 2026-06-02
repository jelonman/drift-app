import Link from "next/link";

type Props = {
  title?: string;
  cta: { label: string; href: string };
  sub?: string;
};

export function FinalCta({ title = "Try it free", cta, sub }: Props) {
  return (
    <section
      className="card-soft"
      style={{
        textAlign: "center",
        padding: "3rem 2rem",
        background: "var(--color-forest-50)",
      }}
    >
      <h2 className="serif" style={{ marginBottom: "0.5rem", fontSize: "1.75rem" }}>
        {title}
      </h2>
      {sub && (
        <p className="muted" style={{ marginBottom: "1.5rem", maxWidth: "40ch", margin: "0 auto 1.5rem" }}>
          {sub}
        </p>
      )}
      <Link href={cta.href} className="btn-primary" style={{ textDecoration: "none" }}>
        {cta.label}
      </Link>
    </section>
  );
}

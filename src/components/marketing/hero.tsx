import Link from "next/link";

type Cta = { label: string; href: string };

type Props = {
  pill?: string;
  title: string;
  subtitle: string;
  body?: string;
  primary: Cta;
  secondary?: Cta;
};

export function Hero({ pill, title, subtitle, body, primary, secondary }: Props) {
  return (
    <section>
      {pill && <p className="pill pill-forest mb-6">{pill}</p>}
      <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", lineHeight: 1.05, marginBottom: "1rem", maxWidth: "28ch" }}>
        {title}
      </h1>
      <p style={{ fontSize: "1.2rem", color: "var(--color-ink-500)", lineHeight: 1.45, marginBottom: "1rem", maxWidth: "40ch" }}>
        {subtitle}
      </p>
      {body && (
        <p style={{ color: "var(--color-ink-500)", lineHeight: 1.6, marginBottom: "2rem", maxWidth: "55ch" }}>
          {body}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Link href={primary.href} className="btn-primary" style={{ textDecoration: "none" }}>
          {primary.label}
        </Link>
        {secondary && (
          <Link href={secondary.href} className="btn-ghost" style={{ textDecoration: "none" }}>
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}

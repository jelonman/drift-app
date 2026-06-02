"use client";

import { useState } from "react";

type Props = {
  app: "a" | "b" | "c" | "d";
  hasSubscription: boolean;
  stripeReady: boolean;
  used: number;
  limit: number;
};

export function BillingActions({ app, hasSubscription, stripeReady, used, limit }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (hasSubscription) {
    return (
      <div>
        <button
          type="button"
          className="btn-ghost"
          onClick={handleManage}
          disabled={loading}
          style={{ fontSize: "0.9rem" }}
        >
          {loading ? "Loading..." : "Manage"}
        </button>
        {error && <p style={{ color: "var(--color-clay-600)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{error}</p>}
      </div>
    );
  }

  const atLimit = used >= limit;
  return (
    <div>
      <button
        type="button"
        className="btn-primary"
        onClick={handleSubscribe}
        disabled={loading || !stripeReady}
        style={{ fontSize: "0.9rem" }}
      >
        {loading ? "Loading..." : atLimit ? "Subscribe to continue" : "Subscribe"}
      </button>
      {!stripeReady && (
        <p className="muted" style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Stripe not yet wired
        </p>
      )}
      {error && <p style={{ color: "var(--color-clay-600)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{error}</p>}
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanActions({
  planId,
  index,
  dayName,
  weekStart,
}: {
  planId: string;
  index: number;
  dayName: string;
  weekStart: string;
}) {
  const router = useRouter();
  const [cooked, setCooked] = useState<null | boolean>(null);
  const [busy, setBusy] = useState(false);

  async function markCooked(cooked: boolean, rating?: number) {
    setBusy(true);
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    const res = await fetch("/api/c/meals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ planId, name: dayName, date: date.toISOString(), cooked, rating }),
    });
    setBusy(false);
    if (res.ok) {
      setCooked(cooked);
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-1">
      {cooked === true ? (
        <span className="pill pill-forest" style={{ fontSize: "0.75rem" }}>Cooked</span>
      ) : cooked === false ? (
        <span className="pill" style={{ fontSize: "0.75rem", color: "var(--color-clay-700)" }}>Skipped</span>
      ) : (
        <>
          <button
            disabled={busy}
            onClick={() => markCooked(true)}
            className="btn-ghost"
            style={{ fontSize: "0.8rem", color: "var(--color-forest-700)" }}
          >
            Cooked
          </button>
          <button
            disabled={busy}
            onClick={() => markCooked(false)}
            className="btn-ghost"
            style={{ fontSize: "0.8rem", color: "var(--color-ink-300)" }}
          >
            Skipped
          </button>
        </>
      )}
    </div>
  );
}

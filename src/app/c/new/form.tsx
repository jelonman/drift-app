"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PROTEINS = ["chicken", "beef", "pork", "fish", "shrimp", "tofu", "eggs", "beans", "lentils"];
const CUISINES = ["Italian", "Mexican", "Asian", "Indian", "Mediterranean", "American", "Thai", "Japanese", "French", "Middle Eastern"];

export default function NewPlanForm({ remaining, free }: { remaining: number; free: number }) {
  const router = useRouter();
  const [pantry, setPantry] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [servings, setServings] = useState(2);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (remaining === 0) {
    return (
      <div className="card-soft">
        <h3 className="serif" style={{ marginBottom: "0.5rem" }}>You have used all {free} free plans this month</h3>
        <p className="muted" style={{ marginBottom: "1rem" }}>Subscribe for unlimited weekly plans.</p>
        <a href="/account#pricing" className="btn-primary" style={{ textDecoration: "none" }}>See pricing</a>
      </div>
    );
  }

  function toggleCuisine(c: string) {
    setCuisines((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pantry.trim().length < 5) {
      setErr("List a few things you have. Even 'rice, eggs, butter, soy sauce' works.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/c/plans", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pantry, restrictions, servings, cuisines }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Something went wrong.");
      return;
    }
    const { id } = await res.json();
    router.push(`/c/plan/${id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label">What's in your fridge and pantry?</label>
        <textarea
          value={pantry}
          onChange={(e) => setPantry(e.target.value)}
          rows={6}
          placeholder={`Examples:\n"chicken thighs (2), half a yellow onion, garlic, soy sauce, rice, broccoli, half a lemon, butter, eggs, pasta, canned tomatoes, ground beef (1 lb), frozen peas, olive oil, parmesan, sourdough bread"`}
        />
      </div>
      <div>
        <label className="label">Any restrictions or dislikes? (optional)</label>
        <input
          value={restrictions}
          onChange={(e) => setRestrictions(e.target.value)}
          placeholder="e.g. no mushrooms, low spice, vegetarian on Tuesdays"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Servings per meal</label>
          <input
            type="number"
            min={1}
            max={8}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value) || 2)}
          />
        </div>
        <div>
          <label className="label">Cuisines (pick any)</label>
          <div className="flex flex-wrap gap-1.5" style={{ marginTop: "0.25rem" }}>
            {CUISINES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
                className="pill"
                style={{
                  cursor: "pointer",
                  background: cuisines.includes(c) ? "var(--color-forest-700)" : "var(--color-cream-200)",
                  color: cuisines.includes(c) ? "var(--color-cream-50)" : "var(--color-ink-700)",
                  borderColor: "transparent",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      {err && <p style={{ color: "var(--color-clay-700)", fontSize: "0.9rem" }}>{err}</p>}
      <div className="flex items-center justify-between">
        <span className="muted" style={{ fontSize: "0.85rem" }}>
          {remaining} of {free} free plans left
        </span>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Picking the week..." : "Plan the week"}
        </button>
      </div>
    </form>
  );
}

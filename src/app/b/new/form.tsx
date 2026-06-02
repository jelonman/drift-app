"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDropForm({ familyId }: { familyId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (text.trim().length < 10 && !file) {
      setErr("Type at least a sentence or two, or add a photo.");
      return;
    }
    setBusy(true);
    let imageUrl: string | null = null;
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      if (!up.ok) {
        const j = await up.json().catch(() => ({}));
        setErr(j.error || "Could not upload photo.");
        setBusy(false);
        return;
      }
      const j = await up.json();
      imageUrl = j.url;
    }
    const res = await fetch("/api/b/drops", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ familyId, text, imageUrl }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Something went wrong.");
      return;
    }
    const { id } = await res.json();
    router.push(`/b/d/${id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">What just came in?</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={`Examples:\n"School just sent a flyer about the field trip Friday. Needs $15 and a packed lunch. Permission slip due Wed."\n\n"Dentist called: Alex has an opening March 12 at 2pm. Need to confirm by Friday."\n\n"Melissa just texted that she can't do Wednesday pickup. We need to figure out who covers."`}
        />
        <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.4rem" }}>
          Be as messy as you want. Forward the whole email. Tag In will sort
          the tasks from the rest.
        </p>
      </div>
      <div>
        <label className="label" htmlFor="flyer-photo">
          Add a photo of the flyer (optional)
        </label>
        <input
          id="flyer-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ fontSize: "0.9rem" }}
        />
        {file && (
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}>
            {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}
      </div>
      {err && <p style={{ color: "var(--color-clay-700)", fontSize: "0.9rem" }}>{err}</p>}
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? "Sorting..." : "Sort this out"}
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-ghost"
      style={{ fontSize: "0.85rem" }}
    >
      {copied ? "Copied" : "Copy draft"}
    </button>
  );
}

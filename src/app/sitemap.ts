import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://drift-app-gamma.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/a`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/b`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/c`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/d`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

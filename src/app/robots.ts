import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://drift-app-gamma.vercel.app";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/account", "/a/c/", "/b/", "/c/", "/d/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

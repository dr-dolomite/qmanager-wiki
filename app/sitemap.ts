import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/docs-data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const latest = articles.map((a) => a.updatedAt).sort().at(-1);

  return [
    { url: `${SITE_URL}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    ...articles.map((a) => ({
      url: `${SITE_URL}/docs/${a.category}/${a.slug}/`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/nos-derniers-projets", priority: 0.9 },
  { path: "/comment-ca-marche", priority: 0.7 },
  { path: "/a-propos", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
  { path: "/diagnostic", priority: 0.7 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/politique-de-confidentialite", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: article.pillar ? 0.8 : 0.5,
  }));

  return [...pages, ...articles];
}

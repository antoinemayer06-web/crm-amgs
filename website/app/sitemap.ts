import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/automatisation-gestion-projet", priority: 0.9 },
  { path: "/automatisation-administrative-financiere", priority: 0.9 },
  { path: "/etude-de-cas-ecodden", priority: 0.9 },
  { path: "/comment-ca-marche", priority: 0.7 },
  { path: "/tarifs", priority: 0.7 },
  { path: "/a-propos", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}

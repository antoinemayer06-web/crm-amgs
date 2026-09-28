import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// `lastModified` reprend la date du dernier commit git ayant changé le
// contenu VISIBLE de chaque page (`git log -1 --format=%ad -- <fichier>`
// avant la présente passe SEO, qui ne touche que les métadonnées) plutôt
// qu'un `new Date()` recalculé à chaque build, qui donnerait une date
// toujours "aujourd'hui" même sans aucun changement réel — signal trompeur
// pour les moteurs de recherche. À mettre à jour manuellement si le
// contenu visible d'une page change à nouveau.
const ROUTES: { path: string; priority: number; lastModified: string }[] = [
  { path: "/", priority: 1, lastModified: "2026-09-28" },
  { path: "/services", priority: 0.9, lastModified: "2026-09-24" },
  {
    path: "/nos-derniers-projets",
    priority: 0.9,
    lastModified: "2026-09-24",
  },
  {
    path: "/comment-ca-marche",
    priority: 0.7,
    lastModified: "2026-09-24",
  },
  { path: "/a-propos", priority: 0.6, lastModified: "2026-09-25" },
  { path: "/blog", priority: 0.6, lastModified: "2026-09-24" },
  { path: "/contact", priority: 0.8, lastModified: "2026-09-10" },
  { path: "/diagnostic", priority: 0.7, lastModified: "2026-09-25" },
  {
    path: "/mentions-legales",
    priority: 0.2,
    lastModified: "2026-09-16",
  },
  {
    path: "/politique-de-confidentialite",
    priority: 0.2,
    lastModified: "2026-09-16",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map(({ path, priority, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
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

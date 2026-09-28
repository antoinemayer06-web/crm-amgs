import { getSortedArticles } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// Flux RSS des 9 articles, référencé via <link rel="alternate"> sur
// toutes les pages (voir lib/seo.ts) pour aider Google à découvrir et
// indexer rapidement le blog.

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getSortedArticles();

  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/blog/${article.slug}`;
      const pubDate = new Date(article.date).toUTCString();
      return `    <item>
      <title>${escapeXml(article.seoTitle ?? article.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.metaDescription)}</description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date(articles[0].date).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog AM Growth Solutions</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles pratiques sur l'automatisation, la connexion d'outils et l'organisation des PME à La Réunion (974).</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

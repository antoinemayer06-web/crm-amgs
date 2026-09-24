import type { Metadata } from "next";
import Link from "next/link";
import ArticleCover from "@/components/ArticleCover";
import PageIntro from "@/components/PageIntro";
import { getSortedArticles, readingTimeMinutes } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — ressources automatisation PME",
  description:
    "Articles pratiques sur l'automatisation, la connexion d'outils et l'organisation des PME à La Réunion (974) — sans jargon technique.",
  alternates: { canonical: "/blog" },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const articles = getSortedArticles();
  const [featured, ...rest] = articles;

  return (
    <main>
      <PageIntro
        title="Le blog d'AM Growth Solutions"
        subtitle="Automatisation, organisation et outils métiers pour les PME — articles classés du plus récent au plus ancien."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-lg sm:grid-cols-2"
          >
            <ArticleCover
              article={featured}
              className="sm:aspect-auto sm:h-full"
            />
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-dark">
                Article pilier
              </span>
              <h2 className="mt-4 font-heading text-2xl font-black text-foreground transition-colors group-hover:text-primary-dark sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {featured.excerpt}
              </p>
              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted">
                {formatDate(featured.date)} · {readingTimeMinutes(featured)}{" "}
                min de lecture
              </p>
            </div>
          </Link>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, index) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-lg"
              >
                <ArticleCover article={article} variant={index + 1} />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary-dark">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {article.excerpt}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
                    {formatDate(article.date)} · {readingTimeMinutes(article)}{" "}
                    min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

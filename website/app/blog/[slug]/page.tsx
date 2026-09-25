import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ArticleCover from "@/components/ArticleCover";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { ARTICLES, getArticle, readingTimeMinutes } from "@/lib/blog";
import { articleSchema, faqPageSchema } from "@/lib/schema";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.date,
      images: article.image ? [article.image] : undefined,
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <main>
      <JsonLd
        data={articleSchema({
          title: article.title,
          description: article.metaDescription,
          slug: article.slug,
          datePublished: article.date,
          image: article.image,
        })}
      />
      {article.faq ? <JsonLd data={faqPageSchema(article.faq)} /> : null}

      <PageIntro title={article.title} />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm text-muted">
            <span>
              Par{" "}
              <Link
                href="/a-propos"
                className="font-semibold text-primary-dark hover:underline"
              >
                Antoine Mayer
              </Link>
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{readingTimeMinutes(article)} min de lecture</span>
          </div>

          <ArticleCover
            article={article}
            className="mt-8 rounded-2xl border border-border"
          />

          <div className="mt-10 space-y-5 text-base leading-relaxed text-muted">
            {article.intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-4 space-y-10">
            {article.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {article.faq ? (
            <div className="mt-14">
              <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
                Questions fréquentes
              </h2>
              <div className="mt-6 space-y-4">
                {article.faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-2xl border border-border bg-background p-6"
                  >
                    <p className="font-heading text-base font-bold text-foreground">
                      {item.question}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-14 rounded-2xl border border-border bg-background p-6">
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              Pour aller plus loin
            </p>
            <ul className="mt-3 space-y-2">
              {article.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark transition hover:gap-2.5"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-heading text-xl font-black text-white">
                Une situation similaire chez vous ?
              </p>
              <p className="mt-1 text-sm text-white/60">
                Un premier échange suffit pour voir ce qui peut être
                automatisé dans votre cas.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

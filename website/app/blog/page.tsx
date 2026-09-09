import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";

// Structure prête, pas encore d'articles — voir le brief pour les sujets
// prévus (ex. "Comment éviter la double saisie entre son CRM et ses
// outils ?", "Signes qu'une PME a besoin d'automatiser sa gestion de
// projet ?"). Une route app/blog/[slug]/page.tsx sera ajoutée quand le
// premier article sera prêt à publier.

export const metadata: Metadata = {
  title: "Blog — ressources automatisation PME",
  description:
    "Articles à venir sur l'automatisation de la gestion de projet et de l'administratif des PME à La Réunion.",
  alternates: { canonical: "/blog" },
};

const UPCOMING_TOPICS = [
  "Comment éviter la double saisie entre son CRM et ses outils ?",
  "Les signes qu'une PME a besoin d'automatiser sa gestion de projet",
  "CRM et outil de gestion de tâches : comment les faire communiquer",
];

export default function BlogPage() {
  return (
    <main>
      <PageIntro
        title="Le blog d'AM Growth Solutions"
        subtitle="Des articles concrets sur l'automatisation des PME — premiers articles à venir."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-base leading-relaxed text-muted">
            Cette section accueillera bientôt des articles pratiques pour
            les dirigeants de PME, sans jargon technique. En attendant,
            voici ce qui est déjà au programme :
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {UPCOMING_TOPICS.map((topic) => (
              <li
                key={topic}
                className="rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground/80"
              >
                {topic}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Une question en attendant ? Contactez-moi
          </Link>
        </div>
      </section>
    </main>
  );
}

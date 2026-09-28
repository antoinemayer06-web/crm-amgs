import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Note from "@/components/Note";
import PageIntro from "@/components/PageIntro";
import ProjectCards from "@/components/ProjectCards";
import ProjectsClosing from "@/components/ProjectsClosing";
import { CASE_STUDY } from "@/lib/content";
import { breadcrumbSchema, projectsCollectionSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

// Anciennement /etude-de-cas — renommée pour refléter qu'elle présente
// plusieurs projets (redirection 301 mise en place dans next.config.mjs).

export const metadata: Metadata = pageMetadata({
  title: "Projets d'automatisation réalisés",
  description:
    "Quatre projets récents, anonymisés : suppression de la double saisie, plan de charge automatique, refonte de site connectée au CRM, chatbot de support IA. Résultats et méthode détaillés.",
  path: CASE_STUDY.href,
});

export default function NosDerniersProjetsPage() {
  return (
    <main>
      <JsonLd data={projectsCollectionSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Nos derniers projets", path: CASE_STUDY.href },
        ])}
      />
      <PageIntro
        title="Nos derniers projets"
        subtitle="Un aperçu de nos missions les plus récentes — chaque client a ses propres outils et son propre fonctionnement."
      />

      <ProjectCards />

      <div className="bg-background px-4 pb-4 sm:px-6 lg:px-8">
        <Note>
          Pour comprendre pourquoi ces projets se ressemblent tous sur un
          point : notre{" "}
          <Link
            href="/blog/automatisation-974-guide-complet-pme-reunion"
            className="underline underline-offset-2 hover:text-primary-dark"
          >
            guide complet de l&apos;automatisation pour les PME
            réunionnaises
          </Link>
          .
        </Note>
      </div>

      <ProjectsClosing />
    </main>
  );
}

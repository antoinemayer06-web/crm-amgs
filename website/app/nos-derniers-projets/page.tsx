import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ProjectCards from "@/components/ProjectCards";
import ProjectsClosing from "@/components/ProjectsClosing";
import { CASE_STUDY } from "@/lib/content";

// Anciennement /etude-de-cas — renommée pour refléter qu'elle présente
// plusieurs projets (redirection 301 mise en place dans next.config.mjs).

export const metadata: Metadata = {
  title: "Nos derniers projets — automatisation PME à La Réunion",
  description:
    "Quatre projets récents, anonymisés : suppression de la double saisie, plan de charge automatique, refonte de site connectée au CRM, chatbot de support IA. Résultats et méthode détaillés.",
  alternates: { canonical: CASE_STUDY.href },
};

export default function NosDerniersProjetsPage() {
  return (
    <main>
      <PageIntro
        title="Nos derniers projets"
        subtitle="Un aperçu de nos missions les plus récentes — chaque client a ses propres outils et son propre fonctionnement."
      />

      <ProjectCards />
      <ProjectsClosing />
    </main>
  );
}

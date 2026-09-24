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
    "Deux projets récents, anonymisés : suppression de la double saisie entre 5 outils pour un bureau d'études, et refonte de site connectée au CRM. Résultats et méthode détaillés.",
  alternates: { canonical: CASE_STUDY.href },
};

export default function NosDerniersProjetsPage() {
  return (
    <main>
      <PageIntro
        title="Nos derniers projets"
        subtitle="Deux projets récents à La Réunion (974), anonymisés. Cliquez sur une carte pour voir le contexte, la méthode et les résultats."
      />

      <ProjectCards />
      <ProjectsClosing />
    </main>
  );
}

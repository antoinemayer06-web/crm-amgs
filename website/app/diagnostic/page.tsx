import type { Metadata } from "next";
import DiagnosticQuiz from "@/components/DiagnosticQuiz";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diagnostic d'automatisation gratuit",
  description:
    "8 questions rapides pour évaluer le potentiel d'automatisation de votre PME à La Réunion (974), avec un résultat personnalisé immédiat.",
  path: "/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Diagnostic", path: "/diagnostic" },
        ])}
      />
      <PageIntro
        title="Votre situation"
        subtitle="8 questions. Des réponses honnêtes. Un retour rapide."
      />
      <DiagnosticQuiz />
    </main>
  );
}

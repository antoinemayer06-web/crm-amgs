import type { Metadata } from "next";
import DiagnosticQuiz from "@/components/DiagnosticQuiz";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Diagnostic gratuit — votre potentiel d'automatisation",
  description:
    "8 questions rapides pour évaluer le potentiel d'automatisation de votre PME à La Réunion (974), avec un résultat personnalisé immédiat.",
  alternates: { canonical: "/diagnostic" },
};

export default function DiagnosticPage() {
  return (
    <main>
      <PageIntro
        title="Votre situation"
        subtitle="8 questions. Des réponses honnêtes. Un retour rapide."
      />
      <DiagnosticQuiz />
    </main>
  );
}

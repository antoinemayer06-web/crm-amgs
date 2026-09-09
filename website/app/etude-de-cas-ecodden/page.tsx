import type { Metadata } from "next";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import PageIntro from "@/components/PageIntro";
import Proof from "@/components/Proof";
import { CASE_STUDY } from "@/lib/content";

// Page support des mots-clés "suppression double saisie" et
// "automatisation gestion de projet" — hub de preuve, lié depuis les deux
// pages piliers et l'accueil.

export const metadata: Metadata = {
  title: `Étude de cas ${CASE_STUDY.client} — suppression de la double saisie`,
  description:
    "Comment un bureau d'études à La Réunion a supprimé la double saisie entre 5 outils, avec des missions livrées en 4 jours à 1 semaine et demie. Chiffres et méthode détaillés.",
  alternates: { canonical: CASE_STUDY.href },
};

export default function EtudeDeCasPage() {
  return (
    <main>
      <PageIntro
        title={`Étude de cas ${CASE_STUDY.client} : la double saisie supprimée en quelques jours`}
        subtitle={`Un ${CASE_STUDY.sector} réunionnais, ${CASE_STUDY.toolsConnected} outils reconnectés, deux missions livrées bien plus vite que le délai annoncé.`}
      />

      <Proof />
      <CaseStudyDetail />
    </main>
  );
}

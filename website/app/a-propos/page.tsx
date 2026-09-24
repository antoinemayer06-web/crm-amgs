import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { personSchema } from "@/lib/schema";

// Mot-clé principal : "consultant automatisation La Réunion"

export const metadata: Metadata = {
  title: "À propos — Antoine Mayer, consultant automatisation à La Réunion",
  description:
    "AM Growth Solutions est dirigée par Antoine Mayer, consultant en automatisation basé à La Réunion (974). Une approche sur mesure, sans imposer de nouveaux outils.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <main>
      <JsonLd data={personSchema()} />
      <PageIntro
        title="On m'appelle pour un problème. On me garde pour un système."
        subtitle="La plupart des PME que j'accompagne ne cherchent pas un outil de plus. Elles cherchent à arrêter de perdre du temps sur ce qui devrait tourner tout seul."
      />
      <AboutContent />
    </main>
  );
}

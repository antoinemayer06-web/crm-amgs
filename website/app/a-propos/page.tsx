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
      <PageIntro title="Mettre les dernières technologies au service des PME." />
      <AboutContent />
    </main>
  );
}

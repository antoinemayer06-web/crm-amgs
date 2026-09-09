import type { Metadata } from "next";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import PillarsOverview from "@/components/PillarsOverview";
import Problem from "@/components/Problem";
import Proof from "@/components/Proof";

export const metadata: Metadata = {
  title: "Automatisation PME à La Réunion",
  description:
    "AM Growth Solutions automatise la gestion de projet et l'administratif des PME réunionnaises pour supprimer la double saisie. Résultats vérifiables, livrés en quelques jours.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Hero + bandeau outils — voir components/Hero.tsx */}

      <Problem />

      <PillarsOverview />

      <Proof />

      {/* Témoignages — retours clients (cabinets, bureaux d'études, agences) */}

      {/* FAQ — questions fréquentes des dirigeants de petites structures */}

      <FinalCta />
    </main>
  );
}

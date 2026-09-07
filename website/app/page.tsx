import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Proof from "@/components/Proof";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Hero + bandeau outils — voir components/Hero.tsx */}

      <Problem />

      <Services />

      <Proof />

      {/* Processus — les étapes de collaboration avec l'agence */}

      {/* Témoignages — retours clients (cabinets, bureaux d'études, agences) */}

      {/* FAQ — questions fréquentes des dirigeants de petites structures */}

      {/* Contact — formulaire ou prise de rendez-vous */}
    </main>
  );
}

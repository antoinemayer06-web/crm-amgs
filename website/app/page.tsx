import type { Metadata } from "next";
import Link from "next/link";
import FinalCta from "@/components/FinalCta";
import Founder from "@/components/Founder";
import Hero from "@/components/Hero";
import Note from "@/components/Note";
import QuizPromo from "@/components/QuizPromo";
import Solutions from "@/components/Solutions";
import Symptoms from "@/components/Symptoms";
import Testimonial from "@/components/Testimonial";

export const metadata: Metadata = {
  title: "Automatisation PME à La Réunion (974)",
  description:
    "AM Growth Solutions automatise la gestion de projet et l'administratif des PME réunionnaises (La Réunion, 974) pour supprimer la double saisie. Résultats vérifiables, livrés en quelques jours.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Hero + bandeau outils — voir components/Hero.tsx */}

      <Symptoms />

      <QuizPromo />

      <Solutions />

      <section className="bg-background px-4 pb-4 sm:px-6 lg:px-8">
        <Note>
          Ressource gratuite ! Notre{" "}
          <Link
            href="/blog/automatisation-974-guide-complet-pme-reunion"
            className="underline underline-offset-2 hover:text-primary-dark"
          >
            guide complet de l&apos;automatisation pour les PME réunionnaises
          </Link>{" "}
          détaille les grands types de solutions et la méthode pour démarrer.
        </Note>
      </section>

      <Testimonial />

      <Founder />

      <FinalCta />
    </main>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ExampleMockup from "@/components/ExampleMockup";
import ParallaxAccent from "@/components/ParallaxAccent";
import { fadeInUp } from "@/lib/animations";

// Exemples concrets de systèmes construits — présentés comme des EXEMPLES
// de ce qui est possible, pas comme une liste figée de "services" à cocher.
// Affichés en carrousel horizontal (scroll libre) plutôt qu'en grille figée,
// pour donner une sensation de catalogue qu'on feuillette. L'ordre
// correspond à l'index passé à <ExampleMockup> pour son mini-mockup.
const EXAMPLES = [
  {
    title: "Connexion d'outils entre eux",
    description:
      "CRM, gestion de projet, stockage... vos outils échangent l'information automatiquement, sans ressaisie.",
  },
  {
    title: "Sites ou formulaires reliés à une base de données",
    description:
      "Collecte et traitement automatique des informations dès qu'un formulaire est rempli.",
  },
  {
    title: "Dashboards de pilotage automatiques",
    description:
      "Tableaux de bord type Power BI, alimentés et mis à jour sans compilation manuelle.",
  },
  {
    title: "Automatisations Microsoft 365",
    description:
      "Excel avancé, Power Automate, Forms — vos fichiers et process Microsoft travaillent pour vous.",
  },
  {
    title: "Automatisation administrative & financière",
    description:
      "Devis, factures et relances générés et envoyés sans ressaisie.",
  },
  {
    title: "Suivi de charge d'équipe",
    description:
      "Plans de charge automatiques : qui est disponible, qui est débordé, en temps réel.",
  },
  {
    title: "Intégration de l'IA pour les entreprises",
    description:
      "Nous proposons l'intégration de solutions IA adaptées à vos besoins — extraction de documents, catégorisation automatique, et autres cas d'usage concrets.",
  },
];

export default function Solutions() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <ParallaxAccent className="right-[-10%] top-[-10%] h-80 w-80 bg-primary-dark/[0.06]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Notre remède
          </h2>
          <p className="mt-4 text-lg text-muted">
            Des process clairs et des systèmes sur mesure, pensés pour votre
            fonctionnement réel.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mt-14"
        >
          <div className="flex snap-x snap-proximity gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {EXAMPLES.map((example, index) => (
              <div
                key={example.title}
                className="w-72 shrink-0 snap-start sm:w-80"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="border-b border-border bg-primary/[0.03] py-5">
                    <ExampleMockup index={index} />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {example.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {example.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Fondu sur le bord droit — suggère qu'il reste du contenu à faire défiler */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-surface to-transparent sm:block" />
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/etude-de-cas"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark transition hover:gap-2.5"
          >
            Voir nos derniers projets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

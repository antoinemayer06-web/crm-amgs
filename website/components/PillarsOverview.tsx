"use client";

import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Globe,
  LayoutDashboard,
  Receipt,
  RefreshCw,
  Users,
} from "lucide-react";
import Note from "@/components/Note";
import ParallaxAccent from "@/components/ParallaxAccent";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Exemples concrets de systèmes construits — volontairement présentés comme
// des EXEMPLES de ce qui est possible, pas comme une liste figée de
// "services" à cocher. Le message central reste : nous construisons le
// système adapté au process, quelle que soit la brique technique nécessaire.
const EXAMPLES = [
  {
    icon: RefreshCw,
    title: "Connexion d'outils entre eux",
    description:
      "CRM, gestion de projet, stockage... vos outils échangent l'information automatiquement, sans ressaisie.",
  },
  {
    icon: Globe,
    title: "Sites ou formulaires reliés à une base de données",
    description:
      "Collecte et traitement automatique des informations dès qu'un formulaire est rempli.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards de pilotage automatiques",
    description:
      "Tableaux de bord type Power BI, alimentés et mis à jour sans compilation manuelle.",
  },
  {
    icon: FileSpreadsheet,
    title: "Automatisations Microsoft 365",
    description:
      "Excel avancé, Power Automate, Forms — vos fichiers et process Microsoft travaillent pour vous.",
  },
  {
    icon: Receipt,
    title: "Automatisation administrative & financière",
    description:
      "Devis, factures et relances générés et envoyés sans ressaisie.",
  },
  {
    icon: Users,
    title: "Suivi de charge d'équipe",
    description:
      "Plans de charge automatiques : qui est disponible, qui est débordé, en temps réel.",
  },
];

export default function PillarsOverview() {
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
            Le type de systèmes que nous construisons
          </h2>
          <p className="mt-4 text-lg text-muted">
            Quelques exemples de ce qui est possible — toujours au service du
            même objectif : éliminer les tâches répétitives de votre PME.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {EXAMPLES.map((example) => {
            const Icon = example.icon;
            return (
              <motion.div
                key={example.title}
                variants={fadeInUp}
                className="flex h-full flex-col rounded-2xl border border-border bg-background p-7"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                  {example.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {example.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <Note>
          Ce ne sont pas des prestations à cocher : nous construisons le
          système adapté à votre process, quelle que soit la brique
          technique nécessaire.
        </Note>
      </div>
    </section>
  );
}

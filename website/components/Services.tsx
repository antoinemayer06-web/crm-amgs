"use client";

import { motion } from "framer-motion";
import { FolderKanban, Gauge, Link2, Settings2 } from "lucide-react";
import { cardHover, fadeInUp, staggerContainer } from "@/lib/animations";

const SERVICES = [
  {
    icon: FolderKanban,
    title: "Automatisation de la gestion de projet",
    description:
      "Création automatique de dossiers, tâches et notifications dès qu'un nouveau projet démarre.",
  },
  {
    icon: Link2,
    title: "Fin de la double saisie",
    description:
      "Connexion de votre CRM, gestion de tâches, stockage cloud et messagerie pour que chaque info ne se saisisse qu'une fois.",
  },
  {
    icon: Gauge,
    title: "Plan de charge automatique",
    description:
      "Visibilité centralisée et en temps réel sur la charge de travail de toute l'équipe, sans tableur à mettre à jour à la main.",
  },
  {
    icon: Settings2,
    title: "Automatisations sur mesure",
    description:
      "Chaque structure fonctionne différemment. Je conçois le système autour de votre façon de travailler, pas l'inverse.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Un système sur mesure, pas un outil de plus
          </h2>
          <p className="mt-4 text-lg text-muted">
            Je ne vous fais pas changer d&apos;outils. Je les fais parler
            entre eux.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeInUp}
              whileHover={cardHover}
              className="group rounded-2xl border border-border bg-background p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-accent/10 group-hover:text-accent">
                <service.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

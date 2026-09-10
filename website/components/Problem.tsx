"use client";

import { motion } from "framer-motion";
import ParallaxAccent from "@/components/ParallaxAccent";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const PROBLEMS = [
  {
    title: "Le temps perdu sur des tâches répétitives",
    description:
      "Chaque semaine, les mêmes actions manuelles reviennent — recopier une info, relancer un client, mettre à jour un fichier. Ce temps ne crée aucune valeur, mais personne n'a le temps de s'arrêter pour le corriger.",
  },
  {
    title: "Le manque de visibilité sur l'activité réelle",
    description:
      "Impossible de savoir en un coup d'œil où en sont les dossiers, qui est surchargé, ce qui a été fait ou non — l'information existe, mais elle est éparpillée entre plusieurs outils, fichiers ou têtes.",
  },
  {
    title: "Des process qui reposent sur une seule personne",
    description:
      "Sans système fiable, tout tient à la mémoire ou à la disponibilité d'un collaborateur clé — et s'effondre dès qu'il est absent, débordé, ou qu'il part.",
  },
];

export default function Problem() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <ParallaxAccent className="left-[-8%] top-[10%] h-72 w-72 bg-primary/[0.06]" />
      <ParallaxAccent
        className="right-[-6%] bottom-[5%] h-64 w-64 bg-primary-light/[0.08]"
        range={60}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Le symptôme est toujours le même
          </h2>
          <p className="mt-4 text-lg text-muted">
            Trois signes qui reviennent dans presque toutes les PME, quelle
            que soit leur organisation ou leur secteur.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 sm:grid-cols-3"
        >
          {PROBLEMS.map((problem, index) => (
            <motion.div
              key={problem.title}
              variants={fadeInUp}
              className="rounded-2xl border border-border bg-surface p-7 shadow-sm"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary">
                0{index + 1}
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                {problem.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

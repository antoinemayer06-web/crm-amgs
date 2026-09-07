"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const PROBLEMS = [
  {
    title: "La ressaisie qui coûte du temps et des erreurs",
    description:
      "Chaque nouvelle info se recopie à la main dans le CRM, la gestion de projet, le stockage, la messagerie... Multipliez ça par le nombre de dossiers en cours, et l'erreur de saisie devient une question de temps.",
  },
  {
    title: "La surcharge, découverte trop tard",
    description:
      "Sans vue d'ensemble centralisée, personne ne sait vraiment qui est débordé et qui a de la marge — jusqu'au jour où un dossier prend du retard.",
  },
  {
    title: "Des process qui tiennent à un fil",
    description:
      "Sans système fiable, tout repose sur la mémoire ou la bonne volonté d'une seule personne — et disparaît le jour où elle est absente.",
  },
];

export default function Problem() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
            Dès qu&apos;une structure combine plusieurs outils, ces trois
            problèmes apparaissent — quel que soit le secteur.
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

"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const PRINCIPLES = [
  {
    number: "01",
    title: "On ne change jamais vos outils. On les connecte.",
    description:
      "Vous gardez vos habitudes, votre CRM, vos fichiers. Le système s'adapte à vous — pas l'inverse.",
  },
  {
    number: "02",
    title: "Un système livré doit tourner sans vous.",
    description:
      "Pas besoin d'y penser, pas besoin de le surveiller. S'il demande plus d'attention qu'avant, ce n'est pas fini.",
  },
  {
    number: "03",
    title: "La rapidité n'est pas un argument marketing. C'est une méthode.",
    description:
      "Cadrer vite, livrer vite, ajuster vite. Le délai n'est pas une promesse — c'est un résultat.",
  },
];

export default function Principles() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-4 sm:grid-cols-3"
    >
      {PRINCIPLES.map((principle) => (
        <motion.div
          key={principle.number}
          variants={fadeInUp}
          className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-heading text-sm font-bold text-white">
            {principle.number}
          </span>
          <h3 className="mt-4 font-heading text-base font-bold text-foreground">
            {principle.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {principle.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

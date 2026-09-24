"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Layers, Wrench } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Les 3 facteurs qui déterminent le coût d'une mission, présentés en
// cartes visuelles (même esprit que les cartes /services) plutôt qu'en
// simple liste — avec un léger effet de cascade à l'apparition.
const FACTORS = [
  {
    icon: Layers,
    title: "Le nombre d'outils à connecter",
    description:
      "Relier deux outils entre eux n'a pas la même portée qu'orchestrer un système à cinq outils.",
  },
  {
    icon: Wrench,
    title: "La complexité des règles métier",
    description:
      "Une synchronisation simple n'a rien à voir avec des automatisations en cascade, conditionnelles, propres à votre fonctionnement.",
  },
  {
    icon: ClipboardCheck,
    title: "Le suivi dans le temps",
    description:
      "Certaines missions s'arrêtent à la mise en service, d'autres incluent un ajustement régulier du système au fil de son usage réel.",
  },
];

export default function PricingFactors() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mt-8 grid gap-5 sm:grid-cols-3"
    >
      {FACTORS.map((factor) => {
        const Icon = factor.icon;
        return (
          <motion.div
            key={factor.title}
            variants={fadeInUp}
            className="rounded-2xl border border-border bg-background p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-heading text-base font-bold text-foreground">
              {factor.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {factor.description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

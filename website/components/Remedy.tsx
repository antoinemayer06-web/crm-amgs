"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// Section pivot volontairement courte et très aérée — juste après les
// symptômes, avant le détail des solutions. Ne doit pas se lire comme un
// bloc de contenu de plus, mais comme une respiration/bascule visuelle
// entre le problème (Symptômes) et la démonstration (Solutions).
export default function Remedy() {
  return (
    <section className="py-24 sm:py-36">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
          Notre remède
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Des process clairs et des systèmes sur mesure, pensés pour votre
          fonctionnement réel. Le résultat : du temps libéré pour vous
          concentrer sur votre vrai travail.
        </p>
      </motion.div>
    </section>
  );
}

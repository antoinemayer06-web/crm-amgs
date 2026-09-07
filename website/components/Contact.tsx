"use client";

import { motion } from "framer-motion";
import { LinkedInIcon } from "@/components/icons";
import { buttonHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { CALENDLY_URL, LINKEDIN_URL } from "@/lib/links";

// Options de titre — la première est utilisée ci-dessous.
// 1. "Prêt à arrêter la double saisie ?"
// 2. "Voyons ce qui peut être automatisé chez vous"

export default function Contact() {
  return (
    <section id="contact" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Prêt à arrêter la double saisie ?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Un appel de 20-30 minutes suffit pour identifier ce qui peut être
            automatisé chez vous.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
        >
          <motion.a
            variants={fadeInUp}
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            className="inline-block rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-ink/25 transition-colors hover:bg-primary-dark"
          >
            Prendre rendez-vous
          </motion.a>

          <motion.a
            variants={fadeInUp}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <LinkedInIcon className="h-4 w-4" />
            Ou échangeons sur LinkedIn
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

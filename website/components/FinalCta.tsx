"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonHover, fadeInUp } from "@/lib/animations";

export default function FinalCta() {
  return (
    <section className="bg-ink py-20 sm:py-24">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="font-heading text-3xl font-black text-white sm:text-4xl">
          Prêt à arrêter la double saisie ?
        </h2>
        <p className="mt-4 text-lg text-white/70">
          Un appel de 20-30 minutes suffit pour identifier ce qui peut être
          automatisé chez vous.
        </p>
        <motion.div whileHover={buttonHover} className="mt-8 inline-block">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-white px-8 py-3.5 text-base font-semibold text-ink shadow-lg shadow-black/20 transition-colors hover:bg-white/90"
          >
            Prendre rendez-vous
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

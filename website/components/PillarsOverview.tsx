"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ParallaxAccent from "@/components/ParallaxAccent";
import { cardHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { PILLARS } from "@/lib/content";

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
            Deux façons de supprimer la double saisie
          </h2>
          <p className="mt-4 text-lg text-muted">
            Chaque mission est sur mesure, mais elle s&apos;appuie toujours
            sur l&apos;un de ces deux piliers.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {PILLARS.map((pillar) => (
            <motion.div key={pillar.slug} variants={fadeInUp}>
              <Link href={pillar.href} className="group block h-full">
                <motion.div
                  whileHover={cardHover}
                  className="flex h-full flex-col rounded-2xl border border-border bg-background p-8"
                >
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {pillar.shortDescription}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    En savoir plus
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted"
        >
          Règle métier simple, connecteur entre deux outils, ou brique
          d&apos;IA ponctuelle (extraction de documents, catégorisation
          automatique) — la technique choisie s&apos;adapte à ce qui est
          réellement utile chez vous, jamais l&apos;inverse.
        </motion.p>
      </div>
    </section>
  );
}

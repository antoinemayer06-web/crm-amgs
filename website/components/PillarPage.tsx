"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import { buttonHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { CASE_STUDY } from "@/lib/content";

interface PillarPageProps {
  title: string;
  intro: string;
  questionHeading: string;
  questionAnswer: string[];
  bulletsHeading: string;
  bullets: string[];
  pricingLabel: string;
  pricingFrom: string;
}

export default function PillarPage({
  title,
  intro,
  questionHeading,
  questionAnswer,
  bulletsHeading,
  bullets,
  pricingLabel,
  pricingFrom,
}: PillarPageProps) {
  return (
    <main>
      <PageIntro title={title} subtitle={intro} />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
              {questionHeading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
              {questionAnswer.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-14"
          >
            <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
              {bulletsHeading}
            </h2>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-6 space-y-4"
            >
              {bullets.map((bullet) => (
                <motion.li
                  key={bullet}
                  variants={fadeInUp}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
                  <span className="text-base leading-relaxed text-foreground/80">
                    {bullet}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-14 rounded-2xl border border-border bg-background p-8"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
              Preuve concrète
            </span>
            <h2 className="mt-2 font-heading text-xl font-bold text-foreground">
              {CASE_STUDY.client}, {CASE_STUDY.sector} : la double saisie
              supprimée en quelques jours
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {CASE_STUDY.toolsConnected} outils connectés, une mission
              annoncée à {CASE_STUDY.missions[0].quotedDelay} livrée en{" "}
              {CASE_STUDY.missions[0].actualDelay}. Chiffres et détails dans
              l&apos;étude de cas complète.
            </p>
            <Link
              href={CASE_STUDY.href}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Voir l&apos;étude de cas EcoDDen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
                {pricingLabel}
              </p>
              <p className="mt-1 font-heading text-2xl font-black text-white">
                À partir de {pricingFrom}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Fourchette indicative — le devis dépend de votre
                fonctionnement réel.
              </p>
            </div>
            <motion.div whileHover={buttonHover}>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
              >
                Demander un devis personnalisé
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

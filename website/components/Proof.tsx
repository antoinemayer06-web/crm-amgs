"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Options de titre — la première est utilisée ci-dessous.
// 1. "La rapidité, prouvée par les chiffres"
// 2. "Les délais tenus, pas juste promis"

const AVANT = [
  "Ressaisie manuelle des mêmes infos dans 5 outils différents",
  "Aucune vue d'ensemble sur la charge de travail de l'équipe",
  "Suivi dispersé entre CRM, tâches, stockage, messagerie et suite collaborative",
];

const APRES = [
  "Les 5 outils connectés : chaque info saisie une seule fois",
  "Tableau de bord de charge de travail automatique, en temps réel",
  "Une seule source de vérité, partagée par toute l'équipe",
];

export default function Proof() {
  return (
    <section id="preuve" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            La rapidité, prouvée par les chiffres
          </h2>
          <p className="mt-4 text-lg text-muted">
            Pas de promesse vague de « gain de temps ». Voici ce qui a été
            livré, et en combien de temps.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 space-y-10"
        >
          {/* Bloc statistiques */}
          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-3"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-8 text-center"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-lg font-semibold text-muted line-through decoration-2">
                  3-4 semaines
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary-dark" />
                <span className="font-heading text-3xl font-black text-primary-dark">
                  1,5 semaine
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                Délai annoncé vs délai livré — mission 1
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-8 text-center"
            >
              <AnimatedCounter
                to={4}
                suffix=" jours"
                className="font-heading text-4xl font-black text-primary-dark"
              />
              <p className="mt-2 text-sm text-muted">
                Pour livrer l&apos;automatisation complète — mission 2
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-8 text-center"
            >
              <AnimatedCounter
                to={5}
                suffix=" outils"
                className="font-heading text-4xl font-black text-primary-dark"
              />
              <p className="mt-2 text-sm text-muted">
                Connectés en un seul système cohérent
              </p>
            </motion.div>
          </motion.div>

          {/* Mini case study */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-border bg-background p-8 sm:p-10"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
                Étude de cas
              </span>
              <span className="font-heading text-lg font-bold text-foreground">
                EcoDDen
              </span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted">
                  Le problème
                </h3>
                <p className="mt-2 text-base leading-relaxed text-foreground/80">
                  Un jonglage quotidien entre CRM, gestion de tâches, stockage
                  cloud, messagerie et suite collaborative — avec de la
                  ressaisie manuelle à chaque étape et aucune vue d&apos;ensemble
                  sur la charge de travail réelle de l&apos;équipe.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted">
                  Ce qui a été livré
                </h3>
                <p className="mt-2 text-base leading-relaxed text-foreground/80">
                  Les 5 outils connectés entre eux, la double saisie
                  supprimée intégralement, et un tableau de bord de charge de
                  travail généré automatiquement.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-10">
              <div>
                <h4 className="text-sm font-bold text-muted">Avant</h4>
                <ul className="mt-3 space-y-3">
                  {AVANT.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted/60" />
                      <span className="text-sm leading-relaxed text-foreground/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="hidden w-px origin-top self-stretch bg-border sm:block"
              />
              <div className="flex items-center justify-center sm:hidden">
                <ArrowRight className="h-5 w-5 rotate-90 text-primary" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-primary">Après</h4>
                <ul className="mt-3 space-y-3">
                  {APRES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                      <span className="text-sm leading-relaxed text-foreground/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

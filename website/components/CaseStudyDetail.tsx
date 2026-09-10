"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Database, RefreshCw } from "lucide-react";
import DashboardMockup from "@/components/DashboardMockup";
import FlowDiagram from "@/components/FlowDiagram";
import { buttonHover, fadeInUp } from "@/lib/animations";
import { CASE_STUDY, PILLARS } from "@/lib/content";

const FLOW_STEPS = [
  { icon: Database, label: "CRM", sublabel: "Données déjà saisies" },
  {
    icon: RefreshCw,
    label: "Connecteur automatique",
    sublabel: "Aucune intervention manuelle",
    emphasis: true,
  },
  { icon: ClipboardList, label: "Gestion de projet", sublabel: "Dossier créé" },
  {
    icon: CheckCircle2,
    label: "0 ressaisie",
    sublabel: "Résultat",
    emphasis: true,
  },
];

export default function CaseStudyDetail() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Le contexte : un bureau d&apos;études qui perdait un temps
            précieux en ressaisie
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Il s&apos;agit d&apos;un {CASE_STUDY.sector} à La Réunion.
            Comme beaucoup de PME de sa taille, l&apos;équipe utilisait déjà
            de bons outils — {CASE_STUDY.toolsConnected} au total : un CRM,
            un outil de gestion de tâches, un stockage cloud, une messagerie
            et une suite collaborative. Le problème n&apos;était pas le
            choix des outils, mais l&apos;absence de lien entre eux : {" "}
            {CASE_STUDY.problem}
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-12"
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            La méthode : connecter les 5 outils existants, pas en ajouter un
            sixième
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Aucun des outils en place n&apos;a été remplacé. Le travail a
            consisté à faire circuler l&apos;information automatiquement
            entre eux : ce qui était saisi une fois dans le CRM ou la
            gestion de tâches se retrouvait ensuite partout où c&apos;était
            nécessaire, sans intervention manuelle. C&apos;est la même
            approche que sur l&apos;ensemble des missions AM Growth
            Solutions — voir{" "}
            <Link
              href={PILLARS[0].href}
              className="font-semibold text-primary underline underline-offset-2"
            >
              l&apos;automatisation de la gestion de projet
            </Link>
            .
          </p>

          <div className="mt-8">
            <FlowDiagram steps={FLOW_STEPS} />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-12"
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Les résultats, mission par mission
          </h2>
          <div className="mt-6 space-y-4">
            {CASE_STUDY.missions.map((mission) => (
              <div
                key={mission.label}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="font-heading text-sm font-bold text-foreground">
                  {mission.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {mission.quotedDelay ? (
                    <>
                      Délai annoncé : {mission.quotedDelay}. Livrée en{" "}
                      <span className="font-semibold text-primary-dark">
                        {mission.actualDelay}
                      </span>
                      .
                    </>
                  ) : (
                    <>
                      {mission.note} livrée en{" "}
                      <span className="font-semibold text-primary-dark">
                        {mission.actualDelay}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-12"
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Ce qui a changé au quotidien pour l&apos;équipe
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {CASE_STUDY.result} Concrètement, plus personne ne recopie une
            information d&apos;un outil à l&apos;autre, et le dirigeant sait
            en un coup d&apos;œil qui, dans l&apos;équipe, a de la marge ou
            est déjà surchargé — sans avoir à demander un point d&apos;étape.
          </p>

          <div className="mt-8">
            <DashboardMockup />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="font-heading text-xl font-black text-white">
              Un fonctionnement similaire au vôtre ?
            </p>
            <p className="mt-1 text-sm text-white/60">
              Un appel de 20-30 minutes suffit pour identifier ce qui peut
              être automatisé chez vous.
            </p>
          </div>
          <motion.div whileHover={buttonHover}>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
            >
              Prendre rendez-vous
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

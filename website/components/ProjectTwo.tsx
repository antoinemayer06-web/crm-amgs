"use client";

import { motion } from "framer-motion";
import { Globe, LineChart, RefreshCw, Users } from "lucide-react";
import FlowDiagram from "@/components/FlowDiagram";
import { fadeInUp } from "@/lib/animations";

const FLOW_STEPS = [
  { icon: Globe, label: "Formulaire du site", sublabel: "Nouvelle demande" },
  {
    icon: RefreshCw,
    label: "Power Automate",
    sublabel: "Aucune intervention manuelle",
    emphasis: true,
  },
  { icon: Users, label: "CRM", sublabel: "Fiche créée" },
  {
    icon: LineChart,
    label: "Origine suivie",
    sublabel: "Par campagne",
    emphasis: true,
  },
];

// Deuxième projet réel présenté comme un type de prestation reproduit
// plusieurs fois (pas un client unique nommé) — même structure éditoriale
// que CaseStudyDetail (contexte / méthode / résultat) mais condensée sur
// un seul projet, sans tableau de missions chiffrées.
export default function ProjectTwo() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
            Projet 2
          </span>
          <h2 className="mt-2 font-heading text-2xl font-black text-foreground sm:text-3xl">
            Un site vitrine repensé, connecté au CRM
          </h2>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-10"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted">
            Le contexte
          </h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Un client avait un site avec une offre peu claire et un
            parcours de contact qui perdait des prospects en route.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-8"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted">
            Ce qui a été fait
          </h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Refonte du site avec une offre clarifiée et un tunnel de
            contact simplifié, puis connexion du formulaire du site au CRM
            via Power Automate — chaque nouvelle demande atterrit
            automatiquement dans le bon outil, sans ressaisie, avec un
            suivi précis de l&apos;origine de chaque contact (utile pour
            mesurer l&apos;efficacité des campagnes).
          </p>

          <div className="mt-6">
            <FlowDiagram steps={FLOW_STEPS} />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-8"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted">
            Le résultat
          </h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Double bénéfice pour le client — un site qui convertit mieux,
            et une automatisation qui élimine le travail manuel de suivi
            derrière. Cette approche (site + connexion CRM) a été
            reproduite pour plusieurs clients.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

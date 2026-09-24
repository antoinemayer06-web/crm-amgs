"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, Zap } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Project {
  sector: string;
  title: string;
  teaser: string;
  resultBadge: string;
  startingPoint: string;
  whatWasDone: string;
  result: string;
  extraNote?: string;
  benefit: {
    headline: string;
    detail?: string;
    footnote: string;
  };
}

const PROJECTS: Project[] = [
  {
    sector: "Bureau d'études",
    title: "La fin de la double saisie",
    teaser:
      "5 outils connectés, une équipe qui voit enfin sa charge de travail en un coup d'œil.",
    resultBadge: "Livré en 1 semaine et demie",
    startingPoint:
      "Cinq outils, aucun lien entre eux. Chaque nouveau projet signifiait recréer à la main les mêmes informations, plusieurs fois, dans plusieurs logiciels.",
    whatWasDone:
      "Connexion complète des outils existants — dès qu'un projet est validé, dossier, tâches et notifications se créent tout seuls, avec la bonne personne déjà assignée.",
    result:
      "Zéro ressaisie. L'équipe voit désormais sa charge de travail en temps réel, sans tableur à mettre à jour.",
    extraNote:
      "Une seconde mission a suivi peu après sur ce même client : automatisation complète d'un nouveau processus, livrée en 4 jours.",
    benefit: {
      headline:
        "~3 à 15h de saisie manuelle évitées par an sur la création de dossier",
      detail:
        "En complément : élimination des erreurs de rattachement de tâches, et une alerte automatique si un projet est sous-facturé par rapport aux heures réellement travaillées — un bénéfice plus difficile à chiffrer mais souvent plus significatif que le temps lui-même.",
      footnote:
        "*Estimation basée sur 1 à 5 nouveaux projets par mois et 10 à 15 minutes de saisie manuelle par création (avant automatisation), répétée dans plusieurs outils.",
    },
  },
  {
    sector: "Site vitrine",
    title: "Un site qui convertit, un CRM qui se remplit tout seul",
    teaser:
      "Offre clarifiée, tunnel de contact simplifié, zéro ressaisie derrière.",
    resultBadge: "Reproduit pour plusieurs clients",
    startingPoint:
      "Un site avec une offre peu claire et un parcours de contact qui perdait des prospects en route.",
    whatWasDone:
      "Refonte du site avec une offre clarifiée, puis connexion du formulaire de contact au CRM via Power Automate — chaque nouvelle demande atterrit automatiquement au bon endroit, avec un suivi précis de son origine.",
    result:
      "Un site qui convertit mieux, et un suivi commercial qui ne demande plus aucune saisie manuelle. Cette approche a été reproduite pour plusieurs clients.",
    benefit: {
      headline:
        "~30h de saisie manuelle évitées par an, soit environ 700 à 1 200€ de temps libéré",
      footnote:
        "*Estimation basée sur environ 30 prospects traités par mois et 5 minutes de saisie manuelle par prospect avant l'automatisation (temps de copie des informations du formulaire vers le CRM), valorisées à un taux horaire chargé de 25 à 40€.",
    },
  },
];

export default function ProjectCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {PROJECTS.map((project, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={project.title}
                layout
                variants={fadeInUp}
                transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
                className={`overflow-hidden rounded-2xl border bg-background shadow-sm transition-colors ${
                  isOpen
                    ? "border-primary/30 sm:col-span-2"
                    : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full flex-col items-start gap-3 p-6 text-left sm:p-7"
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
                      {project.sector}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-muted"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {project.teaser}
                  </p>

                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
                    <Zap className="h-4 w-4" />
                    {project.resultBadge}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-5 border-t border-border px-6 pb-7 pt-6 sm:px-7">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-muted">
                            Point de départ
                          </h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                            {project.startingPoint}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-muted">
                            Ce qui a été fait
                          </h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                            {project.whatWasDone}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-muted">
                            Résultat
                          </h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                            {project.result}
                          </p>
                        </div>

                        {project.extraNote && (
                          <div className="rounded-lg border-l-4 border-primary/30 bg-primary/5 p-3.5 text-sm leading-relaxed text-foreground/80">
                            {project.extraNote}
                          </div>
                        )}

                        <div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-5">
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-dark">
                              <Clock className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">
                                Bénéfice estimé
                              </p>
                              <p className="mt-1 text-sm font-semibold text-foreground">
                                {project.benefit.headline}
                              </p>
                            </div>
                          </div>
                          {project.benefit.detail && (
                            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                              {project.benefit.detail}
                            </p>
                          )}
                          <p className="mt-3 text-xs leading-relaxed text-muted">
                            {project.benefit.footnote}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

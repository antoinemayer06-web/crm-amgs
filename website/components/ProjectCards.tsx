"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Project {
  sector: string;
  title: string;
  teaser: string;
  resultBadge: string;
  startingPoint: string;
  whatWasDone: string;
  result: string;
}

const PROJECTS: Project[] = [
  {
    sector: "Bureau d'études",
    title: "La fin de la double saisie",
    teaser:
      "5 outils connectés, un projet qui se déploie tout seul dès sa création.",
    resultBadge: "Livré en 1 semaine et demie",
    startingPoint:
      "Chaque nouveau projet devait être recréé à la main dans plusieurs outils — dossier de stockage, tâches, notification d'équipe, suivi mail — la même information saisie plusieurs fois.",
    whatWasDone:
      "Connexion complète des outils existants autour du CRM utilisé comme référentiel unique. Dès qu'un projet est marqué prêt, son dossier de stockage, ses tâches, sa notification d'équipe et son suivi mail se créent automatiquement, avec les documents de suivi déjà en place.",
    result:
      "Le dirigeant garde ses habitudes de saisie dans son outil habituel — tout le reste se met en place sans aucune action supplémentaire.",
  },
  {
    sector: "Bureau d'études",
    title: "Un plan de charge qui se construit tout seul",
    teaser:
      "Fini le tableur mis à jour à la main — la charge de l'équipe visible en temps réel.",
    resultBadge: "Livré en 4 jours",
    startingPoint:
      "L'outil de suivi de tâches utilisé jusque-là était jugé trop complexe par l'équipe, et il n'existait aucune remontée fiable du temps réellement passé sur chaque dossier.",
    whatWasDone:
      "Le CRM reste la seule source de vérité pour les projets et les tâches. Chaque tâche assignée apparaît automatiquement dans l'agenda personnel du collaborateur concerné ; son organisation du temps remonte ensuite automatiquement dans un tableau de pilotage centralisé, avec une vue de charge par collaborateur, semaine par semaine.",
    result:
      "Une visibilité en temps réel sur qui est disponible et qui est débordé, et pour la première fois, un vrai suivi du temps passé par tâche — sans que personne n'ait à le saisir manuellement.",
  },
  {
    sector: "Agence marketing",
    title: "Un site qui convertit, un CRM qui se remplit tout seul",
    teaser:
      "Offre clarifiée, tunnel de contact simplifié, zéro ressaisie derrière.",
    resultBadge: "Livré en 5 jours",
    startingPoint:
      "Une agence spécialisée en IoT avait un site avec une offre peu claire et un parcours de contact qui perdait des prospects en route.",
    whatWasDone:
      "Refonte du site avec une offre clarifiée, puis connexion du formulaire de contact au CRM via Power Automate — chaque nouvelle demande atterrit automatiquement au bon endroit, avec un suivi précis de son origine.",
    result:
      "Un site qui convertit mieux, et un suivi commercial qui ne demande plus aucune saisie manuelle. Cette approche a été reproduite pour plusieurs clients.",
  },
  {
    sector: "Agence marketing",
    title: "Un chatbot qui répond, même en dehors des heures de bureau",
    teaser: "Support client automatisé, directement intégré au site.",
    resultBadge: "Livré en 2 jours",
    startingPoint:
      "L'équipe recevait un flux constant de questions répétitives (tarifs, délais, fonctionnement) qui monopolisait du temps de réponse manuel, y compris en dehors des heures d'ouverture.",
    whatWasDone:
      "Un agent conversationnel IA a été intégré directement au site, capable de répondre aux questions courantes et de qualifier les demandes avant transfert vers l'équipe quand une vraie expertise est nécessaire.",
    result:
      "Une présence disponible en continu qui filtre les demandes simples, pour que l'équipe se concentre sur les échanges qui en valent vraiment la peine.",
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

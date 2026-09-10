"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// Options de titre — la première est utilisée ci-dessous.
// 1. "Un processus simple, une exécution rapide"
// 2. "Simple à suivre, rapide à livrer"

const STEPS = [
  {
    title: "Appel de cadrage",
    description:
      "Un échange de 20-30 min pour comprendre vos outils actuels, vos points de friction et ce qui vous fait perdre du temps au quotidien.",
  },
  {
    title: "Diagnostic & devis",
    description:
      "Analyse de votre fonctionnement réel et proposition d'un système sur mesure, avec un délai de livraison annoncé clairement (pas de forfait générique).",
  },
  {
    title: "Build & tests",
    description:
      "Développement de l'automatisation, testée avec vos vrais outils et vos vrais cas d'usage avant mise en service.",
  },
  {
    title: "Mise en service & suivi",
    description:
      "Le système est activé, votre équipe est formée dessus, et nous restons disponibles pour ajuster si votre fonctionnement évolue.",
  },
];

// Fenêtre de scroll (dans la progression 0-1 de la section) à laquelle
// chaque étape est considérée comme "atteinte" par la ligne. Compressées
// dans les 90% premiers de la progression (avec la marge du useScroll
// ci-dessous) pour que les 4 étapes soient bien révélées une fois la
// section normalement visible à l'écran, sans avoir à scroller bien
// au-delà de ce qu'un visiteur ferait naturellement.
const REVEAL_RANGES: [number, number][] = [
  [0, 0.12],
  [0.25, 0.4],
  [0.5, 0.65],
  [0.75, 0.9],
];

function useStepReveal(
  scrollYProgress: MotionValue<number>,
  range: [number, number]
) {
  return useTransform(scrollYProgress, range, [0, 1], { clamp: true });
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // La progression atteint 1 quand le bas de la section arrive à
    // mi-écran, pas quand elle a presque entièrement défilé — sinon les
    // dernières étapes ne se révèlent qu'après avoir scrollé bien plus
    // bas que ce qui semble nécessaire visuellement.
    offset: ["start 0.9", "end 0.5"],
  });

  const dashOffset = useTransform(scrollYProgress, [0, 1], [100, 0]);

  // Un hook par étape (nombre fixe, appelés inconditionnellement).
  const r0 = useStepReveal(scrollYProgress, REVEAL_RANGES[0]);
  const r1 = useStepReveal(scrollYProgress, REVEAL_RANGES[1]);
  const r2 = useStepReveal(scrollYProgress, REVEAL_RANGES[2]);
  const r3 = useStepReveal(scrollYProgress, REVEAL_RANGES[3]);
  const reveals = [r0, r1, r2, r3];

  return (
    <section
      id="processus"
      ref={sectionRef}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Un processus simple, une exécution rapide
          </h2>
          <p className="mt-4 text-lg text-muted">
            Chaque automatisation est sur mesure, donc la durée varie — mais
            certaines sont livrées en quelques jours.
          </p>
        </motion.div>

        {/* Timeline desktop — horizontale */}
        <div className="relative mt-16 hidden sm:block">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-11">
            <svg
              viewBox="0 0 100 44"
              preserveAspectRatio="none"
              className="h-11 w-full"
              aria-hidden="true"
            >
              <path
                d="M12.5 22 L87.5 22"
                strokeWidth={2}
                fill="none"
                className="stroke-border"
              />
              <motion.path
                d="M12.5 22 L87.5 22"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
                pathLength={100}
                strokeDasharray={100}
                style={{ strokeDashoffset: dashOffset }}
                className="stroke-primary"
              />
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {STEPS.map((step, index) => (
              <StepColumn
                key={step.title}
                index={index}
                title={step.title}
                description={step.description}
                reveal={reveals[index]}
              />
            ))}
          </div>
        </div>

        {/* Timeline mobile — verticale */}
        <div className="mt-14 flex flex-col sm:hidden">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <StepMarker index={index} reveal={reveals[index]} />
                {index < STEPS.length - 1 && (
                  <div className="relative mt-1 w-px flex-1 bg-border">
                    <motion.div
                      style={{ scaleY: reveals[index + 1] }}
                      className="absolute inset-x-0 top-0 h-full w-px origin-top bg-primary"
                    />
                  </div>
                )}
              </div>
              <motion.div
                style={{ opacity: reveals[index] }}
                className="flex-1 pb-10"
              >
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepMarker({
  index,
  reveal,
}: {
  index: number;
  reveal: MotionValue<number>;
}) {
  const backgroundColor = useTransform(reveal, [0, 1], ["#b9bec9", "#2b2064"]);
  const color = useTransform(reveal, [0, 1], ["#22262b", "#ffffff"]);

  return (
    <motion.div
      style={{ backgroundColor, color }}
      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ring-4 ring-background"
    >
      {index + 1}
    </motion.div>
  );
}

function StepColumn({
  index,
  title,
  description,
  reveal,
}: {
  index: number;
  title: string;
  description: string;
  reveal: MotionValue<number>;
}) {
  const cardY = useTransform(reveal, [0, 1], [16, 0]);

  return (
    <div className="flex flex-col items-center">
      <StepMarker index={index} reveal={reveal} />
      <motion.div
        style={{ opacity: reveal, y: cardY }}
        className="mt-6 w-full rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
      >
        <h3 className="font-heading text-base font-bold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>
      </motion.div>
    </div>
  );
}

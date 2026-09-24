"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FileSearch, MessageCircle, Rocket, Settings2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const STEPS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Appel de cadrage",
    description:
      "Un échange de 20-30 min pour comprendre vos outils actuels, vos points de friction et ce qui vous fait perdre du temps au quotidien.",
    icon: MessageCircle,
  },
  {
    title: "Diagnostic & devis",
    description:
      "Analyse de votre fonctionnement réel et proposition d'un système sur mesure, avec un délai de livraison annoncé clairement.",
    icon: FileSearch,
  },
  {
    title: "Build & tests",
    description:
      "Développement de l'automatisation, testée avec vos vrais outils et vos vrais cas d'usage avant mise en service.",
    icon: Settings2,
  },
  {
    title: "Mise en service & suivi",
    description:
      "Le système est activé, votre équipe est formée dessus, et nous restons disponibles pour ajuster si votre fonctionnement évolue.",
    icon: Rocket,
  },
];

// Positions exactes des 4 marqueurs le long du tracé SVG, en fraction de
// 0 à 1 : le tracé va pile du marqueur 0 au marqueur 3 (voir le path
// "M12.5 22 L87.5 22" plus bas), donc la progression du trait dessiné
// (dashOffset) correspond linéairement à ces mêmes fractions. Aligner les
// fenêtres d'activation des marqueurs dessus garantit qu'un marqueur passe
// à l'état "actif" exactement quand le trait le traverse visuellement —
// ni avant, ni après. ACTIVATION_WIDTH resserré pour une transition nette
// et rapide plutôt qu'un dégradé qui traînerait en longueur.
const STEP_POSITIONS = [0, 1 / 3, 2 / 3, 1];
const ACTIVATION_WIDTH = 0.035;
const REVEAL_RANGES: [number, number][] = STEP_POSITIONS.map((p) => [
  Math.max(0, p - ACTIVATION_WIDTH),
  Math.min(1, p + ACTIVATION_WIDTH),
]);

function useStepReveal(
  scrollYProgress: MotionValue<number>,
  range: [number, number]
) {
  return useTransform(scrollYProgress, range, [0, 1], { clamp: true });
}

export default function Process() {
  // La progression du trait est liée 1:1 à la position de scroll réelle
  // (MotionValue de Framer Motion dérivée du scroll à chaque frame, pas
  // une animation à durée fixe jouée indépendamment) — et calée sur le
  // bloc du fil lui-même, pas sur toute la section (titre + cartes
  // comprises), pour que la distance de scroll parcourue corresponde à ce
  // que l'œil voit réellement bouger. C'est ce qui rend le fil réactif :
  // un scroll rapide fait avancer le trait tout aussi vite, sans lag.
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.85", "end 0.55"],
  });

  const dashOffset = useTransform(scrollYProgress, [0, 1], [100, 0]);

  // Un hook par étape (nombre fixe, appelés inconditionnellement).
  const r0 = useStepReveal(scrollYProgress, REVEAL_RANGES[0]);
  const r1 = useStepReveal(scrollYProgress, REVEAL_RANGES[1]);
  const r2 = useStepReveal(scrollYProgress, REVEAL_RANGES[2]);
  const r3 = useStepReveal(scrollYProgress, REVEAL_RANGES[3]);
  const reveals = [r0, r1, r2, r3];

  return (
    <section id="processus" className="py-20 sm:py-28">
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

        <div ref={timelineRef} className="mt-16">
          {/* Timeline desktop — horizontale */}
          <div className="relative hidden sm:block">
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
                  icon={step.icon}
                  reveal={reveals[index]}
                />
              ))}
            </div>
          </div>

          {/* Timeline mobile — verticale */}
          <div className="flex flex-col sm:hidden">
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
                <StepCard
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  className="flex-1 pb-10 text-left"
                />
              </div>
            ))}
          </div>
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
  const scale = useTransform(reveal, [0, 1], [1, 1.08]);
  const boxShadow = useTransform(
    reveal,
    [0, 1],
    ["0 0 0 rgba(94, 58, 161, 0)", "0 0 0 6px rgba(94, 58, 161, 0.15)"]
  );

  return (
    <motion.div
      style={{ backgroundColor, color, scale, boxShadow }}
      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ring-4 ring-background"
    >
      {index + 1}
    </motion.div>
  );
}

// Contenu texte d'une étape (icône + titre + description) — animé en
// fade-in + léger glissement latéral au moment où l'élément entre dans le
// viewport (whileInView, indépendant par carte), pas toutes les cartes en
// même temps au chargement de la page.
const slideInCard = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function StepCard({
  title,
  description,
  icon: Icon,
  centered = false,
  className = "",
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  centered?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={slideInCard}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={`flex flex-col gap-1 ${
        centered ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </motion.div>
  );
}

function StepColumn({
  index,
  title,
  description,
  icon,
  reveal,
}: {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
  reveal: MotionValue<number>;
}) {
  return (
    <div className="flex h-full flex-col items-center">
      <StepMarker index={index} reveal={reveal} />
      <div className="mt-6 w-full flex-1 overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg">
        <StepCard
          title={title}
          description={description}
          icon={icon}
          centered
          className="h-full justify-center"
        />
      </div>
    </div>
  );
}

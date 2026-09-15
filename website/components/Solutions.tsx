"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { motion, type PanInfo } from "framer-motion";
import Highlight from "@/components/Highlight";
import ParallaxAccent from "@/components/ParallaxAccent";
import { fadeInUp } from "@/lib/animations";

// Halo néon vert animé (pulsation douce) derrière le texte sous "Notre
// remède" — remplace l'ancienne animation "machine à écrire".
const NEON_GLOW = {
  animate: {
    textShadow: [
      "0 0 6px rgba(34,197,94,0.35), 0 0 16px rgba(34,197,94,0.22), 0 0 32px rgba(34,197,94,0.12)",
      "0 0 12px rgba(34,197,94,0.6), 0 0 28px rgba(34,197,94,0.4), 0 0 52px rgba(34,197,94,0.22)",
      "0 0 6px rgba(34,197,94,0.35), 0 0 16px rgba(34,197,94,0.22), 0 0 32px rgba(34,197,94,0.12)",
    ],
  },
  transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
};

// Exemples concrets de systèmes construits — présentés comme des EXEMPLES
// de ce qui est possible, pas comme une liste figée de "services" à cocher.
// Pile de cartes empilées (façon Tinder/Wallet) qu'on swipe pour parcourir,
// chaque carte prenant presque toute la largeur du conteneur plutôt qu'un
// tiers en grille.
// PLACEHOLDER IMAGE : en attendant les visuels définitifs (fournis
// séparément, un par un), un repère neutre (icône + libellé du slot)
// indique l'emplacement à remplir.
const EXAMPLES = [
  {
    slot: "solution-1-connexion-outils",
    image: "/images/solutions/solution-1-connexion-outils.jpg" as string | undefined,
    title: "Connexion d'outils entre eux",
    description:
      "CRM, gestion de projet, stockage... vos outils échangent l'information automatiquement, sans ressaisie.",
  },
  {
    slot: "solution-2-site-formulaire",
    image: "/images/solutions/solution-2-site-formulaire.jpg" as string | undefined,
    title: "Sites ou formulaires reliés à une base de données",
    description:
      "Collecte et traitement automatique des informations dès qu'un formulaire est rempli.",
  },
  {
    slot: "solution-3-dashboards",
    image: undefined as string | undefined,
    title: "Dashboards de pilotage automatiques",
    description:
      "Tableaux de bord type Power BI, alimentés et mis à jour sans compilation manuelle.",
  },
  {
    slot: "solution-4-microsoft-365",
    image: undefined as string | undefined,
    title: "Automatisations Microsoft 365",
    description:
      "Excel avancé, Power Automate, Forms — vos fichiers et process Microsoft travaillent pour vous.",
  },
  {
    slot: "solution-5-administratif-financier",
    image: undefined as string | undefined,
    title: "Automatisation administrative & financière",
    description:
      "Devis, factures et relances générés et envoyés sans ressaisie.",
  },
  {
    slot: "solution-6-charge-equipe",
    image: undefined as string | undefined,
    title: "Suivi de charge d'équipe",
    description:
      "Plans de charge automatiques : qui est disponible, qui est débordé, en temps réel.",
  },
  {
    slot: "solution-7-ia",
    image: undefined as string | undefined,
    title: "Intégration de l'IA pour les entreprises",
    description:
      "Nous proposons l'intégration de solutions IA adaptées à vos besoins — extraction de documents, catégorisation automatique, et autres cas d'usage concrets.",
  },
];

const COUNT = EXAMPLES.length;
const STACK_DEPTH = 3;
const SWIPE_OFFSET_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 500;
const AUTO_ADVANCE_DELAY = 4000;
const CARD_SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

export default function Solutions() {
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Défilement automatique — se met en pause pendant un swipe ou un survol
  // (desktop), et se relance à chaque changement de carte (auto ou manuel).
  useEffect(() => {
    if (isDragging || isHovering) return;
    const timer = setTimeout(() => {
      setActive((i) => (i + 1) % COUNT);
    }, AUTO_ADVANCE_DELAY);
    return () => clearTimeout(timer);
  }, [active, isDragging, isHovering]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    if (
      info.offset.x < -SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      setActive((i) => (i + 1) % COUNT);
    } else if (
      info.offset.x > SWIPE_OFFSET_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      setActive((i) => (i - 1 + COUNT) % COUNT);
    }
  };

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
            <Highlight color="34, 197, 94">Notre remède</Highlight>
          </h2>
          <motion.p
            animate={NEON_GLOW.animate}
            transition={NEON_GLOW.transition}
            className="mt-5 font-heading text-2xl font-bold leading-snug text-foreground sm:text-3xl"
          >
            Des process clairs et des systèmes sur mesure, pensés pour votre
            fonctionnement réel.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mx-auto mt-14 h-[420px] max-w-2xl sm:h-[440px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {EXAMPLES.map((example, index) => {
            // Position de la carte par rapport à la carte active : 0 =
            // devant (visible, swipable), 1/2 = empilées derrière,
            // décalées vers le bas et légèrement réduites ; au-delà de
            // STACK_DEPTH, la carte reste hors-champ (opacité 0).
            const offset = (index - active + COUNT) % COUNT;
            const isTop = offset === 0;
            const inStack = offset < STACK_DEPTH;

            return (
              <motion.div
                key={example.slot}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragStart={isTop ? () => setIsDragging(true) : undefined}
                onDragEnd={isTop ? handleDragEnd : undefined}
                animate={{
                  y: inStack ? offset * 16 : 16 * STACK_DEPTH,
                  scale: inStack ? 1 - offset * 0.05 : 1 - STACK_DEPTH * 0.05,
                  opacity: inStack ? 1 : 0,
                }}
                transition={CARD_SPRING}
                style={{ zIndex: COUNT - offset }}
                className={`absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-lg ${
                  isTop
                    ? "cursor-grab touch-pan-y active:cursor-grabbing"
                    : "pointer-events-none"
                }`}
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary-dark/5 sm:h-56">
                  {example.image ? (
                    <Image
                      src={example.image}
                      alt={example.title}
                      fill
                      draggable={false}
                      className="object-cover"
                    />
                  ) : (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary-dark/35">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {example.slot}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {example.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {example.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          {EXAMPLES.map((example, index) => (
            <button
              key={example.slot}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Voir l'exemple ${index + 1}`}
              aria-current={index === active}
              className={`h-2 rounded-full transition-all ${
                index === active
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/etude-de-cas"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark transition hover:gap-2.5"
          >
            Voir nos derniers projets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

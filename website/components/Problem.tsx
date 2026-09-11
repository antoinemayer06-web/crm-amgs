"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxAccent from "@/components/ParallaxAccent";
import SymptomIllustration from "@/components/SymptomIllustration";
import { fadeInUp } from "@/lib/animations";

const PROBLEMS = [
  {
    title: "Le temps perdu sur des tâches répétitives",
    description:
      "Chaque semaine, les mêmes actions manuelles reviennent — recopier une info, relancer un client, mettre à jour un fichier. Ce temps ne crée aucune valeur, mais personne n'a le temps de s'arrêter pour le corriger.",
  },
  {
    title: "Le manque de visibilité sur l'activité réelle",
    description:
      "Impossible de savoir en un coup d'œil où en sont les dossiers, qui est surchargé, ce qui a été fait ou non — l'information existe, mais elle est éparpillée entre plusieurs outils, fichiers ou têtes.",
  },
  {
    title: "Des process qui reposent sur une seule personne",
    description:
      "Sans système fiable, tout tient à la mémoire ou à la disponibilité d'un collaborateur clé — et s'effondre dès qu'il est absent, débordé, ou qu'il part.",
  },
];

export default function Problem() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Suit quelle carte est actuellement au centre du viewport de défilement,
  // pour synchroniser les points de pagination avec un swipe tactile.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      setActive(index);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(PROBLEMS.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <ParallaxAccent className="left-[-8%] top-[10%] h-72 w-72 bg-primary/[0.06]" />
      <ParallaxAccent
        className="right-[-6%] bottom-[5%] h-64 w-64 bg-primary-light/[0.08]"
        range={60}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Le symptôme est toujours le même
          </h2>
          <p className="mt-4 text-lg text-muted">
            Trois signes qui reviennent dans presque toutes les PME, quelle
            que soit leur organisation ou leur secteur.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-14"
        >
          {/* Flèches — desktop uniquement, le swipe tactile suffit sur mobile */}
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Symptôme précédent"
            className="absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface p-2.5 text-foreground shadow-sm transition-opacity hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === PROBLEMS.length - 1}
            aria-label="Symptôme suivant"
            className="absolute right-0 top-1/2 z-10 hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface p-2.5 text-foreground shadow-sm transition-opacity hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PROBLEMS.map((problem, index) => (
              <div
                key={problem.title}
                className="w-full shrink-0 snap-center px-2 sm:px-10"
              >
                <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:p-10">
                  <SymptomIllustration index={index} size={140} />
                  <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
                    {problem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Points de pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {PROBLEMS.map((problem, index) => (
              <button
                key={problem.title}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Voir le symptôme ${index + 1}`}
                aria-current={index === active}
                className={`h-2 rounded-full transition-all ${
                  index === active
                    ? "w-6 bg-primary"
                    : "w-2 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { STEPS } from "@/components/Process";

// Bande compacte juste sous le H1, visible sans scroll : les 4 étapes en
// un coup d'œil (icône + numéro + titre court, sans description) avant le
// détail animé au scroll plus bas. Apparition en cascade au chargement de
// la page (initial/animate, pas whileInView — la bande est déjà visible à
// l'écran dès l'arrivée sur la page).
const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ProcessOverview() {
  return (
    <div className="border-y border-border bg-surface py-5 sm:py-6">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-3 px-4 sm:px-6 lg:px-8"
      >
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              variants={item}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2.5 rounded-full border border-border bg-background px-3.5 py-2 sm:px-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-foreground/80 sm:text-sm">
                  {index + 1}. {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-border"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

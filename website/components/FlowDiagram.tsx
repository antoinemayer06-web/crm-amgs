"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Schéma visuel générique "outil A → connecteur → outil B → résultat",
// pour remplacer une explication purement textuelle par quelque chose de
// scannable en une seconde. Icônes lucide-react uniquement (pas de logos
// d'outils réels) pour rester générique et sans risque de marque déposée.

export interface FlowStep {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  emphasis?: boolean;
}

export default function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3"
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <Fragment key={step.label}>
            <motion.div
              variants={fadeInUp}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border p-5 text-center ${
                step.emphasis
                  ? "border-primary/30 bg-primary/[0.06]"
                  : "border-border bg-surface"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step.emphasis
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary-dark"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-heading text-sm font-bold text-foreground">
                {step.label}
              </span>
              {step.sublabel && (
                <span className="text-xs text-muted">{step.sublabel}</span>
              )}
            </motion.div>

            {index < steps.length - 1 && (
              <motion.div
                variants={fadeInUp}
                className="flex justify-center text-primary/40"
              >
                <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
              </motion.div>
            )}
          </Fragment>
        );
      })}
    </motion.div>
  );
}

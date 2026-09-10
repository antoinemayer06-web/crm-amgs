"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

// Aperçu stylisé d'un tableau de bord de charge d'équipe — recréé
// génériquement (pas une vraie capture d'écran) pour illustrer visuellement
// ce que "plan de charge automatique" veut dire, plutôt qu'une simple
// description textuelle.

const ROWS = [
  { name: "Chargé d'affaires", load: 85 },
  { name: "Chef de projet", load: 60 },
  { name: "Ingénieur études", load: 40 },
  { name: "Assistante administrative", load: 30 },
];

function loadColor(load: number) {
  if (load >= 80) return "bg-primary-dark";
  if (load >= 55) return "bg-primary";
  return "bg-primary-light";
}

export default function DashboardMockup() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-dark" />
          <span className="font-heading text-sm font-bold text-foreground">
            Plan de charge — équipe
          </span>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
          Généré automatiquement
        </span>
      </div>

      <div className="space-y-5 p-6">
        {ROWS.map((row, index) => (
          <div key={row.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground/80">
                {row.name}
              </span>
              <span className="text-xs font-semibold text-muted">
                {row.load}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border/60">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${row.load}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className={`h-full rounded-full ${loadColor(row.load)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

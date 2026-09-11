"use client";

import { motion } from "framer-motion";

// Frise visuelle comparant le délai annoncé (grisé, barré) au délai
// réellement livré (mis en évidence, barre qui se remplit au scroll) —
// remplace un simple compteur par une lecture immédiate de l'écart.

const MAX_WEEKS = 4;
const QUOTED_WEEKS = 3.5;
const ACTUAL_WEEKS = 1.5;
const MARKS = [0, 1, 2, 3, 4];

export default function DelayTimeline() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-5">
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Délai annoncé
          </span>
          <span className="text-xs font-semibold text-muted line-through decoration-2">
            3-4 semaines
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className="h-full rounded-full border-2 border-dashed border-muted/40 bg-muted/15"
            style={{ width: `${(QUOTED_WEEKS / MAX_WEEKS) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-dark">
            Délai livré
          </span>
          <span className="font-heading text-sm font-black text-primary-dark">
            1,5 semaine
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-border/60">
          <motion.div
            className="h-full rounded-full bg-primary-dark"
            initial={{ width: 0 }}
            whileInView={{ width: `${(ACTUAL_WEEKS / MAX_WEEKS) * 100}%` }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-medium text-muted/70">
        {MARKS.map((week) => (
          <span key={week}>S{week}</span>
        ))}
      </div>
    </div>
  );
}

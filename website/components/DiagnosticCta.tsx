"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

// Anciennement le bloc "lead magnet" (checklist contre email) — reconverti
// en simple déclencheur vers /diagnostic, qui capte le lead lui-même à la
// fin du quiz. Pulsation ambiante (~5s de cycle) pour attirer l'œil sans
// être agaçant ; elle s'arrête dès le premier survol pour ne pas insister
// indéfiniment.
export default function DiagnosticCta({ className = "" }: { className?: string }) {
  const [interacted, setInteracted] = useState(false);

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 text-center sm:flex-row sm:justify-between sm:text-left ${className}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
          Ressource gratuite
        </p>
        <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
          Découvrez votre potentiel d&apos;automatisation
        </h3>
      </div>

      <motion.div
        className="shrink-0"
        onHoverStart={() => setInteracted(true)}
        animate={interacted ? { scale: 1 } : { scale: [1, 1.05, 1] }}
        transition={
          interacted
            ? { duration: 0.2 }
            : {
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 4.4,
                ease: "easeInOut",
              }
        }
      >
        <Link
          href="/diagnostic"
          onClick={() => setInteracted(true)}
          className="flex items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Gift className="h-4 w-4" />
          Faire le diagnostic
        </Link>
      </motion.div>
    </div>
  );
}

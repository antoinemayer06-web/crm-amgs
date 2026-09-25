"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

// Encart "note" pour une remarque secondaire qui mérite d'être lue, sans
// pour autant rivaliser avec le contenu principal — alternative à une
// simple phrase en petit texte gris, peu visible et peu soignée.
export default function Note({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl border-l-4 border-primary bg-primary/5 p-5 text-left"
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-dark">
        <Lightbulb className="h-4 w-4" />
      </span>
      <p className="text-sm leading-relaxed text-foreground/80">{children}</p>
    </motion.div>
  );
}

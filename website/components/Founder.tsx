"use client";

import { ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// Section "fondateur" compacte, juste avant le CTA final — donne un visage
// humain au site. PHOTO PLACEHOLDER : cadre neutre en attendant la vraie
// photo d'Antoine (à intégrer ensuite en `object-cover` dans ce même cadre,
// sans changer la mise en page).
export default function Founder() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 sm:text-left"
        >
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-muted/40 sm:h-32 sm:w-32">
            <ImageIcon className="h-9 w-9" />
          </div>
          <div>
            <p className="font-heading text-xl font-bold text-foreground">
              Antoine Mayer
            </p>
            <p className="mt-2 text-lg leading-relaxed text-muted">
              Ma mission : vous permettre de vous concentrer sur votre cœur
              de métier, en automatisant tout le reste.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

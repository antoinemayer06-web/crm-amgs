"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ParallaxAccent from "@/components/ParallaxAccent";
import { fadeInUp } from "@/lib/animations";

// Section "fondateur" compacte, juste avant le CTA final — donne un visage
// humain au site. Encadrée comme une carte (même esprit que la carte
// témoignage juste au-dessus) plutôt que posée à plat sur le fond.
export default function Founder() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <ParallaxAccent className="left-[-8%] top-[-10%] h-72 w-72 bg-primary/[0.06]" />
      <ParallaxAccent
        className="right-[-6%] bottom-[-10%] h-64 w-64 bg-primary-light/[0.08]"
        range={50}
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:flex-row sm:gap-8 sm:p-10 sm:text-left"
        >
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-md ring-1 ring-border sm:h-36 sm:w-36">
            <Image
              src="/brand/founder-antoine.jpg"
              alt="Antoine Mayer, fondateur d'AM Growth Solutions"
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-heading text-xl font-bold text-foreground">
              Antoine Mayer
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-primary-dark">
              Fondateur — AM Growth Solutions
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Ma mission : vous permettre de vous concentrer sur votre cœur
              de métier, en automatisant tout le reste.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

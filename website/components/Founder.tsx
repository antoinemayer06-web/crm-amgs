"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkedInIcon } from "@/components/icons";
import ParallaxAccent from "@/components/ParallaxAccent";
import { cardHover, fadeInUp } from "@/lib/animations";
import { LINKEDIN_URL } from "@/lib/links";

// Section "fondateur" compacte, juste avant le CTA final — donne un visage
// humain au site. Encadrée comme une carte (même esprit que la carte
// témoignage juste au-dessus) et cliquable dans son ensemble vers le
// profil LinkedIn d'Antoine (badge LinkedIn en coin pour que l'affordance
// soit claire, pas juste un lien caché).
export default function Founder() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <ParallaxAccent className="left-[-8%] top-[-10%] h-72 w-72 bg-primary/[0.06]" />
      <ParallaxAccent
        className="right-[-6%] bottom-[-10%] h-64 w-64 bg-primary-light/[0.08]"
        range={50}
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Antoine Mayer sur LinkedIn"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          whileHover={cardHover}
          viewport={{ once: true, amount: 0.5 }}
          className="relative flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:flex-row sm:gap-8 sm:p-10 sm:text-left"
        >
          <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-sm sm:right-6 sm:top-6">
            <LinkedInIcon className="h-4 w-4" />
          </span>

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
        </motion.a>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// Section "fondateur" compacte, juste avant le CTA final — donne un visage
// humain au site.
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
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-background sm:h-32 sm:w-32">
            <Image
              src="/brand/founder-antoine.jpg"
              alt="Antoine Mayer, fondateur d'AM Growth Solutions"
              fill
              sizes="128px"
              className="object-cover"
            />
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

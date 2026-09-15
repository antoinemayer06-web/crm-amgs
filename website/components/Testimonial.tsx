"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

// BROUILLON — texte fourni par le client, à faire valider mot pour mot
// par LGP Constructions avant mise en ligne définitive. Tant qu'aucune
// photo n'est fournie, pas d'avatar/silhouette : juste la citation, le
// nom et le secteur.
const TESTIMONIAL = {
  quote:
    "On ne se posait plus de questions sur qui avait avancé quoi. Depuis, tout est centralisé, et l'équipe gagne un temps monstre sur le suivi de chantier. Très professionnel du début à la fin.",
  name: "LGP Constructions",
  role: "Entreprise de construction",
  photo: null as string | null,
};

export default function Testimonial() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/testimonial-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:p-12"
        >
          <Quote className="mx-auto h-8 w-8 text-primary/30" />
          <p className="mt-4 text-balance font-heading text-xl font-bold leading-snug text-foreground sm:text-2xl">
            {TESTIMONIAL.quote}
          </p>

          <div className="mt-8">
            <p className="font-heading text-sm font-bold text-foreground">
              {TESTIMONIAL.name}
            </p>
            <p className="text-sm text-muted">{TESTIMONIAL.role}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

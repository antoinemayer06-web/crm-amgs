"use client";

import { motion } from "framer-motion";
import { Quote, User } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

// Emplacement prêt pour un témoignage client réel (citation + photo + nom
// + fonction) — le contenu ci-dessous est un placeholder explicite, pas
// un faux témoignage : à remplacer dès qu'un vrai retour client est
// disponible. Tant qu'aucune photo n'est fournie, un avatar neutre est
// affiché plutôt qu'une fausse photo.
const TESTIMONIAL = {
  quote:
    "Ajoutez ici la citation de votre client — quelques phrases sur ce qui a changé concrètement pour son équipe.",
  name: "Nom du client",
  role: "Fonction — entreprise",
  photo: null as string | null,
};

export default function Testimonial() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary-dark">
              <User className="h-6 w-6" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-foreground">
                {TESTIMONIAL.name}
              </p>
              <p className="text-sm text-muted">{TESTIMONIAL.role}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

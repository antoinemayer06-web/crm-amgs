"use client";

import Script from "next/script";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { CALENDLY_URL } from "@/lib/links";

// Widget Calendly natif (script officiel + <div class="calendly-inline-widget">)
// plutôt qu'un simple lien qui ouvre un nouvel onglet — on choisit
// directement un créneau sans quitter la page. Couleurs alignées sur la
// charte (violet primaire) via les paramètres d'URL supportés par Calendly.
export default function BookingCalendar() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Réservez votre créneau
          </h2>
          <p className="mt-4 text-lg text-muted">
            Choisissez directement un horaire qui vous arrange — pas
            d&apos;aller-retour par email.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
        >
          <div
            className="calendly-inline-widget"
            data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=1a1a2e&primary_color=4c3aa1`}
            style={{ minWidth: "280px", height: "700px" }}
          />
        </motion.div>
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </section>
  );
}

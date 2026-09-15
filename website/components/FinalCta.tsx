"use client";

import Script from "next/script";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { CALENDLY_URL } from "@/lib/links";

// Widget Calendly natif directement dans le CTA final, en thème sombre
// pour rester raccord avec le fond violet foncé de la section — plus de
// simple bouton qui renvoie ailleurs, on réserve sur place.
export default function FinalCta() {
  return (
    <section className="bg-ink py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-white sm:text-4xl">
            Prêt à reprendre la main sur votre temps ?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Un appel de 20-30 minutes suffit pour identifier ce qui peut être
            automatisé chez vous.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 overflow-hidden rounded-2xl border border-white/10"
        >
          <div
            className="calendly-inline-widget"
            data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=17122b&text_color=ffffff&primary_color=6f5bc9`}
            style={{ minWidth: "280px", height: "650px" }}
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

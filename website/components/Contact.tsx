"use client";

import Script from "next/script";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import DiagnosticCta from "@/components/DiagnosticCta";
import { LinkedInIcon, WhatsAppIcon } from "@/components/icons";
import { buttonHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { CALENDLY_URL, CONTACT_EMAIL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/links";

export default function Contact() {
  return (
    <section id="contact" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid items-stretch gap-8 lg:grid-cols-2"
        >
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl bg-ink p-5 sm:p-8"
          >
            <h3 className="font-heading text-lg font-bold text-white">
              La voie la plus rapide
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Réservez directement un créneau de 20-30 minutes dans notre
              agenda — pas d&apos;aller-retour par email.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <div
                className="calendly-inline-widget h-[720px] w-full min-w-[280px] sm:h-[650px]"
                data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=17122b&text_color=ffffff&primary_color=6f5bc9`}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex h-full flex-col gap-6">
            <div className="rounded-2xl border border-border bg-background p-8">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Pas encore prêt à réserver un créneau ?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Contactez-nous directement, on vous répond vite.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={buttonHover}
                  className="flex items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent-dark"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Discuter sur WhatsApp
                </motion.a>
                <motion.a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={buttonHover}
                  className="flex items-center justify-center gap-2.5 rounded-full bg-[#0A66C2] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#0A66C2]/25 transition-colors hover:bg-[#0A66C2]/90"
                >
                  <LinkedInIcon className="h-5 w-5" />
                  Voir mon profil LinkedIn
                </motion.a>
                <motion.a
                  href={`mailto:${CONTACT_EMAIL}`}
                  whileHover={buttonHover}
                  className="flex items-center justify-center gap-2.5 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary-dark"
                >
                  <Mail className="h-5 w-5" />
                  {CONTACT_EMAIL}
                </motion.a>
              </div>
            </div>

            <DiagnosticCta className="flex-1" />
          </motion.div>
        </motion.div>
      </div>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </section>
  );
}

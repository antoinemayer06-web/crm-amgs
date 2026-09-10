"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import LeadMagnet from "@/components/LeadMagnet";
import { LinkedInIcon } from "@/components/icons";
import { buttonHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { CALENDLY_URL, CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/links";

// Options de titre — la première est utilisée ci-dessous.
// 1. "Prêt à arrêter la double saisie ?"
// 2. "Voyons ce qui peut être automatisé chez vous"

export default function Contact() {
  return (
    <section id="contact" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Prêt à arrêter la double saisie ?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Un appel de 20-30 minutes suffit pour identifier ce qui peut être
            automatisé chez vous.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid items-start gap-8 lg:grid-cols-2"
        >
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-border bg-background p-8"
          >
            <h3 className="font-heading text-lg font-bold text-foreground">
              La voie la plus rapide
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Réservez directement un créneau de 20-30 minutes dans mon
              agenda — pas d&apos;aller-retour par email.
            </p>
            <div className="mt-6 flex flex-col items-start gap-4">
              <motion.a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={buttonHover}
                className="inline-block rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-ink/25 transition-colors hover:bg-primary-dark"
              >
                Prendre rendez-vous
              </motion.a>
              <motion.a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={buttonHover}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
              >
                <LinkedInIcon className="h-4 w-4" />
                Ou échangeons sur LinkedIn
              </motion.a>
              <motion.a
                href={`mailto:${CONTACT_EMAIL}`}
                whileHover={buttonHover}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
              >
                Ou écrivez-nous : {CONTACT_EMAIL}
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-border bg-background p-8"
          >
            <h3 className="font-heading text-lg font-bold text-foreground">
              Pas encore prêt à réserver un créneau ?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Laissez-moi un message, je vous réponds sous 24-48h ouvrées.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8"
        >
          <LeadMagnet />
        </motion.div>
      </div>
    </section>
  );
}

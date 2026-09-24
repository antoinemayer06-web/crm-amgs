"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { SERVICE_TYPES } from "@/lib/content";

// Clôture de /nos-derniers-projets : élargit sans inventer de faux clients
// en renvoyant vers la liste complète des 7 types de solutions (détaillées
// sur /services), puis un CTA final générique vers la prise de contact.
export default function ProjectsClosing() {
  return (
    <>
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
              Et pour votre situation ?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Ces deux projets illustrent le principe. Chaque demande est
              différente — voici ce qu&apos;il est possible de construire :
            </p>
          </motion.div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {SERVICE_TYPES.map((title) => (
              <motion.li
                key={title}
                variants={fadeInUp}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                <span className="text-sm font-medium text-foreground/80">
                  {title}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mt-8"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark transition hover:gap-2.5"
            >
              Voir le détail de nos services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <div>
              <p className="font-heading text-xl font-black text-white">
                Et le vôtre ?
              </p>
              <p className="mt-1 text-sm text-white/60">
                Un appel de 20 minutes suffit pour savoir ce qui, chez vous,
                peut tourner tout seul.
              </p>
            </div>
            <motion.div whileHover={buttonHover}>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
              >
                Prendre rendez-vous
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mt-6 text-center text-xs text-muted"
          >
            Les bénéfices affichés sont des estimations basées sur les
            informations transmises par les clients concernés, à titre
            indicatif.
          </motion.p>
        </div>
      </section>
    </>
  );
}

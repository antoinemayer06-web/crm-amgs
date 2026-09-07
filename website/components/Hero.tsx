"use client";

import { motion } from "framer-motion";
import { buttonHover, fadeInUp, staggerContainer } from "@/lib/animations";

// Outils courants chez les cibles (cabinets de conseil, bureaux d'études,
// cabinets d'ingénierie, agences). Wordmarks stylisés, pas de logos réels
// téléchargés — à remplacer par de vraies icônes/logos si besoin.
const TOOLS = [
  "Axonaut",
  "HubSpot",
  "Notion",
  "Google Workspace",
  "Slack",
  "Monday.com",
  "Trello",
  "Google Drive",
];

// Options de titre principal (H1) — la première est utilisée ci-dessous.
// 1. "On connecte vos outils. Vous arrêtez la double saisie."
// 2. "Vos outils actuels, enfin connectés entre eux."
// 3. "Moins de ressaisie. Plus de temps pour vos dossiers."
const HEADLINE = "On connecte vos outils. Vous arrêtez la double saisie.";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-balance font-heading text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {HEADLINE}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-2xl text-balance text-lg text-muted sm:text-xl"
        >
          AM Growth Solutions automatise la gestion de projet, la charge de
          travail et les échanges entre vos outils métier existants — sans
          rien changer à votre façon de travailler.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <motion.a
            href="#contact"
            whileHover={buttonHover}
            className="inline-block rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent-dark"
          >
            Prendre rendez-vous
          </motion.a>
          <motion.a
            href="#preuve"
            whileHover={buttonHover}
            className="inline-block rounded-full border-2 border-primary px-7 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Voir un cas concret
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Bandeau outils — défilement horizontal infini (marquee) */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mt-16 sm:mt-20"
      >
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
          Connecté à vos outils actuels
        </p>

        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-x-14 py-2 [animation-play-state:running] hover:[animation-play-state:paused]">
            {[...TOOLS, ...TOOLS].map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="whitespace-nowrap font-heading text-lg font-bold text-muted/70 transition-colors hover:text-foreground"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

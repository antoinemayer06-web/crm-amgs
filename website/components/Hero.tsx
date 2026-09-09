"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

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

// Halos flous en fond, dérive lente en boucle — discret, pas un effet
// "gamer". Couleurs violettes uniquement (le vert reste réservé au
// bouton WhatsApp).
const BLOBS = [
  {
    className: "left-[-10%] top-[-15%] h-[32rem] w-[32rem] bg-primary/40",
    animate: { x: [0, 40, -20, 0], y: [0, 30, -10, 0] },
    duration: 26,
  },
  {
    className: "right-[-15%] top-[10%] h-[28rem] w-[28rem] bg-primary-light/30",
    animate: { x: [0, -30, 20, 0], y: [0, -20, 25, 0] },
    duration: 22,
  },
  {
    className: "bottom-[-20%] left-[20%] h-[26rem] w-[26rem] bg-primary-dark/50",
    animate: { x: [0, 25, -25, 0], y: [0, -15, 15, 0] },
    duration: 30,
  },
];

export default function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-black pt-32 pb-20 sm:pt-40 sm:pb-24">
        {/* Fond noir — le violet ne vient que des halos animés ci-dessous */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 25% 15%, #0a0a0f 0%, #000000 70%)",
          }}
        />

        {/* Halos animés */}
        <div className="absolute inset-0 overflow-hidden">
          {BLOBS.map((blob, index) => (
            <motion.div
              key={index}
              animate={blob.animate}
              transition={{
                duration: blob.duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className={`absolute rounded-full blur-3xl ${blob.className}`}
            />
          ))}
        </div>

        {/* Texture points, façon plan technique — discrète */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-balance font-heading text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {HEADLINE}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-balance text-lg text-white/70 sm:text-xl"
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
              whileHover={{ scale: 1.03 }}
              className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-semibold text-ink shadow-lg shadow-black/20 transition-colors hover:bg-white/90"
            >
              Prendre rendez-vous
            </motion.a>
            <motion.a
              href="#preuve"
              whileHover={{ scale: 1.03 }}
              className="inline-block rounded-full border-2 border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              Voir un cas concret
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Bandeau outils — défilement horizontal infini (marquee), en
          dehors du hero sombre pour rester lisible sur fond clair. */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-background py-10 sm:py-14"
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
    </>
  );
}

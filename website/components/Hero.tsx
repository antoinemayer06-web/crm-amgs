"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gift } from "lucide-react";
import NetworkBackground from "@/components/NetworkBackground";
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
  "Power Automate",
  "Power BI",
  "Microsoft 365",
];

const HEADLINE = "Automatisations pour les PME";
const SUBTITLE =
  "On automatise vos process internes pour que vous ne perdiez plus de temps sur des tâches répétitives.";

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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Les calques de fond dérivent plus lentement que le contenu au scroll
  // (parallaxe) — donne une sensation de profondeur/superposition.
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const networkY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-black pt-32 pb-20 sm:pt-40 sm:pb-24"
      >
        {/* Fond noir — le violet ne vient que des halos animés ci-dessous */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0"
        >
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
        </motion.div>

        {/* Réseau de nœuds connectés — dérive à une vitesse différente du
            fond pour accentuer la profondeur */}
        <motion.div style={{ y: networkY }} className="absolute inset-0">
          <NetworkBackground />
        </motion.div>

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
          <motion.span
            variants={fadeInUp}
            className="text-xs font-semibold uppercase tracking-widest text-white/40"
          >
            La Réunion (974)
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mt-4 text-balance font-heading text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {HEADLINE}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-balance text-lg text-white/70 sm:text-xl"
          >
            {SUBTITLE}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10">
            {/* Un seul trait lumineux qui tourne en continu autour du
                bouton, plutôt qu'un halo qui pulse — le calque du dégradé
                conique est bien plus grand que le bouton et centré, pour
                que la rotation ne laisse jamais de trou visible une fois
                rognée par le rounded-full/overflow-hidden du conteneur. */}
            <div className="relative inline-block overflow-hidden rounded-full p-[2px] shadow-lg shadow-black/20">
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(111,91,201,0) 260deg, rgba(111,91,201,0.9) 300deg, rgba(76,58,161,1) 330deg, rgba(111,91,201,0) 360deg)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              <Link
                href="/diagnostic"
                className="relative inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-white/90"
              >
                <Gift className="h-5 w-5 text-primary-dark" />
                Diagnostic gratuit
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bandeau outils — défilement horizontal infini (marquee), mis en
          avant sous forme de chips plutôt qu'une simple liste de texte
          fondu, pour bien signaler la compatibilité avec les outils déjà
          en place chez le client. */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="border-y border-border bg-surface py-8 sm:py-10"
      >
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-muted">
          Compatible avec les outils que vous utilisez déjà
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-x-4">
            {[...TOOLS, ...TOOLS].map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="whitespace-nowrap rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm"
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

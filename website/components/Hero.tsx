"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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
];

// Options de titre principal (H1) — la première est utilisée ci-dessous
// (alignée sur le mot-clé SEO cible de la home). Trois nouvelles pistes
// proposées, chacune sur un angle différent — à choisir/arbitrer :
// A. Orientée problème :
//    "Vos outils ne se parlent pas ? Voici pourquoi vous perdez du temps chaque jour."
// B. Orientée résultat/preuve :
//    "Un devis annoncé à 3 semaines. Livré en 1 semaine et demie."
// C. Orientée promesse directe :
//    "J'automatise la gestion de projet des PME de La Réunion pour que leurs outils travaillent enfin ensemble."
// Actif pour l'instant (garde le mot-clé "automatisation PME La Réunion"
// dans le H1 en attendant l'arbitrage sur A/B/C) :
const HEADLINE =
  "Automatisation PME à La Réunion : la fin de la double saisie entre vos outils";

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
            AM Growth Solutions connecte votre CRM, votre gestion de projet
            et vos outils administratifs pour supprimer la ressaisie
            manuelle — sans changer d&apos;outils, avec des résultats livrés
            en quelques jours.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.03 }}>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-semibold text-ink shadow-lg shadow-black/20 transition-colors hover:bg-white/90"
              >
                Prendre rendez-vous
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Link
                href="/etude-de-cas-ecodden"
                className="inline-block rounded-full border-2 border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              >
                Voir un cas concret
              </Link>
            </motion.div>
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

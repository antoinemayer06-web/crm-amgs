"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkedInIcon } from "@/components/icons";
import Principles from "@/components/Principles";
import { buttonHover, fadeInUp } from "@/lib/animations";
import { LINKEDIN_URL } from "@/lib/links";

export default function AboutContent() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Le constat de départ
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
            <p>
              La majorité des PME n&apos;ont pas un problème d&apos;outils.
              Elles ont un problème de connexions. Un CRM ici, un tableur
              là, une boîte mail au milieu — chacun fait bien son travail,
              seul. Ensemble, ils ne se parlent pas.
            </p>
            <p>
              Je me suis spécialisé sur exactement ce point de friction :
              connecter ce qui existe déjà, plutôt que vendre un outil de
              plus.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14"
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Comment je travaille
          </h2>
          <div className="mt-6">
            <Principles />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-14"
        >
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            La preuve, pas le discours
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
            <p>
              Dernier exemple concret : un bureau d&apos;études qui perdait
              du temps sur cinq outils déconnectés. Système livré en une
              semaine et demie. Un second projet, quelques semaines plus
              tard, livré en quatre jours.
            </p>
            <p>
              Pas de forfait générique, pas de tarif à la carte. Chaque
              système est chiffré après avoir vu comment vous travaillez
              réellement.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-14 flex flex-col items-center gap-6 rounded-2xl border border-border bg-background p-8 text-center sm:flex-row sm:gap-8 sm:p-10 sm:text-left"
        >
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-surface shadow-md ring-1 ring-border sm:h-36 sm:w-36">
            <Image
              src="/brand/founder-antoine.jpg"
              alt="Antoine Mayer, fondateur d'AM Growth Solutions"
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-foreground/80">
              Ma mission n&apos;est pas de vous vendre de la technologie.
              C&apos;est de vous rendre vos heures — pour que vous les
              passiez sur ce qui compte vraiment : votre métier.
            </p>
            <p className="mt-4 font-heading text-lg font-bold text-foreground">
              Antoine Mayer
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-primary-dark">
              Fondateur — AM Growth Solutions
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p className="font-heading text-xl font-black text-white">
            On en discute ?
          </p>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0A66C2]/90"
          >
            <LinkedInIcon className="h-4 w-4" />
            Discuter avec Antoine
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LinkedInIcon } from "@/components/icons";
import { buttonHover, fadeInUp } from "@/lib/animations";
import { LINKEDIN_URL } from "@/lib/links";

// Page volontairement simple : photo en petit format en haut, un seul
// pavé de texte encadré en pleine largeur, puis le CTA en barre.
export default function AboutContent() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-md ring-1 ring-border sm:h-36 sm:w-36">
            <Image
              src="/brand/founder-antoine.jpg"
              alt="Antoine Mayer, fondateur d'AM Growth Solutions"
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-10 space-y-5 rounded-2xl border border-border bg-background p-8 text-base leading-relaxed text-muted shadow-sm sm:p-10"
        >
          <p>
            En tant qu&apos;alternant et lors de mes précédentes activités,
            j&apos;ai passé des mois à observer des dirigeants perdre un
            temps fou sur des tâches qui n&apos;auraient jamais dû leur
            revenir : ressaisir la même information trois fois, courir
            après un fichier, établir un suivi à la main. Je détestais
            déjà l&apos;administratif pour moi-même — je n&apos;allais
            certainement pas regarder quelqu&apos;un d&apos;autre s&apos;y
            noyer sans rien faire.
          </p>
          <p>
            J&apos;ai décidé d&apos;allier ma passion pour la tech et le
            code à ce constat simple : moins un dirigeant perd de temps
            sur de l&apos;administratif, plus il en gagne sur ce qui fait
            vraiment avancer son entreprise. Et du temps gagné, ça finit
            toujours par se traduire en argent gagné.
          </p>
          <p>
            Mon travail aujourd&apos;hui : repérer ce qui vous fait perdre
            du temps chaque jour, sans même que vous le remarquiez — et
            construire un
            système qui le fait disparaître. Pas un logiciel de plus à
            apprendre. Un système qui tourne, en silence, pendant que vous
            vous concentrez sur votre métier.
          </p>
          <p>
            Je ne vends pas de la technologie. Je vends du temps retrouvé,
            une équipe plus productive, et une entreprise qui tourne sans
            reposer sur la mémoire d&apos;une seule personne. Chaque
            mission est pensée sur mesure, livrée vite, et suivie dans la
            durée — un système qu&apos;on abandonne après la livraison
            n&apos;en est pas un.
          </p>
          <div className="pt-2">
            <p className="font-heading text-lg font-bold text-foreground">
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
          className="mt-8 flex flex-col items-center gap-6 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p className="text-base text-white/70">
            Disponible et réactif, discutons de votre situation.
          </p>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0A66C2]/90"
          >
            <LinkedInIcon className="h-4 w-4" />
            Antoine Mayer
          </motion.a>
        </motion.div>

        <p className="mt-6 text-center text-sm text-muted">
          En savoir plus sur ma façon de travailler :{" "}
          <Link
            href="/blog/automatisation-974-guide-complet-pme-reunion"
            className="underline underline-offset-2 hover:text-primary-dark"
          >
            le guide complet de l&apos;automatisation pour les PME
            réunionnaises
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

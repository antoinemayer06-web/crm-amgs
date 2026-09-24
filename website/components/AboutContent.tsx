"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkedInIcon } from "@/components/icons";
import { buttonHover, fadeInUp } from "@/lib/animations";
import { LINKEDIN_URL } from "@/lib/links";

// Page volontairement simple : pas de cartes, pas de grille — une photo
// mise en avant, un seul pavé de texte continu, puis le CTA.
export default function AboutContent() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-sm"
          >
            <Image
              src="/brand/founder-antoine.jpg"
              alt="Antoine Mayer, fondateur d'AM Growth Solutions"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="space-y-5 text-base leading-relaxed text-muted"
          >
            <p>
              On ne me contacte pas pour un outil de plus. On me contacte
              parce qu&apos;un dirigeant sur trois passe encore ses
              semaines à faire à la main ce qu&apos;un système pourrait
              faire pour lui.
            </p>
            <p>
              Mon travail : repérer ce qui vous fait perdre du temps
              chaque jour, sans même que vous le remarquiez — et
              construire un système qui le fait disparaître. Pas un
              logiciel de plus à apprendre. Un système qui tourne, en
              silence, pendant que vous vous concentrez sur votre métier.
            </p>
            <p>
              Je ne vends pas de la technologie. Je vends du temps
              retrouvé, une équipe plus productive, et une entreprise qui
              tourne sans reposer sur la mémoire d&apos;une seule
              personne. Chaque mission est pensée sur mesure, livrée vite,
              et suivie dans la durée — un système qu&apos;on abandonne
              après la livraison n&apos;en est pas un.
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
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-base text-muted">
            Disponible et réactif, discutons de votre situation.
          </p>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={buttonHover}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0A66C2]/90"
          >
            <LinkedInIcon className="h-4 w-4" />
            Antoine Mayer
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

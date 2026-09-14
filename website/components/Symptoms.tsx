"use client";

import { Film } from "lucide-react";
import { motion } from "framer-motion";
import ParallaxAccent from "@/components/ParallaxAccent";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Section "Vos symptômes" — 3 cartes côte à côte (empilées en mobile),
// chacune avec une vidéo courte en tête. En attendant les fichiers
// définitifs (fournis séparément), le <video class="symptom-video"> reste
// vide et un repère visuel neutre (icône + libellé du slot) indique
// l'emplacement à remplir plutôt qu'un cadre noir vide.

const SYMPTOMS = [
  {
    slot: "symptome-1-repetitif",
    title: "Le temps perdu, tous les jours",
    text: "La même info recopiée à la main, encore et encore. Ça ne s'arrête jamais, et personne ne le remarque avant qu'il soit trop tard.",
  },
  {
    slot: "symptome-2-visibilite",
    title: "Vos données, éparpillées partout",
    text: "L'info existe, mais dans dix endroits différents. Impossible de savoir où en sont vraiment vos dossiers d'un coup d'œil.",
  },
  {
    slot: "symptome-3-charge-mentale",
    title: "Tout repose sur une seule personne",
    text: "Un collaborateur absent, et c'est tout le service qui tourne au ralenti. La mémoire d'une personne n'est pas un système.",
  },
];

function SymptomVideo({ slot }: { slot: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary-dark/5">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="symptom-video absolute inset-0 h-full w-full object-cover"
        data-slot={slot}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary-dark/35">
        <Film className="h-7 w-7" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {slot}
        </span>
      </div>
    </div>
  );
}

export default function Symptoms() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <ParallaxAccent className="left-[-8%] top-[10%] h-72 w-72 bg-primary/[0.06]" />
      <ParallaxAccent
        className="right-[-6%] bottom-[5%] h-64 w-64 bg-primary-light/[0.08]"
        range={60}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-black text-foreground sm:text-4xl">
            Vos symptômes
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 sm:grid-cols-3"
        >
          {SYMPTOMS.map((symptom) => (
            <motion.div
              key={symptom.slot}
              variants={fadeInUp}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <SymptomVideo slot={symptom.slot} />
              <div className="flex flex-1 flex-col p-7 text-center">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {symptom.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {symptom.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// Bandeau d'intro sombre réutilisé en tête des pages internes (piliers,
// étude de cas, comment ça marche, tarifs, à propos, contact...). Un seul
// H1 par page — c'est ce composant qui le porte.
export default function PageIntro({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, #0a0a0f 0%, #000000 70%)",
        }}
      />
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h1 className="text-balance font-heading text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-balance text-lg text-white/70">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}

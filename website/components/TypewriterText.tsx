"use client";

import { motion } from "framer-motion";

// Révèle un texte caractère par caractère au scroll, comme s'il était
// tapé en direct. Le texte complet reste dans le DOM pour les lecteurs
// d'écran (`sr-only`) ; la version animée est purement visuelle
// (`aria-hidden`).

const container = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const charVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export default function TypewriterText({
  text,
  className,
  staggerDelay = 0.02,
}: {
  text: string;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={container}
      custom={staggerDelay}
      className={className}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split("").map((char, i) => (
          <motion.span key={i} variants={charVariant}>
            {char}
          </motion.span>
        ))}
      </span>
    </motion.p>
  );
}

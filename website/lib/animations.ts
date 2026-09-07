import type { Variants } from "framer-motion";

/**
 * Variants Framer Motion réutilisables pour des animations discrètes au
 * scroll : fade-in + léger slide-up sur les sections, stagger sur les
 * listes de cartes, hover subtil, et compteurs animés sur les chiffres clés.
 *
 * Usage type :
 *   <motion.div
 *     variants={fadeInUp}
 *     initial="hidden"
 *     whileInView="visible"
 *     viewport={{ once: true, amount: 0.3 }}
 *   />
 */

// Fade-in + léger slide-up, pour une section ou un bloc de contenu.
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Variante sans déplacement, pour les éléments qui doivent juste apparaître.
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Conteneur à utiliser avec des enfants en fadeInUp pour un effet
// d'apparition échelonnée (ex : grille de cartes de services).
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Léger slide depuis la gauche, utile pour alterner avec slideInFromRight
// dans des sections en deux colonnes (texte / illustration).
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Hover subtil pour les cartes (services, témoignages, etc.).
// À utiliser avec whileHover={cardHover} sur un motion.div.
export const cardHover = {
  y: -4,
  boxShadow: "0 12px 24px -8px rgba(30, 42, 94, 0.15)",
  transition: { duration: 0.25, ease: "easeOut" },
};

// Petit scale au survol pour les boutons / éléments cliquables.
export const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2, ease: "easeOut" },
};

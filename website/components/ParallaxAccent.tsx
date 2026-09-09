"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Halo flou décoratif qui dérive verticalement, plus lentement que le
// contenu, pendant qu'il traverse le viewport — donne une sensation de
// profondeur/superposition de calques au scroll. Purement décoratif
// (aria-hidden), à poser derrière le contenu d'une section positionnée en
// `relative overflow-hidden`.
export default function ParallaxAccent({
  className,
  range = 80,
}: {
  className: string;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    />
  );
}

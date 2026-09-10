"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  /** Valeur finale affichée. */
  to: number;
  /** Valeur de départ (0 par défaut). */
  from?: number;
  /** Durée de l'animation en secondes. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Nombre de décimales affichées (0 par défaut). */
  decimals?: number;
  className?: string;
  /** Couleur au départ de l'animation (hex). Avec colorTo, le chiffre
   * change de couleur en même temps qu'il compte — utile pour un
   * compteur qui se "transforme" (ex: une estimation qui devient un
   * résultat prouvé). */
  colorFrom?: string;
  colorTo?: string;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function mixColor(from: string, to: string, progress: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const r = Math.round(a.r + (b.r - a.r) * progress);
  const g = Math.round(a.g + (b.g - a.g) * progress);
  const bl = Math.round(a.b + (b.b - a.b) * progress);
  return `rgb(${r}, ${g}, ${bl})`;
}

// Compteur qui s'incrémente de `from` à `to` dès que le composant entre
// dans le viewport, une seule fois (useInView once: true).
export default function AnimatedCounter({
  to,
  from = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  colorFrom,
  colorTo,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  // La valeur initiale (SSR + premier rendu client) est la valeur FINALE,
  // pas `from` : le HTML statique/indexable doit toujours montrer le
  // vrai chiffre, jamais un 0 qui ne s'anime qu'après hydratation. Le
  // compteur ne repart de `from` que juste avant de lancer l'animation,
  // au moment où l'élément entre dans le viewport.
  const [value, setValue] = useState(to);
  const [color, setColor] = useState(colorTo ?? colorFrom);

  useEffect(() => {
    if (!isInView) return;

    setValue(from);
    if (colorFrom) setColor(colorFrom);

    let frame: number;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (colorFrom && colorTo) {
        setColor(mixColor(colorFrom, colorTo, eased));
      }
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, from, to, duration, colorFrom, colorTo]);

  return (
    <span ref={ref} className={className} style={color ? { color } : undefined}>
      {prefix}
      {value.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

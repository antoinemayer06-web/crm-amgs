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
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let frame: number;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

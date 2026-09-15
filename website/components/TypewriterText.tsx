"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Révèle un texte lettre par lettre au scroll, avec une barre de curseur
// clignotante façon machine à écrire. Les caractères pas encore tapés ne
// sont pas dans le DOM (pas juste invisibles) : le curseur colle donc
// toujours à la fin du texte réellement affiché, comme une vraie frappe.
// Le texte complet reste lisible pour les lecteurs d'écran (`sr-only`).
export default function TypewriterText({
  text,
  className,
  charDelay = 0.055,
}: {
  text: string;
  className?: string;
  charDelay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || count >= text.length) return;
    const timeout = setTimeout(() => {
      setCount((c) => c + 1);
    }, charDelay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, count, text, charDelay]);

  const done = count >= text.length;

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {!done && (
          <span
            className="ml-0.5 inline-block w-[3px] animate-blink bg-current align-middle"
            style={{ height: "0.85em" }}
          />
        )}
      </span>
    </p>
  );
}

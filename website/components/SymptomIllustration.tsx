"use client";

import { motion } from "framer-motion";
import { AppWindow, User } from "lucide-react";

// Trois illustrations animées, une par symptôme — construites en SVG/CSS
// (cohérent avec le reste du site), pas des photos. `size` (en px,
// référence 96) permet de les réutiliser en petit badge ou en grande
// illustration — tout est calculé proportionnellement.

interface IllustrationProps {
  size: number;
}

const BASE = 96;

// 1. Temps perdu sur tâches répétitives — une donnée qui fait la navette
// en boucle infinie entre deux outils, symbole de la ressaisie continue.
function RepetitiveTasks({ size }: IllustrationProps) {
  const scale = size / BASE;
  const toolSize = 30 * scale;
  const gap = 44 * scale;
  const dotSize = 8 * scale;

  return (
    <div
      className="relative mx-auto flex items-center justify-center rounded-full bg-primary/[0.07]"
      style={{ width: size, height: size }}
    >
      <div
        className="flex items-center"
        style={{ gap }}
      >
        <div className="flex items-center justify-center rounded-xl border border-primary/20 bg-surface text-primary-dark shadow-sm" style={{ width: toolSize, height: toolSize }}>
          <AppWindow style={{ width: toolSize * 0.55, height: toolSize * 0.55 }} />
        </div>
        <div className="flex items-center justify-center rounded-xl border border-primary/20 bg-surface text-primary-dark shadow-sm" style={{ width: toolSize, height: toolSize }}>
          <AppWindow style={{ width: toolSize * 0.55, height: toolSize * 0.55 }} />
        </div>
      </div>

      {/* Trajectoire pointillée entre les deux outils */}
      <div
        className="absolute border-t-2 border-dashed border-primary/25"
        style={{ width: gap, top: "50%" }}
      />

      {/* Particule de données qui fait l'aller-retour */}
      <motion.span
        className="absolute rounded-full bg-primary shadow"
        style={{ width: dotSize, height: dotSize }}
        animate={{ x: [-gap / 2, gap / 2, -gap / 2] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      />
    </div>
  );
}

// 2. Manque de visibilité — plusieurs fenêtres de données séparées,
// floues et non reliées entre elles, qui flottent chacune indépendamment.
function ScatteredInfo({ size }: IllustrationProps) {
  const scale = size / BASE;
  const windows = [
    { x: -22, y: -16, rot: -8, w: 30, blur: 0.5, delay: 0 },
    { x: 16, y: -12, rot: 10, w: 26, blur: 0.8, delay: 0.4 },
    { x: -8, y: 18, rot: -4, w: 28, blur: 0.3, delay: 0.8 },
  ];

  return (
    <div
      className="relative mx-auto flex items-center justify-center overflow-hidden rounded-full bg-primary/[0.07]"
      style={{ width: size, height: size }}
    >
      {windows.map((win, i) => {
        const w = win.w * scale;
        const h = w * 0.72;
        return (
          <motion.div
            key={i}
            className="absolute rounded-md border border-primary/25 bg-surface p-1 shadow-sm"
            style={{
              width: w,
              height: h,
              x: win.x * scale,
              y: win.y * scale,
              rotate: win.rot,
              filter: `blur(${win.blur}px)`,
            }}
            animate={{ opacity: [0.55, 0.95, 0.55] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              delay: win.delay,
              ease: "easeInOut",
            }}
          >
            <div className="h-[15%] w-2/3 rounded-full bg-primary/30" />
            <div className="mt-[10%] h-[15%] w-full rounded-full bg-silver/70" />
            <div className="mt-[10%] h-[15%] w-1/2 rounded-full bg-silver/70" />
          </motion.div>
        );
      })}
    </div>
  );
}

// 3. Process reposant sur une personne — un point central relié à
// d'autres, dont les liens s'estompent en pointillés gris pour symboliser
// la fragilité du système (rien ne tient si le point central lâche).
function SinglePointOfFailure({ size }: IllustrationProps) {
  const scale = size / BASE;
  const userSize = 34 * scale;
  const nodes = [
    { x: 0, y: -30 },
    { x: 28, y: 16 },
    { x: -28, y: 16 },
  ];

  return (
    <div
      className="relative mx-auto flex items-center justify-center rounded-full bg-primary/[0.07]"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="-40 -40 80 80"
        className="absolute"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {nodes.map((n, i) => (
          <g key={i}>
            {/* Trait plein coloré, qui s'efface... */}
            <motion.line
              x1={0}
              y1={0}
              x2={n.x}
              y2={n.y}
              strokeWidth={1.5}
              className="stroke-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
            {/* ...pour laisser place à un pointillé gris (fragilité) */}
            <motion.line
              x1={0}
              y1={0}
              x2={n.x}
              y2={n.y}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              className="stroke-muted/50"
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={3} className="fill-muted/50" />
        ))}
      </svg>
      <span
        className="relative flex items-center justify-center rounded-full bg-primary-dark text-white shadow"
        style={{ width: userSize, height: userSize }}
      >
        <User style={{ width: userSize * 0.45, height: userSize * 0.45 }} />
      </span>
    </div>
  );
}

const ILLUSTRATIONS = [RepetitiveTasks, ScatteredInfo, SinglePointOfFailure];

export default function SymptomIllustration({
  index,
  size = 96,
}: {
  index: number;
  size?: number;
}) {
  const Illustration = ILLUSTRATIONS[index] ?? ILLUSTRATIONS[0];
  return <Illustration size={size} />;
}

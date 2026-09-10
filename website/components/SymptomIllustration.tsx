"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileText, RefreshCw, User } from "lucide-react";

// Trois petites illustrations animées, une par symptôme — pour donner à
// cette section une lecture immédiate et un peu de vie, plutôt que 3
// cartes de texte identiques. Construites en SVG/icônes (cohérent avec le
// reste du site : NetworkBackground, FlowDiagram...), pas des photos.

const WRAPPER =
  "relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/[0.07]";

// 1. Temps perdu sur des tâches répétitives — icône qui tourne en boucle,
// avec des "échos" fantômes qui apparaissent/disparaissent autour d'elle
// pour suggérer la répétition.
function RepetitiveTasks() {
  return (
    <div className={WRAPPER}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute text-primary/25"
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.3, 1.6] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        >
          <RefreshCw className="h-10 w-10" />
        </motion.span>
      ))}
      <motion.span
        className="relative text-primary-dark"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw className="h-8 w-8" />
      </motion.span>
    </div>
  );
}

// 2. Manque de visibilité — des petits documents éparpillés qui flottent
// doucement, chacun à son rythme, pour évoquer une information dispersée ;
// un point d'alerte central clignote lentement.
function ScatteredInfo() {
  const files = [
    { x: -20, y: -14, rotate: -12, delay: 0 },
    { x: 18, y: -18, rotate: 10, delay: 0.3 },
    { x: -16, y: 16, rotate: 8, delay: 0.6 },
    { x: 20, y: 14, rotate: -8, delay: 0.9 },
  ];
  return (
    <div className={WRAPPER}>
      {files.map((f, i) => (
        <motion.span
          key={i}
          className="absolute text-primary/30"
          style={{ x: f.x, y: f.y, rotate: f.rotate }}
          animate={{ y: [f.y, f.y - 5, f.y] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut",
          }}
        >
          <FileText className="h-6 w-6" />
        </motion.span>
      ))}
      <motion.span
        className="relative text-primary-dark"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlertCircle className="h-7 w-7" />
      </motion.span>
    </div>
  );
}

// 3. Process qui reposent sur une seule personne — un point central relié
// à 3 autres, dont les liens s'estompent puis reviennent en boucle : le
// système "tient" tant que la personne au centre est là.
function SinglePointOfFailure() {
  const nodes = [
    { x: 0, y: -30 },
    { x: 28, y: 16 },
    { x: -28, y: 16 },
  ];
  return (
    <div className={WRAPPER}>
      <svg
        viewBox="-40 -40 80 80"
        className="absolute h-24 w-24"
        aria-hidden="true"
      >
        {nodes.map((n, i) => (
          <motion.line
            key={i}
            x1={0}
            y1={0}
            x2={n.x}
            y2={n.y}
            strokeWidth={1.5}
            className="stroke-primary/30"
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={3}
            className="fill-primary/40"
          />
        ))}
      </svg>
      <motion.span
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-dark text-white"
        animate={{ boxShadow: ["0 0 0 0 rgba(43,32,100,0.35)", "0 0 0 8px rgba(43,32,100,0)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      >
        <User className="h-4 w-4" />
      </motion.span>
    </div>
  );
}

const ILLUSTRATIONS = [RepetitiveTasks, ScatteredInfo, SinglePointOfFailure];

export default function SymptomIllustration({ index }: { index: number }) {
  const Illustration = ILLUSTRATIONS[index] ?? ILLUSTRATIONS[0];
  return <Illustration />;
}

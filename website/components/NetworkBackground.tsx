"use client";

import { motion } from "framer-motion";

// Fond animé évoquant des outils connectés entre eux : des nœuds reliés
// par des lignes qui se dessinent, avec de petits "paquets" qui circulent
// le long des connexions — la métaphore visuelle de l'automatisation,
// sans tomber dans les clichés "tech" (pas de code qui défile, pas de
// robot). Décoratif et discret : opacité faible, ne gêne jamais la
// lecture du texte posé par-dessus.

const NODES: { x: number; y: number }[] = [
  { x: 120, y: 130 },
  { x: 340, y: 70 },
  { x: 560, y: 190 },
  { x: 820, y: 90 },
  { x: 1060, y: 210 },
  { x: 160, y: 430 },
  { x: 420, y: 530 },
  { x: 700, y: 470 },
  { x: 950, y: 560 },
  { x: 1080, y: 410 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [1, 6],
  [2, 6],
  [3, 7],
  [4, 8],
  [4, 9],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
];

// Un sous-ensemble d'arêtes porte un "paquet" voyageur, pour ne pas
// surcharger l'animation.
const FLOWING_EDGE_INDEXES = [0, 2, 4, 6, 8, 10, 12];

export default function NetworkBackground() {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-40"
      aria-hidden="true"
    >
      {EDGES.map(([a, b], index) => {
        const from = NODES[a];
        const to = NODES[b];
        return (
          <motion.line
            key={`edge-${index}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(180, 165, 255, 0.35)"
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }}
          />
        );
      })}

      {FLOWING_EDGE_INDEXES.map((edgeIndex) => {
        const [a, b] = EDGES[edgeIndex];
        const from = NODES[a];
        const to = NODES[b];
        return (
          <motion.circle
            key={`flow-${edgeIndex}`}
            r={2.5}
            fill="#ffffff"
            initial={{ cx: from.x, cy: from.y, opacity: 0 }}
            animate={{
              cx: [from.x, to.x],
              cy: [from.y, to.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatDelay: 1.4,
              delay: edgeIndex * 0.35,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {NODES.map((node, index) => (
        <motion.circle
          key={`node-${index}`}
          cx={node.x}
          cy={node.y}
          r={5}
          fill="#ffffff"
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.85, 1.05, 0.85] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: index * 0.25,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        />
      ))}
    </svg>
  );
}

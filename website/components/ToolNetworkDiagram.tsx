"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  LayoutGrid,
  ListChecks,
  MessageSquare,
} from "lucide-react";

// Diagramme visuel "avant / après" pour l'étude de cas — 5 icônes d'outils
// reliées en désordre par des lignes rouges cassées (avant), puis les
// mêmes icônes reliées proprement à un point central par des lignes
// vertes (après). Remplace les deux listes à puces par une lecture
// immédiate de ce qui a changé.

const TOOL_ICONS = [Database, ListChecks, Cloud, MessageSquare, LayoutGrid];

// Positions sur un cercle (5 points), calculées une fois.
const ANGLES = [-90, -18, 54, 126, 198];
const RADIUS = 34;
const NODES = ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad) * RADIUS, y: Math.sin(rad) * RADIUS };
});

// Connexions "en désordre" façon pentagramme : chaque nœud relié à un
// autre non-adjacent, pour que les lignes se croisent visuellement.
const CHAOTIC_LINKS: [number, number][] = [
  [0, 2],
  [2, 4],
  [4, 1],
  [1, 3],
  [3, 0],
];

export default function ToolNetworkDiagram({
  variant,
}: {
  variant: "before" | "after";
}) {
  const isAfter = variant === "after";

  return (
    <svg viewBox="-50 -50 100 100" className="mx-auto h-40 w-40" aria-hidden="true">
      {isAfter ? (
        <>
          {NODES.map((n, i) => (
            <motion.line
              key={i}
              x1={0}
              y1={0}
              x2={n.x}
              y2={n.y}
              strokeWidth={1.5}
              className="stroke-accent-light"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
            />
          ))}
          <motion.circle
            cx={0}
            cy={0}
            r={5}
            className="fill-accent"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </>
      ) : (
        CHAOTIC_LINKS.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            className="stroke-red-400/70"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
        ))
      )}

      {NODES.map((n, i) => {
        const Icon = TOOL_ICONS[i];
        return (
          <g key={i} transform={`translate(${n.x - 8}, ${n.y - 8})`}>
            <rect
              width={16}
              height={16}
              rx={4}
              className={
                isAfter
                  ? "fill-surface stroke-accent-light"
                  : "fill-surface stroke-red-300"
              }
              strokeWidth={1}
            />
            <foreignObject width={16} height={16}>
              <div className="flex h-full w-full items-center justify-center">
                <Icon
                  className={
                    isAfter
                      ? "h-2.5 w-2.5 text-accent-dark"
                      : "h-2.5 w-2.5 text-red-400"
                  }
                />
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

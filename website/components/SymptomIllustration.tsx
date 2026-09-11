"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileText, RefreshCw, User } from "lucide-react";

// Trois petites illustrations animées, une par symptôme — construites en
// SVG/icônes (cohérent avec le reste du site : NetworkBackground,
// FlowDiagram...), pas des photos. `size` (en px, référence 96) permet de
// les réutiliser aussi bien en petit badge que comme grande illustration
// dans le carrousel — tout est calculé proportionnellement.

interface IllustrationProps {
  size: number;
}

const BASE = 96;

function RepetitiveTasks({ size }: IllustrationProps) {
  const scale = size / BASE;
  const iconSize = 32 * scale;
  const ghostSize = 40 * scale;
  return (
    <div
      className="relative mx-auto flex items-center justify-center rounded-full bg-primary/[0.07]"
      style={{ width: size, height: size }}
    >
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
          <RefreshCw style={{ width: ghostSize, height: ghostSize }} />
        </motion.span>
      ))}
      <motion.span
        className="relative text-primary-dark"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw style={{ width: iconSize, height: iconSize }} />
      </motion.span>
    </div>
  );
}

function ScatteredInfo({ size }: IllustrationProps) {
  const scale = size / BASE;
  const fileSize = 24 * scale;
  const alertSize = 28 * scale;
  const files = [
    { x: -20, y: -14, rotate: -12, delay: 0 },
    { x: 18, y: -18, rotate: 10, delay: 0.3 },
    { x: -16, y: 16, rotate: 8, delay: 0.6 },
    { x: 20, y: 14, rotate: -8, delay: 0.9 },
  ];
  return (
    <div
      className="relative mx-auto flex items-center justify-center rounded-full bg-primary/[0.07]"
      style={{ width: size, height: size }}
    >
      {files.map((f, i) => {
        const x = f.x * scale;
        const y = f.y * scale;
        return (
          <motion.span
            key={i}
            className="absolute text-primary/30"
            style={{ x, y, rotate: f.rotate }}
            animate={{ y: [y, y - 5 * scale, y] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: f.delay,
              ease: "easeInOut",
            }}
          >
            <FileText style={{ width: fileSize, height: fileSize }} />
          </motion.span>
        );
      })}
      <motion.span
        className="relative text-primary-dark"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlertCircle style={{ width: alertSize, height: alertSize }} />
      </motion.span>
    </div>
  );
}

function SinglePointOfFailure({ size }: IllustrationProps) {
  const scale = size / BASE;
  const userSize = 36 * scale;
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
        className="relative flex items-center justify-center rounded-full bg-primary-dark text-white"
        style={{ width: userSize, height: userSize }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(43,32,100,0.35)",
            "0 0 0 8px rgba(43,32,100,0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      >
        <User style={{ width: userSize * 0.45, height: userSize * 0.45 }} />
      </motion.span>
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

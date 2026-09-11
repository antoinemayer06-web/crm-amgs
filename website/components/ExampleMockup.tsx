"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Database,
  FileSpreadsheet,
  FileText,
  Layers,
  Receipt,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

// Mini-mockups stylisés au-dessus de chaque carte "types de systèmes" —
// une scène compacte (icônes + connexions animées), pas juste une icône
// isolée, pour donner une lecture visuelle immédiate du type de système.
// Tout reste sobre : palette du site, pas de photo, pas de skeuomorphisme.

const NODE =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-surface text-primary-dark shadow-sm";

function FlowingArrow({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative flex w-6 items-center justify-center">
      <div className="h-px w-full bg-primary/20" />
      <motion.span
        className="absolute h-1.5 w-1.5 rounded-full bg-primary"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 1.6, repeat: Infinity, delay, ease: "linear" }}
      />
    </div>
  );
}

// 1. Connexion d'outils entre eux
function ToolConnection() {
  return (
    <div className="flex items-center justify-center gap-0">
      <div className={NODE}>
        <Layers className="h-4 w-4" />
      </div>
      <FlowingArrow />
      <div className={NODE}>
        <RefreshCw className="h-4 w-4" />
      </div>
      <FlowingArrow delay={0.5} />
      <div className={NODE}>
        <Layers className="h-4 w-4" />
      </div>
    </div>
  );
}

// 2. Sites/formulaires reliés à une base de données
function FormToDatabase() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex h-14 w-16 flex-col gap-1.5 rounded-lg border border-primary/20 bg-surface p-2 shadow-sm">
        <div className="h-1.5 w-3/4 rounded-full bg-primary/25" />
        <div className="h-1.5 w-full rounded-full bg-silver/70" />
        <div className="h-1.5 w-2/3 rounded-full bg-silver/70" />
      </div>
      <FlowingArrow />
      <div className={NODE}>
        <Database className="h-4 w-4" />
      </div>
    </div>
  );
}

// 3. Dashboards de pilotage automatiques
function DashboardPreview() {
  const bars = [0.4, 0.7, 0.5, 0.9, 0.6];
  return (
    <div className="mx-auto flex h-14 w-28 items-end gap-1 rounded-lg border border-primary/20 bg-surface p-2 shadow-sm">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm bg-primary/40"
          style={{ height: `${h * 100}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// 4. Automatisations Microsoft 365 (chaîne façon Power Automate)
function M365Chain() {
  return (
    <div className="flex items-center justify-center gap-0">
      <div className={NODE}>
        <FileSpreadsheet className="h-4 w-4" />
      </div>
      <FlowingArrow />
      <div className={NODE}>
        <Workflow className="h-4 w-4" />
      </div>
      <FlowingArrow delay={0.5} />
      <div className={NODE}>
        <Send className="h-4 w-4" />
      </div>
    </div>
  );
}

// 5. Automatisation administrative & financière (facture envoyée)
function InvoiceSend() {
  return (
    <div className="relative flex items-center justify-center gap-3">
      <div className={NODE}>
        <Receipt className="h-4 w-4" />
      </div>
      <div className="relative w-10">
        <div className="h-px w-full bg-primary/20" />
        <motion.span
          className="absolute -top-2 text-primary"
          animate={{ left: ["0%", "90%"], opacity: [1, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
        >
          <Send className="h-3.5 w-3.5" />
        </motion.span>
      </div>
      <div className={NODE}>
        <FileText className="h-4 w-4" />
      </div>
    </div>
  );
}

// 6. Suivi de charge d'équipe (mini jauges par personne)
function WorkloadGauges() {
  const people = [0.85, 0.55, 0.3];
  return (
    <div className="mx-auto flex w-32 flex-col gap-2">
      {people.map((load, i) => (
        <div key={i} className="flex items-center gap-2">
          <Users className="h-3 w-3 shrink-0 text-primary-dark" />
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-primary/50"
              initial={{ width: 0 }}
              animate={{ width: `${load * 100}%` }}
              transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// 7. Intégration de l'IA pour les entreprises
function AiIntegration() {
  return (
    <div className="flex items-center justify-center gap-0">
      <div className={NODE}>
        <FileText className="h-4 w-4" />
      </div>
      <FlowingArrow />
      <motion.div
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm"
        animate={{ boxShadow: ["0 0 0 0 rgba(76,58,161,0.3)", "0 0 0 6px rgba(76,58,161,0)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>
    </div>
  );
}

const MOCKUPS = [
  ToolConnection,
  FormToDatabase,
  DashboardPreview,
  M365Chain,
  InvoiceSend,
  WorkloadGauges,
  AiIntegration,
];

export default function ExampleMockup({ index }: { index: number }) {
  const Mockup = MOCKUPS[index] ?? MOCKUPS[0];
  return (
    <div className="flex h-16 items-center justify-center">
      <Mockup />
    </div>
  );
}

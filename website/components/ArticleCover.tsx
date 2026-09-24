import {
  BarChart3,
  Bot,
  LayoutGrid,
  Link2,
  MapPin,
  Puzzle,
  RefreshCw,
  Search,
  Table,
  type LucideIcon,
} from "lucide-react";
import type { Article } from "@/lib/blog";

// Pas de photographie dédiée par article pour l'instant — même logique que
// les autres emplacements visuels du site en attente d'un asset définitif
// (cartes de Solutions.tsx, vidéos de Symptoms.tsx) : un repère visuel
// cohérent avec la charte (icône + dégradé), pas un cadre vide.
const ICONS: Record<Article["icon"], LucideIcon> = {
  "map-pin": MapPin,
  "refresh-cw": RefreshCw,
  "link-2": Link2,
  table: Table,
  search: Search,
  "bar-chart-3": BarChart3,
  puzzle: Puzzle,
  "layout-grid": LayoutGrid,
  bot: Bot,
};

const GRADIENTS = [
  "from-primary/15 to-primary-dark/5",
  "from-accent/15 to-primary/5",
  "from-primary-light/20 to-primary-dark/5",
];

export default function ArticleCover({
  article,
  variant = 0,
  className = "",
}: {
  article: Article;
  variant?: number;
  className?: string;
}) {
  const Icon = ICONS[article.icon];
  const gradient = GRADIENTS[variant % GRADIENTS.length];

  return (
    <div
      className={`relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <Icon className="h-12 w-12 text-primary-dark/40" strokeWidth={1.5} />
    </div>
  );
}

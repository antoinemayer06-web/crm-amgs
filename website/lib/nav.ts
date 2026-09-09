import { PILLARS } from "@/lib/content";

// Navigation partagée entre le Header et le Footer. Dans un fichier séparé
// (sans "use client") pour rester importable depuis des composants serveur
// comme Footer.tsx.

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Services",
    href: PILLARS[0].href,
    children: PILLARS.map((p) => ({ label: p.navLabel, href: p.href })),
  },
  { label: "Étude de cas", href: "/etude-de-cas-ecodden" },
  { label: "Comment ça marche", href: "/comment-ca-marche" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Blog", href: "/blog" },
  { label: "À propos", href: "/a-propos" },
];

// Liste plate pour le footer (maillage interne complet, y compris Contact
// qui n'apparaît dans le header que comme bouton CTA, pas comme lien nav).
export const FOOTER_LINKS: NavLink[] = [
  ...NAV_ITEMS.flatMap((item) => item.children ?? [item]),
  { label: "Contact", href: "/contact" },
];

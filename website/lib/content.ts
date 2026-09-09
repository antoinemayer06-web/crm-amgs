// Contenu structuré partagé entre l'accueil, les pages piliers, l'étude de
// cas et les tarifs — une seule source de vérité pour ces faits/chiffres,
// répétés sur plusieurs pages (maillage interne, cohérence des chiffres).

export const PILLARS = [
  {
    slug: "automatisation-gestion-projet",
    href: "/automatisation-gestion-projet",
    keyword: "automatisation gestion de projet",
    navLabel: "Automatisation gestion de projet",
    title: "Automatisation de la gestion de projet",
    shortDescription:
      "Création automatique de dossiers et tâches, synchronisation CRM ↔ outil de gestion, plans de charge en temps réel.",
    bullets: [
      "Création automatique de dossiers, tâches et notifications dès qu'un nouveau projet est ouvert dans le CRM",
      "Synchronisation entre le CRM et l'outil de gestion de tâches (ex. Axonaut ↔ ClickUp, HubSpot ↔ Monday)",
      "Plans de charge automatiques : visibilité en temps réel sur la charge de travail de chaque membre de l'équipe",
    ],
  },
  {
    slug: "automatisation-administrative-financiere",
    href: "/automatisation-administrative-financiere",
    keyword: "optimisation processus administratifs PME",
    navLabel: "Automatisation administrative & financière",
    title: "Automatisation administrative & financière",
    shortDescription:
      "Devis et factures générés depuis le CRM, relances automatiques, reporting envoyé au dirigeant sans qu'il ait à le demander.",
    bullets: [
      "Génération automatique de devis/factures depuis le CRM sans ressaisie",
      "Relances automatiques de factures impayées",
      "Synchronisation CRM ↔ outil de comptabilité",
      "Reporting automatique : tableaux de bord et rapports périodiques envoyés par email au dirigeant",
    ],
  },
] as const;

export const CASE_STUDY = {
  client: "EcoDDen",
  sector: "bureau d'études",
  href: "/etude-de-cas-ecodden",
  missions: [
    {
      label: "Mission 1",
      price: "3 500€ HT",
      quotedDelay: "3-4 semaines",
      actualDelay: "1 semaine et demie",
    },
    {
      label: "Mission 2",
      price: "1 800€ HT",
      quotedDelay: null,
      actualDelay: "~4 jours",
      note: "Automatisation complète",
    },
  ],
  toolsConnected: 5,
  problem:
    "Un jonglage quotidien entre CRM, gestion de tâches, stockage cloud, messagerie et suite collaborative — avec de la ressaisie manuelle à chaque étape et aucune vue d'ensemble sur la charge de travail réelle de l'équipe.",
  result:
    "Suppression totale de la double saisie entre les 5 outils, et visibilité automatique et centralisée sur la charge de travail de toute l'équipe.",
} as const;

export const PRICING_TIERS = [
  {
    label: "Audit / diagnostic seul",
    from: "300€",
    description:
      "Analyse de votre fonctionnement actuel et identification de ce qui peut être automatisé.",
  },
  {
    label: "Automatisation simple",
    from: "800€",
    description: "1 workflow, 2 outils connectés entre eux.",
  },
  {
    label: "Automatisation de gestion de projet",
    from: "1 800€",
    description:
      "Création automatique de dossiers/tâches, synchronisation CRM ↔ gestion de projet, plan de charge.",
  },
  {
    label: "Système multi-outils complexe",
    from: "3 500€",
    description:
      "Plusieurs outils connectés, automatisations en cascade — sur mesure selon votre fonctionnement.",
  },
  {
    label: "Suivi mensuel / maintenance",
    from: "200€/mois",
    description: "Ajustements et évolutions du système au fil du temps.",
  },
] as const;

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
      "Workflows Power Automate ou formulaires Microsoft Forms qui déclenchent la création d'un dossier ou d'une tâche sans action manuelle",
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
      "Reporting automatique : tableaux de bord Power BI ou fichiers Excel avancés, générés et envoyés sans compilation manuelle",
    ],
  },
] as const;

export const CASE_STUDY = {
  sector: "bureau d'études",
  href: "/etude-de-cas",
  missions: [
    {
      label: "Mission 1",
      quotedDelay: "3-4 semaines",
      actualDelay: "1 semaine et demie",
    },
    {
      label: "Mission 2",
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

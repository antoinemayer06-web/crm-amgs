// Contenu structuré partagé entre l'accueil, la page projets et les
// tarifs — une seule source de vérité pour ces faits/chiffres, répétés
// sur plusieurs pages (maillage interne, cohérence des chiffres).

export const CASE_STUDY = {
  sector: "bureau d'études",
  href: "/nos-derniers-projets",
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

// Titres des 7 types de solutions détaillés sur /services — réutilisés tels
// quels dans la liste courte de clôture de /nos-derniers-projets pour ne
// pas dupliquer les libellés à deux endroits.
export const SERVICE_TYPES = [
  "Connexion d'outils entre eux",
  "Sites ou formulaires reliés à une base de données",
  "Dashboards de pilotage automatiques",
  "Automatisations Microsoft 365",
  "Automatisation administrative & financière",
  "Suivi de charge d'équipe",
  "Agents & assistants IA",
] as const;

// Configuration du quiz "diagnostic d'automatisation" (/diagnostic) : les
// 6 questions, le calcul du score et le contenu du résultat. Séparé du
// composant pour que la logique de scoring reste testable/lisible
// indépendamment du JSX.

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: "company-size" | "tools" | "time-lost" | "pain-point" | "budget" | "timeline";
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "company-size",
    question: "Combien de personnes travaillent dans votre entreprise ?",
    options: [
      { value: "1-5", label: "1 à 5" },
      { value: "6-15", label: "6 à 15" },
      { value: "16-30", label: "16 à 30" },
      { value: "30+", label: "Plus de 30" },
    ],
  },
  {
    id: "tools",
    question: "Comment gérez-vous vos projets et vos clients aujourd'hui ?",
    options: [
      { value: "excel-papier", label: "Excel ou papier" },
      { value: "un-outil", label: "Un seul outil (CRM ou gestion de projet)" },
      {
        value: "outils-deconnectes",
        label: "Plusieurs outils, mais ils ne se parlent pas entre eux",
      },
      { value: "systeme-connecte", label: "Un système déjà bien connecté" },
    ],
  },
  {
    id: "time-lost",
    question:
      "Combien de temps par semaine estimez-vous perdre sur des tâches répétitives (ressaisie, relances, suivi manuel) ?",
    options: [
      { value: "moins-2h", label: "Moins de 2h" },
      { value: "2-5h", label: "2 à 5h" },
      { value: "5-10h", label: "5 à 10h" },
      { value: "plus-10h", label: "Plus de 10h" },
    ],
  },
  {
    id: "pain-point",
    question: "Qu'est-ce qui vous fait le plus perdre du temps aujourd'hui ?",
    options: [
      { value: "ressaisie", label: "Ressaisir la même info dans plusieurs outils" },
      { value: "charge-equipe", label: "Suivre la charge de travail de l'équipe" },
      { value: "facturation", label: "Facturation, devis, relances" },
      { value: "rapports", label: "Compiler des rapports à la main" },
    ],
  },
  {
    id: "budget",
    question: "Avez-vous déjà une idée de budget pour résoudre ça ?",
    options: [
      { value: "pas-reflechi", label: "Pas encore réfléchi" },
      { value: "moins-1500", label: "Moins de 1500€" },
      { value: "1500-3500", label: "Entre 1500€ et 3500€" },
      { value: "plus-3500", label: "Plus de 3500€" },
    ],
  },
  {
    id: "timeline",
    question: "Sous quel délai aimeriez-vous agir ?",
    options: [
      { value: "urgent", label: "Urgent, dans le mois" },
      { value: "3-mois", label: "Dans les 3 prochains mois" },
      { value: "renseigne", label: "Je me renseigne pour l'instant" },
    ],
  },
];

export type Answers = Partial<Record<QuizQuestion["id"], string>>;

// Score calculé à partir des réponses 2 (tools), 3 (time-lost) et 4
// (pain-point) — celles qui reflètent réellement l'ampleur du problème.
// Les 3 autres (taille, budget, délai) qualifient le lead pour le suivi
// commercial mais ne changent pas le niveau affiché.
const TOOLS_SCORE: Record<string, number> = {
  "excel-papier": 2,
  "un-outil": 1,
  "outils-deconnectes": 3,
  "systeme-connecte": 0,
};

const TIME_LOST_SCORE: Record<string, number> = {
  "moins-2h": 0,
  "2-5h": 1,
  "5-10h": 2,
  "plus-10h": 3,
};

const PAIN_POINT_SCORE: Record<string, number> = {
  ressaisie: 3,
  "charge-equipe": 2,
  facturation: 3,
  rapports: 2,
};

const MAX_SCORE = 3 + 3 + 3;

export type Level = "low" | "moderate" | "high";

export const LEVELS: Record<
  Level,
  { label: string; badgeClasses: string }
> = {
  low: {
    label: "Potentiel limité pour l'instant",
    badgeClasses: "border-border bg-surface text-muted",
  },
  moderate: {
    label: "Un vrai potentiel d'automatisation",
    badgeClasses: "border-primary/30 bg-primary/10 text-primary-dark",
  },
  high: {
    label: "Fort potentiel — plusieurs automatisations rentables rapidement",
    badgeClasses: "border-accent/30 bg-accent/10 text-accent-dark",
  },
};

// Réponse à la question 4 -> phrase personnalisée + lien vers la section
// /services correspondante (ancres posées sur app/services/page.tsx).
export const PAIN_POINT_DETAIL: Record<
  string,
  { phrase: string; serviceLabel: string; serviceHref: string }
> = {
  ressaisie: {
    phrase:
      "La connexion de vos outils entre eux serait probablement votre priorité n°1.",
    serviceLabel: "Connexion d'outils entre eux",
    serviceHref: "/services#solution-1-connexion-outils",
  },
  "charge-equipe": {
    phrase:
      "Un plan de charge automatique serait probablement votre priorité n°1.",
    serviceLabel: "Suivi de charge d'équipe",
    serviceHref: "/services#solution-6-charge-equipe",
  },
  facturation: {
    phrase:
      "L'automatisation de votre facturation et de vos relances serait probablement votre priorité n°1.",
    serviceLabel: "Automatisation administrative & financière",
    serviceHref: "/services#solution-5-administratif-financier",
  },
  rapports: {
    phrase:
      "Un dashboard de pilotage automatique serait probablement votre priorité n°1.",
    serviceLabel: "Dashboards de pilotage automatiques",
    serviceHref: "/services#solution-3-dashboards",
  },
};

export function computeLevel(answers: Answers): Level {
  const score =
    (TOOLS_SCORE[answers.tools ?? ""] ?? 0) +
    (TIME_LOST_SCORE[answers["time-lost"] ?? ""] ?? 0) +
    (PAIN_POINT_SCORE[answers["pain-point"] ?? ""] ?? 0);

  const ratio = score / MAX_SCORE;
  if (ratio < 0.4) return "low";
  if (ratio < 0.75) return "moderate";
  return "high";
}

// Réponses lisibles (label de la question + label choisi) pour l'e-mail
// envoyé côté admin — évite de faire porter cette traduction à l'API.
export function readableAnswers(
  answers: Answers
): { question: string; answer: string }[] {
  return QUIZ_QUESTIONS.map((q) => {
    const value = answers[q.id];
    const option = q.options.find((o) => o.value === value);
    return { question: q.question, answer: option?.label ?? "—" };
  });
}

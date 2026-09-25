// Configuration du quiz "diagnostic d'automatisation" (/diagnostic) : les
// 8 questions, les réactions contextuelles, le calcul du score et le
// contenu de l'écran de résultat. Séparé du composant pour que la logique
// reste lisible indépendamment du JSX.

export interface QuizOption {
  value: string;
  label: string;
}

interface BaseQuestion {
  question: string;
  options: QuizOption[];
}

export interface SingleQuestion extends BaseQuestion {
  id:
    | "company-size"
    | "tools"
    | "time-lost"
    | "self-fix"
    | "admin-burden"
    | "budget"
    | "timeline";
  type: "single";
}

export interface MultiQuestion extends BaseQuestion {
  id: "pain-points";
  type: "multi";
}

export type QuizQuestion = SingleQuestion | MultiQuestion;

export interface Answers {
  "company-size"?: string;
  tools?: string;
  "time-lost"?: string;
  "self-fix"?: string;
  "admin-burden"?: string;
  "pain-points"?: string[];
  budget?: string;
  timeline?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "company-size",
    type: "single",
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
    type: "single",
    question: "Comment gérez-vous vos projets et vos clients aujourd'hui ?",
    options: [
      { value: "excel-papier", label: "Excel ou papier" },
      { value: "un-outil", label: "Un seul outil" },
      {
        value: "outils-deconnectes",
        label: "Plusieurs outils, mais ils ne se parlent pas entre eux",
      },
      { value: "systeme-connecte", label: "Un système déjà bien connecté" },
    ],
  },
  {
    id: "time-lost",
    type: "single",
    question:
      "Combien de temps par semaine perdez-vous sur des tâches répétitives ?",
    options: [
      { value: "moins-2h", label: "Moins de 2h" },
      { value: "2-5h", label: "2 à 5h" },
      { value: "5-10h", label: "5 à 10h" },
      { value: "plus-10h", label: "Plus de 10h" },
    ],
  },
  {
    id: "self-fix",
    type: "single",
    question: "Avez-vous déjà essayé de régler ça vous-même ?",
    options: [
      { value: "pas-fini", label: "Oui, mais je n'ai jamais eu le temps de finir" },
      { value: "bancal", label: "Oui, mais le résultat est resté bancal" },
      { value: "jamais-touche", label: "Non, je n'y ai jamais touché" },
      { value: "pas-mon-domaine", label: "Non, ce n'est pas mon domaine" },
    ],
  },
  {
    id: "admin-burden",
    type: "single",
    question: "À quel point l'administratif est un poids pour vous aujourd'hui ?",
    options: [
      { value: "gerable", label: "Gérable, ça passe" },
      { value: "penible", label: "Franchement pénible, mais je fais avec" },
      {
        value: "poids-mental",
        label: "Un vrai poids mental, j'y pense même en dehors du travail",
      },
      {
        value: "empeche-concentration",
        label: "Ça m'empêche de me concentrer sur mon métier",
      },
    ],
  },
  {
    id: "pain-points",
    type: "multi",
    question: "Qu'est-ce qui vous fait perdre du temps ? Cochez tout ce qui s'applique.",
    options: [
      { value: "ressaisie", label: "Ressaisir la même info dans plusieurs outils" },
      { value: "charge-equipe", label: "Suivre la charge de travail de l'équipe" },
      { value: "facturation", label: "Facturation, devis, relances" },
      { value: "rapports", label: "Compiler des rapports à la main" },
    ],
  },
  {
    id: "budget",
    type: "single",
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
    type: "single",
    question: "Sous quel délai aimeriez-vous agir ?",
    options: [
      { value: "urgent", label: "Urgent, dans le mois" },
      { value: "3-mois", label: "Dans les 3 prochains mois" },
      { value: "renseigne", label: "Je me renseigne pour l'instant" },
    ],
  },
];

// Réactions contextuelles affichées sous les options, une fois une
// réponse choisie — jamais pour les questions 1 et 7 (aucune n'y a de
// contenu défini ci-dessous).
export const TOOLS_REACTIONS: Record<string, string> = {
  "outils-deconnectes": "Le point commun de 9 PME sur 10 qu'on rencontre.",
};

export const TIME_LOST_REACTIONS: Record<string, string> = {
  "moins-2h":
    "Sur une année, ça représente tout de même environ 10 jours de travail.",
  "2-5h": "Sur une année, ça représente environ 10 à 30 jours de travail.",
  "5-10h":
    "Sur une année, ça représente environ 30 à 60 jours de travail. Plus d'un mois entier.",
  "plus-10h":
    "Sur une année, ça représente plus de 60 jours de travail — près de trois mois entiers.",
};

export const TIME_LOST_DISCLAIMER =
  "Estimation basée sur 46 semaines travaillées par an — pas un chiffre garanti.";

export const SELF_FIX_REACTIONS: Record<string, string> = {
  "pas-fini":
    "Normal. Ce n'est pas votre métier — c'est le nôtre. On a déjà fait toutes les erreurs à votre place.",
  bancal:
    "C'est le problème classique du fait-maison : ça marche, jusqu'au jour où ça casse. On construit pour que ça tienne.",
  "jamais-touche":
    "Le temps que vous auriez passé à apprendre, tester, corriger — on l'a déjà fait, des dizaines de fois.",
  "pas-mon-domaine": "Tant mieux — c'est le nôtre.",
};

export const ADMIN_BURDEN_REACTIONS: Record<string, string> = {
  gerable: "Tant mieux. Il reste sûrement des points ponctuels à améliorer.",
  penible: "C'est exactement le genre de charge qu'on retire en quelques jours.",
  "poids-mental":
    "C'est le signal le plus clair qu'il est temps d'arrêter de porter ça seul.",
  "empeche-concentration":
    "C'est précisément le problème qu'on résout : vous rendre votre métier, en vous retirant tout le reste.",
};

export const TIMELINE_REACTIONS: Record<string, string> = {
  urgent:
    "Bonne nouvelle : c'est exactement le type de mission qu'on traite en priorité.",
};

export function painPointsReaction(count: number): string | null {
  if (count >= 2) {
    return "Ce n'est pas un détail isolé. C'est un problème structurel — et ça se résout d'un coup, pas case par case.";
  }
  if (count === 1) {
    return "Un point précis à corriger. Ça se règle vite.";
  }
  return null;
}

// Score calculé à partir des réponses 2 (tools), 3 (time-lost), 4
// (self-fix), 5 (admin-burden — poids fort pour "vrai poids mental" et
// "m'empêche de me concentrer") et 6 (pain-points, où plus de cases
// cochées fait monter le score). Les 3 autres (taille, budget, délai)
// qualifient le lead pour le suivi commercial mais ne changent pas le
// niveau affiché.
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

const SELF_FIX_SCORE: Record<string, number> = {
  "pas-fini": 1,
  bancal: 3,
  "jamais-touche": 1,
  "pas-mon-domaine": 0,
};

const ADMIN_BURDEN_SCORE: Record<string, number> = {
  gerable: 0,
  penible: 1,
  "poids-mental": 3,
  "empeche-concentration": 3,
};

const MAX_SCORE = 3 + 3 + 3 + 3 + 3;

export type Level = "low" | "moderate" | "high";

export const LEVELS: Record<Level, { label: string; badgeClasses: string }> = {
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

// Contenu "closing" de l'écran de résultat, calibré par niveau — le texte
// varie selon le score, mais le CTA qui suit est le même pour tout le
// monde : un seul bouton vers le formulaire nom/email/téléphone qui envoie
// la demande au CRM (voir DiagnosticQuiz.tsx). Calendly n'apparaît qu'après
// l'envoi, sur l'écran de remerciement.
export const RESULT_CONTENT: Record<Level, { title: string; text: string }> = {
  low: {
    title: "Pour l'instant, ce n'est probablement pas votre priorité n°1.",
    text: "Et c'est très bien ainsi. Gardez cette page sous le coude — le jour où ça change, on sera là.",
  },
  moderate: {
    title: "Il y a clairement matière à automatiser chez vous.",
    text: "Peut-être pas tout, mais certains points identifiés ici valent le coup d'être creusés. Un appel rapide suffit pour savoir lesquels.",
  },
  high: {
    title:
      "Vous perdez du temps et de l'argent, chaque semaine, sur des choses qui peuvent tourner toutes seules.",
    text: "Ce que vous venez de décrire, on le résout en quelques jours, pas en plusieurs mois d'essais. La prochaine étape logique : un appel de 20 minutes pour voir exactement par où commencer.",
  },
};

function rawScore(answers: Answers): number {
  return (
    (TOOLS_SCORE[answers.tools ?? ""] ?? 0) +
    (TIME_LOST_SCORE[answers["time-lost"] ?? ""] ?? 0) +
    (SELF_FIX_SCORE[answers["self-fix"] ?? ""] ?? 0) +
    (ADMIN_BURDEN_SCORE[answers["admin-burden"] ?? ""] ?? 0) +
    Math.min(answers["pain-points"]?.length ?? 0, 3)
  );
}

export function computeLevel(answers: Answers): Level {
  const ratio = rawScore(answers) / MAX_SCORE;
  if (ratio < 0.4) return "low";
  if (ratio < 0.75) return "moderate";
  return "high";
}

// Score 0-100 transmis au CRM (demandes_site.score) — même calcul que
// computeLevel, exprimé en pourcentage plutôt qu'en palier.
export function computeScore(answers: Answers): number {
  return Math.round((rawScore(answers) / MAX_SCORE) * 100);
}

// Réponses lisibles (label de la question + label(s) choisi(s)) pour
// l'e-mail envoyé côté admin — les cases cochées en Q6 sont jointes en une
// seule ligne.
export function readableAnswers(
  answers: Answers
): { question: string; answer: string }[] {
  return QUIZ_QUESTIONS.map((q) => {
    if (q.type === "multi") {
      const values = answers["pain-points"] ?? [];
      const labels = values.map(
        (v) => q.options.find((o) => o.value === v)?.label ?? v
      );
      return { question: q.question, answer: labels.length ? labels.join(", ") : "—" };
    }
    const value = answers[q.id];
    const option = q.options.find((o) => o.value === value);
    return { question: q.question, answer: option?.label ?? "—" };
  });
}

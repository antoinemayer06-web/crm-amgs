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

// Réactions contextuelles affichées sous les options, une fois une réponse
// choisie — une réaction par option, pour toutes les questions (y compris
// taille d'entreprise et budget, qui n'en avaient pas auparavant).
export const COMPANY_SIZE_REACTIONS: Record<string, string> = {
  "1-5":
    "Petite équipe : chaque heure gagnée pèse lourd, personne n'est là pour absorber le surplus.",
  "6-15":
    "Une taille où l'organisation informelle commence souvent à atteindre ses limites : ce qui tenait par habitude finit par craquer.",
  "16-30":
    "À cette taille, un oubli ou une ressaisie se répercute sur plusieurs personnes à la fois.",
  "30+":
    "Plus l'équipe est grande, plus le coût des frictions se multiplie. Un système bien pensé devient un vrai levier.",
};

export const TOOLS_REACTIONS: Record<string, string> = {
  "excel-papier":
    "Souple, mais tout repose sur la rigueur et la mémoire de chacun. C'est là qu'un système apporte le plus de fiabilité.",
  "un-outil":
    "Bonne base. Le gain se trouve dans tout ce qui l'entoure (facturation, suivi, reporting) et qui reste manuel.",
  "outils-deconnectes":
    "Une situation très fréquente en PME : chaque outil fait son travail, mais c'est vous qui faites le lien entre eux.",
  "systeme-connecte":
    "Vous avez de l'avance. Le gain se joue sur les derniers points manuels et sur la fiabilité dans la durée.",
};

export const TIME_LOST_REACTIONS: Record<string, string> = {
  "moins-2h":
    "Ça paraît peu, mais sur une année, ça représente jusqu'à 10 jours de travail.",
  "2-5h":
    "Entre 10 et 30 jours de travail par an, passés sur des tâches qui ne font pas avancer votre entreprise.",
  "5-10h":
    "Entre 30 et 60 jours par an. Un à deux mois de travail, chaque année, absorbés par du répétitif.",
  "plus-10h":
    "Plus de 55 jours par an, soit près de deux mois de travail au minimum. Probablement davantage.",
};

export const TIME_LOST_DISCLAIMER =
  "Estimation basée sur 46 semaines travaillées par an et des journées de 8h. Un ordre de grandeur, pas un chiffre garanti.";

export const SELF_FIX_REACTIONS: Record<string, string> = {
  "pas-fini":
    "Normal : ce n'est pas votre métier et ça ne devrait pas le devenir. On a l'habitude de reprendre ce type de chantier là où il s'est arrêté.",
  bancal:
    "Le fait-maison tient tant que personne n'y touche, puis casse au pire moment. On construit pour que ça tienne, et on suit le système après la livraison.",
  "jamais-touche":
    "Vous n'avez rien à apprendre ni à tester : ces essais et ces erreurs, on les a déjà traversés sur d'autres projets.",
  "pas-mon-domaine": "Tant mieux. Vous restez sur votre métier, on prend le reste.",
};

export const ADMIN_BURDEN_REACTIONS: Record<string, string> = {
  gerable: "Tant mieux. Il reste probablement quelques points précis à alléger.",
  penible:
    "C'est exactement le genre de charge qu'on retire en quelques jours, sans bouleverser vos habitudes.",
  "poids-mental":
    "C'est le signal qu'il est temps d'arrêter de tout porter seul. Un système fiable libère aussi l'esprit, pas seulement l'agenda.",
  "empeche-concentration":
    "C'est précisément ce qu'on résout : vous rendre votre métier en vous retirant tout le reste.",
};

// Réactions individuelles Q6 — une par case cochée, empilées sous la
// liste ; elles disparaissent dès que la case correspondante est
// décochée (voir DiagnosticQuiz.tsx).
export const PAIN_POINT_REACTIONS: Record<string, string> = {
  ressaisie: "Chaque recopie est une occasion d'erreur, et personne ne les compte.",
  "charge-equipe":
    "Sans vue en temps réel, on découvre les surcharges quand il est déjà trop tard.",
  facturation: "Une relance oubliée, c'est de la trésorerie qui dort.",
  rapports: "Un rapport compilé à la main est périmé le jour où il est terminé.",
};

export const BUDGET_REACTIONS: Record<string, string> = {
  "pas-reflechi":
    "Normal : on chiffre après avoir compris votre fonctionnement, pas avant.",
  "moins-1500":
    "Un premier périmètre ciblé peut se cadrer dans cette logique, à confirmer selon votre situation.",
  "1500-3500":
    "Ça permet d'envisager un système complet sur un besoin bien identifié.",
  "plus-3500":
    "Ça ouvre la porte à un système connecté de bout en bout, sur plusieurs services.",
};

export const TIMELINE_REACTIONS: Record<string, string> = {
  urgent:
    "Un délai court n'est pas un obstacle : un premier système peut être livré en quelques jours à une semaine et demie selon le périmètre.",
  "3-mois":
    "Bon timing : assez de recul pour bien cadrer, assez court pour ne pas laisser le problème s'installer.",
  renseigne:
    "Aucun engagement. Ce diagnostic vous donne déjà des repères concrets pour la suite.",
};

// Synthèse Q6 affichée sous les réactions individuelles, selon le nombre
// de cases cochées.
export function painPointsReaction(count: number): string | null {
  if (count >= 3) {
    return "À ce stade, ce ne sont plus de petits irritants : c'est tout un fonctionnement qui repose sur des gestes manuels.";
  }
  if (count === 2) {
    return "Ce n'est pas un détail isolé : c'est un problème structurel, et ça se résout d'un bloc, pas case par case.";
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

// Titre "closing" de l'écran de résultat, calibré par niveau — le CTA qui
// suit est le même pour tout le monde : un seul bouton vers le formulaire
// nom/email/téléphone qui envoie la demande au CRM (voir
// DiagnosticQuiz.tsx). Calendly n'apparaît qu'après l'envoi, sur l'écran
// de remerciement. Le contenu détaillé sous le titre n'est pas un texte
// générique par palier : voir buildDiagnosticReport, construit à partir
// des réponses réelles.
export const RESULT_CONTENT: Record<Level, { title: string }> = {
  low: {
    title: "Pour l'instant, ce n'est probablement pas votre priorité n°1.",
  },
  moderate: {
    title: "Il y a clairement matière à automatiser chez vous.",
  },
  high: {
    title:
      "Vous perdez du temps et de l'argent, chaque semaine, sur des choses qui peuvent tourner toutes seules.",
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

// ---------------------------------------------------------------------
// Diagnostic détaillé (écran affiché après envoi du formulaire) — 6 blocs
// distincts, recomposés dynamiquement à partir des réponses réelles.
// Un bloc dont les données nécessaires sont absentes n'est jamais rendu
// (voir chaque fonction ci-dessous et le filtrage dans buildDiagnosticReport).
// ---------------------------------------------------------------------

export interface DiagnosticCard {
  title: string;
  constat: string;
  solution: string;
}

export interface DiagnosticBlock {
  title: string;
  paragraphs: string[];
  footnote?: string;
  cards?: DiagnosticCard[];
}

export interface DiagnosticReport {
  blocks: DiagnosticBlock[];
}

const TIME_LOST_WEEKLY_LABEL: Record<string, string> = {
  "moins-2h": "moins de 2 heures",
  "2-5h": "2 à 5 heures",
  "5-10h": "5 à 10 heures",
  "plus-10h": "plus de 10 heures",
};

const TIME_LOST_YEARLY_LABEL: Record<string, string> = {
  "moins-2h": "jusqu'à 10 jours de travail",
  "2-5h": "10 à 30 jours de travail",
  "5-10h": "30 à 60 jours de travail",
  "plus-10h": "plus de 55 jours de travail",
};

const PAIN_POINT_DETAILS: Record<string, DiagnosticCard> = {
  ressaisie: {
    title: "Ressaisie entre outils",
    constat: "La même information est saisie plusieurs fois, à la main.",
    solution:
      "Vos outils sont connectés : une donnée saisie une seule fois circule seule partout où elle est utile.",
  },
  "charge-equipe": {
    title: "Charge de travail de l'équipe",
    constat: "Vous n'avez pas de vue fiable sur qui est disponible et qui est débordé.",
    solution:
      "Un plan de charge alimenté automatiquement par les tâches déjà assignées, sans tableur à tenir à jour.",
  },
  facturation: {
    title: "Facturation, devis, relances",
    constat: "Des tâches administratives qui dépendent de votre disponibilité et de votre mémoire.",
    solution:
      "Devis et factures générés depuis vos données existantes, relances programmées selon les échéances.",
  },
  rapports: {
    title: "Rapports à la main",
    constat: "Vos chiffres sont compilés manuellement, donc toujours en retard.",
    solution: "Un tableau de bord alimenté en continu : vous l'ouvrez, il est à jour.",
  },
};

// BLOC 5 — priorité recommandée : outils déconnectés ou ressaisie cochée
// passent devant tout le reste (c'est la fondation dont dépend le reste),
// sinon la première case cochée dans l'ordre ci-dessous, sinon un échange
// pour repérer la priorité ensemble.
function recommendedPriority(answers: Answers): string {
  const painPoints = answers["pain-points"] ?? [];
  if (answers.tools === "outils-deconnectes" || painPoints.includes("ressaisie")) {
    return "connecter vos outils entre eux, c'est la base sur laquelle tout le reste devient simple";
  }
  if (painPoints.includes("charge-equipe")) {
    return "mettre en place un plan de charge automatique";
  }
  if (painPoints.includes("facturation")) {
    return "automatiser vos devis, factures et relances";
  }
  if (painPoints.includes("rapports")) {
    return "construire un tableau de bord qui se met à jour seul";
  }
  return "un échange de 20 minutes pour repérer ensemble la fuite de temps la plus rentable à corriger";
}

const LEVEL_FOLLOWUP: Record<Level, string> = {
  high:
    "Vos réponses dessinent un cas net : un temps perdu significatif, des outils qui ne travaillent pas ensemble, une charge bien réelle. C'est le profil pour lequel un système bien conçu change le quotidien rapidement. Un échange de 20 minutes suffit pour valider par où commencer et ce que cela implique concrètement.",
  moderate:
    "Il y a de la matière, sans que tout soit à refaire. Souvent, deux ou trois automatisations bien choisies suffisent à alléger l'essentiel. Un échange de 20 minutes permet de trier ce qui vaut vraiment le coup.",
  low: "Aujourd'hui, l'urgence n'est sans doute pas là, et c'est une bonne nouvelle. Gardez ce diagnostic : si votre volume d'activité, votre équipe ou vos outils évoluent, ces points reviendront vite. On reste disponibles.",
};

export function buildDiagnosticReport(answers: Answers, level: Level): DiagnosticReport {
  const blocks: DiagnosticBlock[] = [];

  // Bloc 1 — Ce que ça vous coûte en temps
  const weeklyLabel = TIME_LOST_WEEKLY_LABEL[answers["time-lost"] ?? ""];
  const yearlyLabel = TIME_LOST_YEARLY_LABEL[answers["time-lost"] ?? ""];
  if (weeklyLabel && yearlyLabel) {
    blocks.push({
      title: "Ce que ça vous coûte en temps",
      paragraphs: [
        `Vous estimez perdre ${weeklyLabel} par semaine sur des tâches répétitives. Sur une année, ça représente ${yearlyLabel}. Ce temps ne se rattrape pas : il est pris sur votre métier, sur vos clients ou sur votre soirée.`,
      ],
      footnote: "Estimation basée sur 46 semaines par an et des journées de 8h.",
    });
  }

  // Bloc 2 — Votre organisation aujourd'hui
  const orgParagraphs = [
    TOOLS_REACTIONS[answers.tools ?? ""],
    COMPANY_SIZE_REACTIONS[answers["company-size"] ?? ""],
  ].filter((p): p is string => Boolean(p));
  if (orgParagraphs.length) {
    blocks.push({ title: "Votre organisation aujourd'hui", paragraphs: orgParagraphs });
  }

  // Bloc 3 — Vos points de friction, et ce qu'on y met en place
  const painPoints = answers["pain-points"] ?? [];
  const cards = painPoints
    .map((value) => PAIN_POINT_DETAILS[value])
    .filter((c): c is DiagnosticCard => Boolean(c));
  blocks.push(
    cards.length
      ? { title: "Vos points de friction, et ce qu'on y met en place", paragraphs: [], cards }
      : {
          title: "Vos points de friction, et ce qu'on y met en place",
          paragraphs: [
            "Vous n'avez pas identifié de point précis. C'est courant : c'est souvent en regardant votre fonctionnement de près que les vraies fuites de temps apparaissent.",
          ],
        }
  );

  // Bloc 4 — Pourquoi ça n'a pas encore bougé, et ce que ça vous pèse
  const blockerParagraphs = [
    SELF_FIX_REACTIONS[answers["self-fix"] ?? ""],
    ADMIN_BURDEN_REACTIONS[answers["admin-burden"] ?? ""],
  ].filter((p): p is string => Boolean(p));
  if (blockerParagraphs.length) {
    blocks.push({
      title: "Pourquoi ça n'a pas encore bougé, et ce que ça vous pèse",
      paragraphs: blockerParagraphs,
    });
  }

  // Bloc 5 — Par où on commencerait
  blocks.push({
    title: "Par où on commencerait",
    paragraphs: [
      `Notre recommandation : commencer par ${recommendedPriority(answers)}.`,
      "Chaque système est construit sur mesure à partir de vos outils actuels, sans que vous ayez à en changer.",
    ],
  });

  // Bloc 6 — La suite
  const followupParagraphs = [LEVEL_FOLLOWUP[level]];
  if (answers.timeline === "urgent") {
    followupParagraphs.push(
      "Vous visez un démarrage rapide : la rapidité de livraison est justement notre point fort."
    );
  }
  blocks.push({ title: "La suite", paragraphs: followupParagraphs });

  return { blocks };
}

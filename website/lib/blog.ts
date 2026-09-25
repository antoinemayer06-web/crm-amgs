// Source de vérité du blog : un article = un objet ici, rendu par
// app/blog/page.tsx (liste) et app/blog/[slug]/page.tsx (détail).
// Pour les 8 articles "standards", le contenu (intro + sections) est un
// premier jet structuré — à valider avant publication finale, comme prévu
// au brief. L'article pilier (Automatisation 974) est rédigé en entier.
//
// Règle transverse : aucun outil (Axonaut, HubSpot, ClickUp, Microsoft
// 365...) n'est présenté comme LE cœur de compétence — chaque outil cité
// n'est qu'un exemple illustratif parmi d'autres, jamais une spécialisation
// qui exclurait les autres.

export interface ArticleSection {
  heading: string;
  body: string[];
}

export interface ArticleLink {
  label: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  icon: "map-pin" | "refresh-cw" | "link-2" | "table" | "search" | "bar-chart-3" | "puzzle" | "layout-grid" | "bot";
  // Illustration dédiée (optionnelle) — tant qu'un article n'en a pas, sa
  // couverture retombe sur l'icône + dégradé (voir ArticleCover.tsx).
  image?: string;
  pillar?: boolean;
  intro: string[];
  sections: ArticleSection[];
  faq?: FaqItem[];
  relatedLinks: ArticleLink[];
}

function wordCount(article: Article): number {
  const text = [
    ...article.intro,
    ...article.sections.flatMap((s) => [s.heading, ...s.body]),
    ...(article.faq?.flatMap((f) => [f.question, f.answer]) ?? []),
  ].join(" ");
  return text.trim().split(/\s+/).length;
}

export function readingTimeMinutes(article: Article): number {
  return Math.max(1, Math.round(wordCount(article) / 180));
}

export const ARTICLES: Article[] = [
  {
    slug: "automatisation-974-guide-complet-pme-reunion",
    title: "Automatisation 974 : le guide complet pour les PME réunionnaises",
    metaDescription:
      "Qu'est-ce que l'automatisation pour une PME, pourquoi La Réunion est particulièrement concernée, les grands types de systèmes possibles, et par où commencer. Guide complet avec FAQ.",
    excerpt:
      "Définition simple, spécificités du tissu économique local, grands types d'automatisation possibles et méthode pour démarrer : le guide de référence sur l'automatisation des PME à La Réunion.",
    date: "2026-09-24",
    icon: "map-pin",
    image: "/blog/automatisation-974-cover.webp",
    pillar: true,
    intro: [
      "« Automatisation » est un mot qui fait souvent peur avant même qu'on en comprenne le sens : on imagine un projet informatique lourd, coûteux, réservé aux grandes entreprises avec une équipe technique dédiée. Dans la réalité d'une PME réunionnaise, c'est presque toujours l'inverse : l'automatisation la plus utile est la plus simple — supprimer une tâche répétitive qui, elle, coûte déjà du temps et de l'argent chaque semaine, silencieusement.",
      "Ce guide fait le point sans jargon technique : ce qu'est réellement l'automatisation pour une PME, pourquoi le tissu économique réunionnais est particulièrement concerné, les grandes familles de systèmes possibles, et une méthode simple pour savoir par où commencer.",
    ],
    sections: [
      {
        heading: "Qu'est-ce que l'automatisation, concrètement, pour une PME ?",
        body: [
          "Automatiser, ce n'est pas remplacer une équipe par un logiciel. C'est faire en sorte qu'une tâche répétitive et prévisible — recopier une information d'un outil à l'autre, envoyer une relance de paiement, mettre à jour un tableau de suivi chaque lundi matin — se déclenche et s'exécute toute seule, sans qu'un humain ait à y penser.",
          "Concrètement, un système d'automatisation observe un événement (un nouveau client dans le CRM, un formulaire rempli, une date d'échéance qui approche) et déclenche une action définie à l'avance : créer une fiche, envoyer un e-mail, mettre à jour un tableau de bord, générer un document. Rien de magique — une suite de règles claires, construites une fois, qui tournent ensuite en silence.",
          "Prenons un exemple simple. Un client remplit un formulaire de contact sur un site. Sans automatisation, quelqu'un doit lire l'e-mail, créer la fiche dans le CRM, et prévenir la bonne personne. Avec un système en place, la fiche se crée toute seule, la bonne personne est notifiée automatiquement, et rien ne dépend d'une vérification manuelle des e-mails. La différence ne se voit pas sur un seul cas — elle se voit sur les cent ou mille cas suivants.",
          "L'objectif n'est jamais l'outil en lui-même. C'est le temps regagné, la fiabilité de l'information (plus d'erreur de recopie), et une entreprise qui continue de tourner correctement même quand une personne clé est absente ou en congés.",
        ],
      },
      {
        heading: "Pourquoi les PME réunionnaises sont particulièrement concernées",
        body: [
          "Le tissu économique de La Réunion est composé très majoritairement de TPE et de PME, souvent avec des équipes administratives réduites par rapport à leur volume d'activité réel. Une même personne gère fréquemment plusieurs casquettes — facturation, suivi client, coordination d'équipe — ce qui rend chaque heure perdue en tâches répétitives d'autant plus coûteuse à l'échelle de la structure.",
          "L'insularité joue aussi un rôle : les délais de recrutement sont plus longs, le bassin de compétences techniques disponibles localement est plus restreint, et il n'est pas toujours simple de « juste embaucher quelqu'un de plus » pour absorber une charge administrative croissante. Automatiser une tâche répétitive devient alors une alternative concrète à un recrutement, ou un moyen de laisser une équipe déjà en place se concentrer sur ce qui a vraiment besoin d'un humain.",
          "S'y ajoute une réalité propre aux petites structures multi-sites ou multi-activités, assez fréquentes localement (BTP, tourisme, commerce, agroalimentaire) : l'information circule souvent entre plusieurs lieux ou équipes qui ne se croisent pas au quotidien. Sans système commun, chacun finit par tenir son propre suivi séparé — ce qui démultiplie justement le risque de double saisie et de perte d'information évoqué plus haut.",
          "Enfin, beaucoup d'entreprises réunionnaises utilisent déjà de bons outils — CRM, logiciels de gestion, suite bureautique — mais ne les exploitent qu'à une fraction de leur potentiel, faute de temps pour les paramétrer plus finement. C'est souvent là que se trouve la marge de progression la plus rapide à activer, avant même d'envisager un nouvel outil ou un nouveau recrutement.",
        ],
      },
      {
        heading: "Les grands types d'automatisation possibles",
        body: [
          "Il n'existe pas une automatisation universelle, mais plusieurs familles de solutions selon le problème à résoudre. Le détail complet de ces sept familles, avec des exemples pour chacune, est disponible sur la page dédiée aux services — en voici un résumé.",
          "La connexion d'outils entre eux permet de faire circuler l'information automatiquement d'un logiciel à l'autre, sans ressaisie manuelle — c'est le point de départ le plus courant. Les sites ou formulaires reliés à une base de données évitent qu'une demande client ou une inscription doive être recopiée à la main dans un outil de suivi. Les dashboards de pilotage automatiques remplacent un rapport compilé chaque semaine par un tableau de bord toujours à jour. Les automatisations Microsoft 365 exploitent des outils souvent déjà payés (Excel, Power Automate, Forms) mais sous-utilisés. L'automatisation administrative et financière couvre les devis, factures et relances générés et envoyés automatiquement selon des règles définies. Le suivi de charge d'équipe automatique montre en temps réel qui est disponible, à partir des tâches déjà assignées. Enfin, les agents et assistants IA s'attaquent à des tâches précises — extraction de documents, réponses de premier niveau — jamais comme un gadget générique.",
          "Chacune répond à un symptôme différent — et la bonne approche commence toujours par identifier lequel de ces symptômes touche réellement votre entreprise, plutôt que de partir d'un outil à la mode ou d'une solution vue chez un concurrent.",
        ],
      },
      {
        heading: "Par où commencer",
        body: [
          "La méthode la plus fiable ne commence jamais par le choix d'un outil, mais par l'observation. Sur une semaine type, repérez les tâches qui reviennent à l'identique : une information copiée d'un endroit à un autre, un tableau mis à jour manuellement, une relance envoyée « à la main » chaque fois qu'une date approche. Ce sont ces répétitions, pas les grandes réorganisations, qui offrent le meilleur retour sur investissement une fois automatisées.",
          "Une erreur fréquente consiste à vouloir tout automatiser en une seule fois, ou à commencer par le sujet le plus complexe plutôt que par le plus rentable rapidement. Il est presque toujours préférable de traiter d'abord la tâche la plus répétitive et la plus simple à cadrer, pour obtenir un premier résultat visible, avant de s'attaquer à un système plus large.",
          "Ensuite, un simple échange de 20 à 30 minutes suffit généralement pour qualifier si le problème identifié se prête à une automatisation simple (quelques jours de mise en œuvre) ou à un système plus large. Il n'y a pas de tarif générique ni de forfait standard : chaque système est chiffré après avoir vu le fonctionnement réel de l'entreprise, pas sur une base théorique — voir la méthode complète pour plus de détails.",
        ],
      },
      {
        heading: "Exemples concrets",
        body: [
          "Plutôt que des promesses abstraites, les résultats parlent mieux : suppression de double saisie entre un CRM et un outil de facturation, plan de charge d'équipe généré automatiquement à partir des tâches déjà assignées, site internet relié directement à une base de données pour éliminer la ressaisie de formulaires, ou encore chatbot de support pour absorber les questions les plus fréquentes.",
          "Un bureau d'études réunionnais, par exemple, utilisait cinq outils différents sans aucune connexion entre eux : CRM, gestion de projet, facturation, stockage documentaire et messagerie. Le système livré en une semaine et demie a supprimé la quasi-totalité des ressaisies manuelles entre ces outils, sans qu'aucun d'entre eux n'ait eu besoin d'être remplacé. Chaque situation reste différente, mais le principe reste le même : partir de ce qui existe déjà, sans tout reconstruire. Le détail de plusieurs projets récents, anonymisés, est disponible sur la page dédiée.",
        ],
      },
      {
        heading: "Les erreurs les plus fréquentes à éviter",
        body: [
          "La première erreur est de changer d'outil avant d'avoir compris précisément le problème à résoudre — un réflexe coûteux (reprise de données, formation, période d'adaptation) qui s'avère souvent inutile une fois le vrai blocage identifié.",
          "La deuxième est de vouloir un système parfait dès le départ, plutôt que de démarrer sur un périmètre restreint et de l'élargir ensuite. Un système trop ambitieux d'entrée de jeu prend plus de temps à livrer, et le risque d'écart avec le besoin réel augmente avec sa taille.",
          "La troisième est de confondre automatisation et intelligence artificielle générique : la plupart des gains de temps d'une PME viennent de règles simples et prévisibles (« quand X se produit, fais Y »), pas d'un algorithme complexe. L'IA a sa place sur des cas précis, mais elle n'est ni le point de départ, ni une condition pour automatiser efficacement.",
        ],
      },
    ],
    faq: [
      {
        question: "Combien coûte un projet d'automatisation pour une PME ?",
        answer:
          "Il n'y a pas de tarif générique : le coût dépend de la complexité réelle du système, du nombre d'outils à connecter et du temps de développement nécessaire. Un diagnostic gratuit permet d'obtenir un devis ferme, adapté à la situation réelle de l'entreprise, plutôt qu'une fourchette théorique.",
      },
      {
        question: "Combien de temps faut-il pour mettre en place une automatisation ?",
        answer:
          "Cela varie fortement selon le périmètre : une connexion simple entre deux outils peut être livrée en quelques jours, tandis qu'un système plus large (dashboard complet, plusieurs automatisations liées) prend davantage de temps. Le délai est annoncé clairement dès le devis, jamais en cours de route.",
      },
      {
        question: "Faut-il changer d'outils pour automatiser ?",
        answer:
          "Non, dans la grande majorité des cas. L'automatisation consiste justement à connecter et exploiter les outils déjà en place (CRM, Excel, Microsoft 365, logiciel de gestion...) plutôt qu'à les remplacer. Un changement d'outil n'est recommandé que si l'outil actuel a une limite technique réelle et bloquante.",
      },
      {
        question: "Une petite entreprise a-t-elle vraiment besoin d'automatiser ?",
        answer:
          "La taille de l'entreprise compte moins que le volume de tâches répétitives. Une TPE qui perd quelques heures par semaine sur de la ressaisie manuelle peut avoir un retour sur investissement plus rapide qu'une structure plus grande, précisément parce que chaque heure représente une part plus importante de son temps disponible.",
      },
      {
        question: "Est-ce compliqué à utiliser au quotidien une fois en place ?",
        answer:
          "Non — l'objectif est justement l'inverse : un système qui tourne en silence, sans nouvelle interface à apprendre. Dans la plupart des cas, l'équipe continue à utiliser les outils qu'elle connaît déjà ; c'est ce qui se passe derrière qui change.",
      },
    ],
    relatedLinks: [
      { label: "Découvrir les 7 types de solutions", href: "/services" },
      { label: "Voir des projets récents", href: "/nos-derniers-projets" },
      { label: "Comprendre la méthode et les délais", href: "/comment-ca-marche" },
    ],
  },
  {
    slug: "double-saisie-entre-outils-comment-eliminer",
    title: "Double saisie entre outils : comment l'éliminer sans tout changer",
    metaDescription:
      "La double saisie entre vos outils n'oblige pas à changer de logiciel. Voici pourquoi elle s'installe, ce qu'elle coûte vraiment, et comment la supprimer.",
    excerpt:
      "La double saisie n'est pas une fatalité liée à vos outils actuels. Voici comment la supprimer sans changer de CRM ni de logiciel de gestion.",
    date: "2026-09-17",
    icon: "refresh-cw",
    image: "/blog/double-saisie-cover.webp",
    intro: [
      "Une commande créée dans le CRM, puis recopiée dans l'outil de facturation. Un client mis à jour d'un côté, oublié de l'autre. La double saisie ne fait presque jamais de bruit — c'est justement ce qui la rend si difficile à repérer, alors qu'elle grignote un temps considérable, semaine après semaine.",
    ],
    sections: [
      {
        heading: "Pourquoi la double saisie s'installe sans qu'on la remarque",
        body: [
          "La plupart du temps, la double saisie n'est pas une erreur de conception : elle apparaît progressivement, à mesure que l'entreprise ajoute des outils (un CRM, un outil de facturation, un tableur de suivi) sans jamais les connecter entre eux. Chaque outil fait bien son travail, pris isolément — le problème est qu'ils ne se parlent pas.",
        ],
      },
      {
        heading: "Le vrai coût : pas seulement du temps",
        body: [
          "Au-delà des minutes perdues à recopier, la double saisie introduit un risque d'erreur (une faute de frappe, une ligne oubliée) et une perte de fiabilité : à terme, plus personne ne sait quelle version de l'information est la bonne. C'est souvent ce deuxième coût, invisible, qui pèse le plus lourd sur la prise de décision.",
        ],
      },
      {
        heading: "La solution n'est (presque) jamais de changer d'outil",
        body: [
          "Le réflexe le plus courant est de penser qu'il faut remplacer un des deux outils par un logiciel « tout-en-un ». Dans la pratique, changer d'outil est rarement nécessaire : la quasi-totalité des logiciels du marché (CRM, facturation, gestion de projet, quel que soit l'éditeur) proposent des moyens de communiquer avec d'autres systèmes. Le travail consiste à construire ce pont, pas à tout reconstruire autour d'un nouvel outil.",
        ],
      },
      {
        heading: "Comment ça se met en place concrètement",
        body: [
          "Une connexion entre deux outils commence par identifier précisément quelle information doit circuler, dans quel sens, et à quel moment (à la création d'une fiche, à un changement de statut, etc.). Le système est ensuite construit et testé avec les données réelles de l'entreprise avant sa mise en service — sans interruption de l'activité pendant la bascule.",
        ],
      },
      {
        heading: "Ce qu'il faut retenir",
        body: [
          "La double saisie n'est pas une fatalité liée à vos outils actuels, ni un problème qui se résout en changeant de logiciel. C'est un pont technique à construire entre des outils qui, la plupart du temps, restent parfaitement adaptés une fois connectés correctement.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Connexion d'outils entre eux", href: "/services#solution-1-connexion-outils" },
      { label: "Le guide complet de l'automatisation à La Réunion", href: "/blog/automatisation-974-guide-complet-pme-reunion" },
    ],
  },
  {
    slug: "crm-outils-metiers-cout-cache",
    title: "CRM et outils métiers qui ne se parlent pas : le vrai coût caché",
    metaDescription:
      "Votre CRM et vos outils métiers ne communiquent pas entre eux ? Voici ce que ça coûte réellement à une PME, et comment les connecter sans les remplacer.",
    excerpt:
      "Un CRM d'un côté, des outils métiers de l'autre, et personne qui a la vue d'ensemble. Le coût de cette situation est plus élevé qu'il n'y paraît.",
    date: "2026-09-10",
    icon: "link-2",
    image: "/blog/crm-cout-cache-cover.webp",
    intro: [
      "Presque toutes les PME ont un CRM — Axonaut, HubSpot, Salesforce ou un autre, peu importe lequel. Le problème n'est presque jamais le choix du CRM en lui-même, mais le fait qu'il reste isolé des autres outils métiers de l'entreprise : facturation, gestion de projet, suivi de production.",
    ],
    sections: [
      {
        heading: "Le symptôme : deux outils, une seule vérité introuvable",
        body: [
          "Quand le CRM et les outils métiers ne communiquent pas, chacun devient une source de vérité partielle. Le commercial voit l'état d'une opportunité dans le CRM, mais pas si la facture correspondante a été payée. L'équipe opérationnelle voit l'état d'un projet, mais pas les échanges commerciaux qui l'ont précédé.",
        ],
      },
      {
        heading: "Ce que ça coûte réellement à une PME",
        body: [
          "Le coût direct est le temps passé à ressaisir ou à vérifier une information dans plusieurs outils. Le coût indirect, plus difficile à chiffrer, est la perte de réactivité : un dirigeant qui doit croiser trois outils avant de répondre à une simple question sur un client prend plus de temps à décider, et parfois décide avec une information incomplète.",
        ],
      },
      {
        heading: "Connecter plutôt que remplacer",
        body: [
          "Remplacer un CRM est un projet lourd, coûteux et risqué (reprise des données, formation de l'équipe, période d'adaptation). Dans la grande majorité des cas, connecter le CRM existant aux outils métiers déjà utilisés résout le problème de fond bien plus rapidement, sans bouleverser les habitudes de travail de l'équipe.",
        ],
      },
      {
        heading: "Un exemple concret",
        body: [
          "Un bureau d'études utilisant cinq outils déconnectés (CRM, gestion de projet, facturation, stockage documentaire, messagerie) a vu son système livré en une semaine et demie : une fois les bonnes connexions posées, l'information créée dans un outil se propage automatiquement aux autres, sans intervention manuelle.",
        ],
      },
      {
        heading: "Par où commencer",
        body: [
          "Le point de départ le plus simple : lister les informations qui sont aujourd'hui recopiées à la main entre le CRM et les autres outils métiers. C'est cette liste, pas le nom de l'outil, qui détermine ce qu'il est utile de connecter en priorité.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Connexion d'outils entre eux", href: "/services#solution-1-connexion-outils" },
      { label: "Voir un projet réel de connexion d'outils", href: "/nos-derniers-projets" },
    ],
  },
  {
    slug: "plan-de-charge-automatique-excel-limites",
    title: "Plan de charge automatique : pourquoi votre Excel ne suffit plus",
    metaDescription:
      "Le plan de charge sous Excel fonctionne bien au départ, puis montre ses limites avec la croissance. Voici ce que change un plan de charge automatique.",
    excerpt:
      "Le tableau Excel de suivi de charge a bien servi — jusqu'à un certain seuil. Voici les limites qui apparaissent, et ce qu'un système automatique change.",
    date: "2026-09-03",
    icon: "table",
    image: "/blog/plan-de-charge-cover.webp",
    intro: [
      "Le plan de charge sous Excel ou Google Sheets est souvent la première solution mise en place par une PME en croissance — et c'est une bonne solution, au départ. Le problème apparaît plus tard, quand le tableau devient trop lourd à maintenir pour rester fiable.",
    ],
    sections: [
      {
        heading: "Le plan de charge sous Excel : pratique... jusqu'à un certain seuil",
        body: [
          "Un tableur reste l'outil le plus flexible pour démarrer : pas de coût d'outil supplémentaire, personnalisable à volonté. Tant que l'équipe est petite et que les tâches évoluent peu, la mise à jour manuelle reste gérable.",
        ],
      },
      {
        heading: "Les limites qui apparaissent avec la croissance",
        body: [
          "Avec plus de collaborateurs et plus de projets en parallèle, le tableau doit être mis à jour plus souvent, par plus de personnes — et les versions divergent. À un moment, la mise à jour manuelle prend elle-même un temps significatif, et le risque que le tableau ne reflète plus la réalité augmente fortement.",
        ],
      },
      {
        heading: "Ce que change un plan de charge automatique",
        body: [
          "Un plan de charge automatique se construit à partir des tâches déjà assignées dans les outils utilisés au quotidien (gestion de projet, CRM, planning) : il se met à jour tout seul, sans ressaisie, et montre en temps réel qui est disponible et qui est débordé.",
        ],
      },
      {
        heading: "Faut-il un nouvel outil ? Pas nécessairement",
        body: [
          "Le plan de charge automatique n'implique pas forcément d'abandonner Excel : dans certains cas, le tableur reste l'interface visible, mais il se remplit tout seul à partir des données existantes plutôt que d'être mis à jour à la main.",
        ],
      },
      {
        heading: "Comment démarrer",
        body: [
          "La première étape consiste à identifier où vivent réellement les informations de charge aujourd'hui (qui fait quoi, sur quelle durée) avant de construire la connexion qui les fera remonter automatiquement dans un plan de charge à jour en permanence.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Suivi de charge d'équipe", href: "/services#solution-6-charge-equipe" },
      { label: "5 signes que votre PME perd du temps sans le savoir", href: "/blog/5-signes-pme-perd-du-temps" },
    ],
  },
  {
    slug: "5-signes-pme-perd-du-temps",
    title: "5 signes que votre PME perd du temps sans le savoir",
    metaDescription:
      "Cinq signes discrets mais révélateurs qu'une PME perd du temps chaque semaine sans s'en rendre compte, et ce qu'ils indiquent à corriger en priorité.",
    excerpt:
      "Le temps perdu par une PME est rarement spectaculaire — il est diffus, quotidien, et donc facile à ne jamais remarquer. Cinq signes à surveiller.",
    date: "2026-08-27",
    icon: "search",
    image: "/blog/5-signes-cover.webp",
    intro: [
      "Le temps perdu par une PME est rarement spectaculaire — pas de panne ni d'incident visible. Il est diffus, réparti sur des dizaines de petites tâches quotidiennes, et c'est précisément ce qui le rend facile à ne jamais remarquer. Voici cinq signes révélateurs.",
    ],
    sections: [
      {
        heading: "1. Vous ressaisissez la même information dans plusieurs outils",
        body: [
          "Si une information (un client, une commande, un statut) doit être recopiée manuellement d'un outil à un autre, c'est un signal direct : ce pont peut presque toujours être automatisé, quel que soit le CRM ou le logiciel de gestion utilisé.",
        ],
      },
      {
        heading: "2. Vos rapports sont toujours faits « à la main », le même jour chaque semaine",
        body: [
          "Un rapport récurrent, compilé manuellement à date fixe à partir de plusieurs sources, est l'un des cas les plus simples et les plus rentables à automatiser via un dashboard qui se met à jour tout seul.",
        ],
      },
      {
        heading: "3. Une seule personne sait où en sont vraiment les dossiers",
        body: [
          "Quand l'information de suivi n'existe que dans la tête d'une personne (ou dans ses e-mails), l'entreprise dépend de sa présence pour continuer à fonctionner normalement. C'est un signe que le suivi doit être centralisé et automatisé, pas seulement mieux documenté.",
        ],
      },
      {
        heading: "4. Vos relances (devis, factures, paiements) dépendent d'y penser",
        body: [
          "Si une relance commerciale ou de paiement part uniquement parce que quelqu'un s'en est souvenu, une partie du chiffre d'affaires potentiel — ou du recouvrement — dépend de la mémoire humaine plutôt que d'un système fiable.",
        ],
      },
      {
        heading: "5. Personne ne sait qui est disponible sans demander directement",
        body: [
          "Devoir demander « qui a de la place cette semaine ? » par message est le signe qu'un plan de charge à jour en temps réel manque — et qu'il existe probablement déjà, quelque part, dans les tâches assignées à chacun.",
        ],
      },
      {
        heading: "Et maintenant ?",
        body: [
          "Si un ou plusieurs de ces signes sont familiers, la bonne nouvelle est qu'ils sont presque toujours résolubles sans changer d'outils — en connectant et en automatisant ce qui existe déjà.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Le guide complet de l'automatisation à La Réunion", href: "/blog/automatisation-974-guide-complet-pme-reunion" },
      { label: "Voir les 7 types de solutions", href: "/services" },
    ],
  },
  {
    slug: "dashboards-pilotage-automatiques-par-ou-commencer",
    title: "Dashboards de pilotage automatiques : par où commencer sans équipe data",
    metaDescription:
      "Pas besoin d'une équipe data pour avoir un dashboard de pilotage qui se met à jour tout seul. Voici par où commencer concrètement, sans jargon technique.",
    excerpt:
      "Un dashboard de pilotage automatique n'est pas réservé aux grandes entreprises avec une équipe data. Voici par où commencer, simplement.",
    date: "2026-08-20",
    icon: "bar-chart-3",
    image: "/blog/dashboards-cover.webp",
    intro: [
      "L'idée d'un « dashboard » évoque souvent un projet data complexe, réservé aux grandes structures. Pour une PME, un dashboard de pilotage utile est en réalité beaucoup plus simple : quelques indicateurs clés, à jour en permanence, visibles d'un coup d'œil.",
    ],
    sections: [
      {
        heading: "Un dashboard, ce n'est pas un projet data",
        body: [
          "Un dashboard de pilotage pour une PME ne nécessite ni base de données complexe, ni compétences en analyse de données. Il s'agit de rendre visibles, automatiquement, des chiffres qui existent déjà dans les outils utilisés au quotidien.",
        ],
      },
      {
        heading: "Ce qui bloque le plus souvent",
        body: [
          "Le vrai blocage n'est presque jamais technique : c'est de ne pas savoir quels indicateurs suivre en priorité. Un dashboard avec vingt indicateurs peu utiles vaut moins qu'un dashboard avec trois chiffres réellement regardés chaque semaine.",
        ],
      },
      {
        heading: "Par où commencer concrètement",
        body: [
          "La meilleure méthode consiste à partir des rapports déjà produits manuellement aujourd'hui (chiffre d'affaires, avancement de projets, charge d'équipe) et à automatiser leur mise à jour, plutôt que d'inventer de nouveaux indicateurs à partir de zéro.",
        ],
      },
      {
        heading: "Quels outils, pour quel budget",
        body: [
          "Un dashboard peut être construit avec des outils déjà présents dans l'entreprise (Power BI, un tableur connecté, ou l'outil de reporting déjà fourni par un logiciel métier) — le choix de l'outil dépend du contexte, jamais imposé par défaut.",
        ],
      },
      {
        heading: "Un exemple simple",
        body: [
          "Un dashboard type Power BI mis à jour automatiquement à partir des données déjà présentes dans les outils existants remplace un rapport compilé manuellement chaque semaine — le chiffre est disponible en continu, pas seulement le jour où quelqu'un a eu le temps de le préparer.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Dashboards de pilotage automatiques", href: "/services#solution-3-dashboards" },
      { label: "Voir un dashboard construit pour un client", href: "/nos-derniers-projets" },
    ],
  },
  {
    slug: "automatiser-sans-changer-outil-methode",
    title: "Automatiser sans changer d'outil : la méthode",
    metaDescription:
      "Automatiser ne veut pas dire changer d'outils. Voici la méthode en 3 étapes pour automatiser en partant de ce que votre entreprise utilise déjà.",
    excerpt:
      "Automatiser ne signifie pas remplacer vos outils actuels. Voici une méthode simple, en trois étapes, pour partir de ce qui existe déjà.",
    date: "2026-08-13",
    icon: "puzzle",
    image: "/blog/automatiser-sans-changer-outil-cover.webp",
    intro: [
      "Le réflexe le plus répandu face à un problème d'organisation est de chercher un nouvel outil « tout-en-un » qui résoudrait tout. Dans la pratique, c'est rarement la bonne première étape — et c'est souvent la plus coûteuse.",
    ],
    sections: [
      {
        heading: "Le réflexe à éviter : changer d'outil avant de comprendre le problème",
        body: [
          "Changer d'outil implique une reprise de données, une période d'adaptation de l'équipe, et un risque de perdre des habitudes de travail qui fonctionnaient bien. Ce coût est souvent sous-estimé face à la promesse d'un outil « qui fait tout ».",
        ],
      },
      {
        heading: "La méthode en 3 étapes",
        body: [
          "Première étape : identifier précisément la tâche répétitive à l'origine du problème, sans se focaliser sur l'outil. Deuxième étape : vérifier si les outils déjà en place permettent de communiquer entre eux (la plupart le permettent, quel que soit l'éditeur). Troisième étape : construire et tester la connexion ou l'automatisation avec les données réelles de l'entreprise, avant sa mise en service.",
        ],
      },
      {
        heading: "Ce qui rend cette approche possible aujourd'hui",
        body: [
          "La quasi-totalité des logiciels professionnels modernes (CRM, gestion de projet, facturation, suite bureautique) proposent des moyens de s'interconnecter avec d'autres outils. Ce qui manquait n'était généralement pas la capacité technique de l'outil, mais le temps de la mettre en place.",
        ],
      },
      {
        heading: "Les limites : quand faut-il quand même changer d'outil ?",
        body: [
          "Un changement d'outil reste justifié dans certains cas précis : une limite technique réelle et bloquante, ou un outil devenu obsolète sans possibilité de connexion moderne. Ces cas restent l'exception, pas la règle.",
        ],
      },
      {
        heading: "En résumé",
        body: [
          "Automatiser commence presque toujours par une question simple — « qu'est-ce qui se répète ? » — bien avant la question de l'outil à utiliser.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Comment ça marche : notre méthode", href: "/comment-ca-marche" },
      { label: "Double saisie entre outils : comment l'éliminer", href: "/blog/double-saisie-entre-outils-comment-eliminer" },
    ],
  },
  {
    slug: "microsoft-365-automatisations-cachees",
    title: "Microsoft 365 : tout ce que vos outils peuvent faire sans que vous le sachiez",
    metaDescription:
      "Excel, Power Automate, Microsoft Forms : la suite Microsoft 365 que vous utilisez déjà peut automatiser bien plus que ce que vous en exploitez aujourd'hui.",
    excerpt:
      "La suite Microsoft 365 que vous payez déjà chaque mois peut faire beaucoup plus que ce que la plupart des équipes en exploitent réellement.",
    date: "2026-08-06",
    icon: "layout-grid",
    intro: [
      "La majorité des PME possèdent déjà un abonnement Microsoft 365 — Excel, Outlook, Teams — sans forcément savoir que cette suite embarque aussi des outils d'automatisation capables de remplacer plusieurs tâches manuelles répétitives.",
    ],
    sections: [
      {
        heading: "La suite que vous payez déjà, sous-exploitée",
        body: [
          "Excel avancé, Power Automate, Microsoft Forms font partie de la plupart des abonnements Microsoft 365, souvent sans que l'entreprise sache qu'ils sont inclus ni à quoi ils servent concrètement.",
        ],
      },
      {
        heading: "Ce qu'il est possible d'automatiser avec ce que vous avez déjà",
        body: [
          "Un formulaire Microsoft Forms peut alimenter automatiquement un fichier Excel partagé ; un classeur Excel peut déclencher un e-mail ou une notification Teams dès qu'une condition est remplie ; des flux Power Automate peuvent transférer des pièces jointes, renommer des fichiers, ou synchroniser des informations entre plusieurs applications Microsoft.",
        ],
      },
      {
        heading: "Un exemple concret",
        body: [
          "Une demande interne remplie via un formulaire peut créer automatiquement une ligne dans un tableau de suivi, notifier la bonne personne, et archiver le document au bon endroit — sans aucune étape manuelle une fois le flux construit.",
        ],
      },
      {
        heading: "Les limites de Microsoft 365 seul",
        body: [
          "Pour des besoins plus complexes (connexion à un CRM externe, dashboard avancé, automatisations conditionnelles multiples), Microsoft 365 seul atteint parfois ses limites — il reste alors une brique parmi d'autres dans un système plus large, pas la seule solution possible.",
        ],
      },
      {
        heading: "Comment savoir ce qui est faisable chez vous",
        body: [
          "Le plus simple reste un état des lieux rapide de l'abonnement actuel et des tâches répétitives de l'équipe, pour identifier ce qui peut être automatisé immédiatement avec les outils déjà en place, sans coût de licence supplémentaire.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Automatisations Microsoft 365", href: "/services#solution-4-microsoft-365" },
      { label: "Agent IA en entreprise : cas d'usage concrets", href: "/blog/agent-ia-entreprise-cas-usage-concrets" },
    ],
  },
  {
    slug: "agent-ia-entreprise-cas-usage-concrets",
    title: "Agent IA en entreprise : cas d'usage concrets (pas de gadget)",
    metaDescription:
      "Des exemples concrets d'agents IA utiles en PME : extraction de documents, réponses de premier niveau, veille automatique — pas un gadget ajouté après coup.",
    excerpt:
      "L'IA en entreprise n'a de valeur que sur un cas d'usage précis. Voici des exemples concrets, testables, plutôt qu'une promesse générique.",
    date: "2026-07-30",
    icon: "bot",
    intro: [
      "« Ajouter de l'IA » sans objectif précis produit rarement un résultat utile. Un agent IA n'a de valeur que lorsqu'il est conçu pour un cas d'usage concret, avec des données réelles de l'entreprise — pas comme un gadget plaqué sur un produit existant.",
    ],
    sections: [
      {
        heading: "L'IA générique ne sert à rien sans un cas d'usage précis",
        body: [
          "Un assistant IA « qui répond à tout » n'apporte en pratique presque aucun gain mesurable. Ce qui fonctionne, c'est un agent construit pour une tâche précise et répétitive, avec un périmètre clairement défini.",
        ],
      },
      {
        heading: "Cas d'usage n°1 : extraction et classement de documents",
        body: [
          "Un agent peut lire automatiquement des factures, devis ou contrats reçus par e-mail, en extraire les informations clés, et les classer dans le bon dossier ou la bonne fiche — une tâche répétitive qui prenait auparavant plusieurs minutes par document.",
        ],
      },
      {
        heading: "Cas d'usage n°2 : réponse automatique de premier niveau",
        body: [
          "Un chatbot de support peut absorber les questions les plus fréquentes (horaires, statut de commande, informations générales), en laissant les cas plus complexes à un humain — sans faire attendre inutilement les demandes simples.",
        ],
      },
      {
        heading: "Cas d'usage n°3 : veille et synthèse",
        body: [
          "Un agent peut surveiller automatiquement une source d'information (marché, concurrence, actualité sectorielle) et produire une synthèse régulière, plutôt que de dépendre d'une personne qui doit y penser chaque semaine.",
        ],
      },
      {
        heading: "Ce qu'il faut avant de se lancer",
        body: [
          "Un cas d'usage clair, des données réelles pour le tester, et un périmètre limité au départ : ces trois conditions déterminent si un agent IA sera réellement utilisé, ou abandonné après quelques semaines.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Agents & assistants IA", href: "/services#solution-7-ia" },
      { label: "Le guide complet de l'automatisation à La Réunion", href: "/blog/automatisation-974-guide-complet-pme-reunion" },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getPillarArticle(): Article {
  const pillar = ARTICLES.find((a) => a.pillar);
  if (!pillar) throw new Error("No pillar article configured");
  return pillar;
}

export function getSortedArticles(): Article[] {
  return [...ARTICLES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

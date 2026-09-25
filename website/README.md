# Site vitrine — AM Growth Solutions

Site vitrine B2B de l'agence, construit avec Next.js 14 (App Router),
TypeScript, Tailwind CSS et Framer Motion.

Ce projet est indépendant du CRM interne à la racine du dépôt (React + Vite) :
il possède son propre `package.json` et se développe séparément.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — palette personnalisée définie en variables CSS dans
  `app/globals.css` (primaire indigo, accent vert, fond gris très clair,
  texte anthracite)
- **Framer Motion** — variants réutilisables dans `lib/animations.ts`
  (fade-in + slide-up au scroll, stagger, hover subtil)
- Police **Inter** (via `next/font/google`) pour le corps de texte et les
  titres (poids marqués sur les titres)

## Installation

```bash
cd website
npm install
npm run dev
```

## Structure

```
app/
  layout.tsx      Layout racine, police Inter, métadonnées
  page.tsx         Page d'accueil (sections à venir, une par une)
  globals.css       Variables CSS de la charte (couleurs, polices)
  icon.tsx          Favicon généré (à remplacer par le logo définitif)
components/         Composants de section (à créer un par un)
lib/
  animations.ts     Variants Framer Motion réutilisables
public/
  brand/            Déposer ici logo.png (logo de l'agence)
  clients/          Déposer ici les logos clients
```

## Prochaines étapes

Les sections de la page d'accueil (Hero, Bandeau outils, Problème,
Services, Preuve concrète, Processus, Témoignages, FAQ, Contact) seront
construites une par une dans `components/` puis assemblées dans
`app/page.tsx`.

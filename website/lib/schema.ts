import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";

// @id stables utilisés pour relier les entités entre elles dans le graphe
// JSON-LD, y compris à travers des balises <script> distinctes sur une
// même page (layout racine + page) — Google résout les références @id au
// sein de l'ensemble des données structurées d'une même page HTML.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/#antoine`;

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: BUSINESS.name,
    alternateName: ["AMGS", "AM Growth Solutions La Réunion"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/logo.png`,
    },
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    // Ajouter la page entreprise LinkedIn ici dès qu'elle existe (voir
    // rapport SEO — action manuelle).
    sameAs: BUSINESS.sameAs,
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: BUSINESS.name,
    url: SITE_URL,
    inLanguage: "fr-FR",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

function localBusinessNode() {
  return {
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    founder: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: BUSINESS.areaServed,
    // Volontairement aucun `priceRange` : les tarifs sont toujours sur
    // devis, jamais une fourchette affichée.
    sameAs: BUSINESS.sameAs,
  };
}

function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: BUSINESS.founder,
    jobTitle: "Fondateur",
    worksFor: { "@id": ORGANIZATION_ID },
    url: `${SITE_URL}/a-propos`,
    sameAs: BUSINESS.sameAs,
    knowsAbout: [
      "Automatisation",
      "Power Automate",
      "Microsoft 365",
      "Power BI",
      "Intégration d'outils métiers",
    ],
  };
}

// Graphe commun injecté sur TOUTES les pages (voir app/layout.tsx) : les
// quatre entités de base, reliées entre elles par @id, pour que Google
// comprenne qu'"AM Growth Solutions" = cette entreprise à La Réunion
// fondée par Antoine Mayer (désambiguïsation vis-à-vis des marques au nom
// proche). Le Person complet n'est déclaré qu'ici — les autres pages
// (BlogPosting notamment) le référencent par @id plutôt que de le
// redéfinir.
export function siteGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      websiteNode(),
      localBusinessNode(),
      personNode(),
    ],
  };
}

// Schema.org Service — un bloc par type de solution sur /services, plus la
// synthèse globale de la page.
export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: BUSINESS.areaServed,
  };
}

// Schema.org BlogPosting — un bloc par article de blog (app/blog/[slug]).
// `logo` est répété directement dans `publisher` (en plus de l'@id) car
// certains valideurs Rich Results exigent le logo accessible sans devoir
// résoudre la référence vers le bloc Organization du layout racine.
export function blogPostingSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image ? `${SITE_URL}${image}` : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "fr-FR",
    author: { "@id": PERSON_ID },
    publisher: {
      "@id": ORGANIZATION_ID,
      "@type": "Organization",
      name: BUSINESS.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };
}

// Schema.org FAQPage — utilisé sur l'article pilier pour capter les
// featured snippets Google sur les questions fréquentes. N'est appelé que
// lorsqu'une FAQ est déjà visible sur la page (voir app/blog/[slug]).
export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

// Schema.org Blog + CollectionPage sur /blog, avec un ItemList des
// articles — aide Google à découvrir et comprendre la liste complète.
export function blogCollectionSchema(
  articles: { slug: string; title: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": ["Blog", "CollectionPage"],
    name: "Blog AM Growth Solutions",
    url: `${SITE_URL}/blog`,
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${article.slug}`,
        name: article.title,
      })),
    },
  };
}

// Schema.org CollectionPage sur /nos-derniers-projets.
export function projectsCollectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Nos derniers projets — AM Growth Solutions",
    url: `${SITE_URL}/nos-derniers-projets`,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

// Schema.org BreadcrumbList — JSON-LD uniquement, aucun fil d'Ariane
// visible n'est ajouté sur la page. `items` commence toujours par
// {name:"Accueil", path:"/"}.
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

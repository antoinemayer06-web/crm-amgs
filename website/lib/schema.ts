import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";

// Schema.org LocalBusiness — présent sur tout le site (layout racine) pour
// renforcer le référencement local.
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS.name,
    founder: {
      "@type": "Person",
      name: BUSINESS.founder,
    },
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    url: BUSINESS.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: BUSINESS.areaServed,
    sameAs: BUSINESS.sameAs,
  };
}

// Schema.org Person — sur la page à propos, pour renforcer l'association
// entre le nom du fondateur et ce site aux yeux de Google (utile pour les
// recherches sur son nom propre, en plus du "founder" imbriqué dans
// LocalBusiness ci-dessus).
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: BUSINESS.founder,
    jobTitle: "Fondateur",
    worksFor: {
      "@type": "Organization",
      name: BUSINESS.name,
      url: BUSINESS.url,
    },
    url: `${SITE_URL}/a-propos`,
    sameAs: BUSINESS.sameAs,
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
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
    },
    areaServed: BUSINESS.areaServed,
  };
}

// Schema.org Article — un bloc par article de blog (app/blog/[slug]).
export function articleSchema({
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
    "@type": "Article",
    headline: title,
    description,
    image: image ? `${SITE_URL}${image}` : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: BUSINESS.founder,
      url: `${SITE_URL}/a-propos`,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };
}

// Schema.org FAQPage — utilisé sur l'article pilier pour capter les
// featured snippets Google sur les questions fréquentes.
export function faqPageSchema(
  faqs: { question: string; answer: string }[]
) {
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

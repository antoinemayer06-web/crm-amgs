import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";

// Schema.org LocalBusiness — présent sur tout le site (layout racine) pour
// renforcer le référencement local. Pas d'adresse postale précise pour
// l'instant (voir lib/business.ts) : à compléter si une adresse publique
// est décidée (utile pour un futur Google Business Profile).
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

// Schema.org Service — à inclure sur chaque page pilier (gestion de projet,
// administratif & financière).
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

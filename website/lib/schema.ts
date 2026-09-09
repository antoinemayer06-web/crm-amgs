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
    url: BUSINESS.url,
    address: {
      "@type": "PostalAddress",
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: BUSINESS.areaServed,
    sameAs: [] as string[],
  };
}

// Schema.org Service — à inclure sur chaque page pilier (gestion de projet,
// administratif & financier).
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

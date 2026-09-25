import { SITE_URL } from "@/lib/site";
import { CONTACT_EMAIL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/links";

// Informations NAP (Nom / Adresse / Téléphone) — cohérence requise avec un
// futur profil Google Business.
export const BUSINESS = {
  name: "AM Growth Solutions",
  founder: "Antoine Mayer",
  telephone: "+262693327398",
  email: CONTACT_EMAIL,
  streetAddress: "24 rue Mazagran",
  postalCode: "97400",
  addressLocality: "Saint-Denis",
  addressRegion: "La Réunion",
  addressCountry: "RE",
  areaServed: "La Réunion",
  url: SITE_URL,
  whatsapp: WHATSAPP_URL,
  sameAs: [LINKEDIN_URL],
};

import { SITE_URL } from "@/lib/site";
import { WHATSAPP_URL } from "@/lib/links";

// Informations NAP (Nom / Adresse / Téléphone) — cohérence requise avec un
// futur profil Google Business. Pas d'adresse postale précise fournie pour
// l'instant (activité freelance sans local commercial) : on reste au niveau
// région, à affiner si une adresse publique est décidée plus tard.
export const BUSINESS = {
  name: "AM Growth Solutions",
  founder: "Antoine Mayer",
  telephone: "+262693327398",
  addressRegion: "La Réunion",
  addressCountry: "RE",
  areaServed: "La Réunion",
  url: SITE_URL,
  whatsapp: WHATSAPP_URL,
};

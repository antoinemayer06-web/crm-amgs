import type { Metadata } from "next";

// Fabrique un objet Metadata complet et cohérent pour une page interne —
// centralise le pattern répété sur chaque route (canonical absolu, lien RSS,
// openGraph et twitter explicites) pour qu'aucune page n'hérite des
// métadonnées de la home par oubli. Le layout racine (app/layout.tsx) ne
// sert que de repli pour "/", qui ne passe pas par cette fonction : sa
// balise <title> doit rester "marque en tête", ce que le template
// "%s | AM Growth Solutions" du layout casserait si "/" lui fournissait un
// titre à suffixer.
export const RSS_FEED_PATH = "/blog/feed.xml";

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  article,
  exactTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    section?: string;
  };
  // true = le title ne doit PAS passer par le template "%s | AM Growth
  // Solutions" du layout racine (cas d'un title imposé qui ne suit pas ce
  // motif, ex. "Antoine Mayer, fondateur d'AM Growth Solutions (974)").
  // openGraph.title / twitter.title restent toujours la chaîne exacte,
  // quel que soit ce réglage — le template ne s'applique qu'au <title>.
  exactTitle?: boolean;
}): Metadata {
  return {
    title: exactTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": RSS_FEED_PATH },
    },
    openGraph: {
      title,
      description,
      url: path,
      type,
      locale: "fr_FR",
      siteName: "AM Growth Solutions",
      images: image ? [{ url: image }] : undefined,
      ...(type === "article" && article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
            authors: [`https://amgrowthsolutions.fr/a-propos`],
            section: article.section,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

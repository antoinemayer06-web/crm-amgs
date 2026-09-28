import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

// Mot-clé principal : "consultant automatisation La Réunion". Requête
// secondaire visée : "Antoine Mayer" — d'où la marque incluse directement
// dans le title (exactTitle: le motif ne suit pas "| AM Growth Solutions",
// donc pas de template).

export const metadata: Metadata = pageMetadata({
  title: "Antoine Mayer, fondateur d'AM Growth Solutions (974)",
  description:
    "AM Growth Solutions est dirigée par Antoine Mayer, consultant en automatisation basé à La Réunion (974). Une approche sur mesure, sans imposer de nouveaux outils.",
  path: "/a-propos",
  exactTitle: true,
});

export default function AProposPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "À propos", path: "/a-propos" },
        ])}
      />
      <PageIntro title="Mettre les dernières technologies au service des PME." />
      <AboutContent />
    </main>
  );
}

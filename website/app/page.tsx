import type { Metadata } from "next";
import Link from "next/link";
import FinalCta from "@/components/FinalCta";
import Founder from "@/components/Founder";
import Hero from "@/components/Hero";
import Note from "@/components/Note";
import Solutions from "@/components/Solutions";
import Symptoms from "@/components/Symptoms";
import Testimonial from "@/components/Testimonial";
import { RSS_FEED_PATH } from "@/lib/seo";

const HOME_TITLE = "AM Growth Solutions | Automatisation PME à La Réunion (974)";
const HOME_DESCRIPTION =
  "AM Growth Solutions automatise vos outils, dashboards, Microsoft 365 et process administratifs pour les PME de La Réunion (974) — sur mesure, livré vite.";

export const metadata: Metadata = {
  // Pas de `title` string ici : la home reprend le `default` du layout
  // racine tel quel (marque en tête). Lui donner un title propre le
  // ferait passer par le template "%s | AM Growth Solutions" du layout,
  // qui ajouterait la marque APRÈS au lieu d'avant.
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": RSS_FEED_PATH },
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    type: "website",
    locale: "fr_FR",
    siteName: "AM Growth Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Hero + bandeau outils — voir components/Hero.tsx */}

      <Symptoms />

      <Solutions />

      <section className="overflow-hidden bg-surface px-4 pb-4 sm:px-6 lg:px-8">
        <Note>
          Ressource gratuite ! Notre{" "}
          <Link
            href="/blog/automatisation-974-guide-complet-pme-reunion"
            className="underline underline-offset-2 hover:text-primary-dark"
          >
            guide complet de l&apos;automatisation pour les PME réunionnaises
          </Link>{" "}
          détaille les grands types de solutions et la méthode pour démarrer.
        </Note>
      </section>

      <Testimonial />

      <Founder />

      <FinalCta />
    </main>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import PageViewTracker from "@/components/PageViewTracker";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { siteGraphSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const DEFAULT_TITLE =
  "AM Growth Solutions | Automatisation PME à La Réunion (974)";
const DEFAULT_DESCRIPTION =
  "AM Growth Solutions automatise vos outils, dashboards, Microsoft 365 et process administratifs pour les PME de La Réunion (974) — sur mesure, livré vite.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Le layout racine ne fournit que le "default" (repris tel quel par la
    // home, qui ne définit plus son propre title) et le "template" utilisé
    // par toutes les pages internes — jamais l'inverse : si la home
    // redéfinissait un title, le template ajouterait la marque APRÈS,
    // cassant l'ordre "marque en tête" voulu sur "/".
    default: DEFAULT_TITLE,
    template: "%s | AM Growth Solutions",
  },
  description: DEFAULT_DESCRIPTION,
  // Pas de bloc `icons` manuel ici : app/icon.tsx et app/apple-icon.tsx
  // (générés dynamiquement via next/og) sont auto-détectés par Next et
  // injectent eux-mêmes les bonnes balises <link>.
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "fr_FR",
    siteName: "AM Growth Solutions",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_URL}/blog/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <JsonLd data={siteGraphSchema()} />
        <PageViewTracker />
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

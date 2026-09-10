import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { localBusinessSchema } from "@/lib/schema";
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
  "Fini la double saisie entre vos outils. AM Growth Solutions automatise la gestion de projet et l'administratif des PME réunionnaises (La Réunion, 974) — sans changer d'outils. Résultats concrets, délais courts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | AM Growth Solutions",
  },
  description: DEFAULT_DESCRIPTION,
  // Fichiers dans public/ (pas la convention app/icon.png, qui renvoyait un
  // 404 en production sur ce déploiement Vercel monorepo malgré un build
  // local correct). Le "?v=2" est volontaire : une URL de favicon stable
  // peut rester bloquée en cache (CDN et/ou navigateur) sur un ancien
  // contenu ou un 404 antérieur pendant toute sa durée de cache, sans lien
  // avec le déploiement en cours. Changer l'URL force tout le monde à
  // recharger un favicon jamais vu — à incrémenter si un futur changement
  // de logo doit à nouveau forcer un rafraîchissement immédiat.
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-512.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <JsonLd data={localBusinessSchema()} />
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

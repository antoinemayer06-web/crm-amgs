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

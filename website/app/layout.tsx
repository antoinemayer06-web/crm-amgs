import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const TITLE = "AM Growth Solutions | Automatisation sur mesure pour PME";
const DESCRIPTION =
  "Fini la double saisie entre vos outils. AM Growth Solutions connecte votre CRM, votre gestion de projet et vos outils métier pour automatiser vos tâches répétitives — sans changer d'outils. Résultats concrets, délais courts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "fr_FR",
    siteName: "AM Growth Solutions",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
        <Header />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}

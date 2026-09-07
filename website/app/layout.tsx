import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AM Growth Solutions — Automatisation pour PME et cabinets",
  description:
    "AM Growth Solutions connecte vos outils existants (CRM, gestion de projet, stockage, messagerie) pour supprimer la double saisie et automatiser les tâches répétitives, sans imposer de nouveaux outils.",
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
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
      </body>
    </html>
  );
}

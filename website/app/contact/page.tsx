import type { Metadata } from "next";
import Contact from "@/components/Contact";
import PageIntro from "@/components/PageIntro";

// TODO (page volontairement minimale pour l'instant) : ajouter un
// formulaire de prise de contact et un lead magnet ("5 signes que votre
// PME perd du temps en double saisie" contre email), prévus dans le brief
// mais pas encore construits — pour l'instant la prise de contact passe
// par Calendly et WhatsApp.

export const metadata: Metadata = {
  title: "Contact — échangeons sur votre projet",
  description:
    "Prenez rendez-vous pour un appel de 20-30 minutes avec AM Growth Solutions, ou échangez directement par WhatsApp ou LinkedIn.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        title="Parlons de ce qui vous fait perdre du temps"
        subtitle="Un appel de 20-30 minutes suffit pour identifier ce qui peut être automatisé chez vous."
      />
      <Contact />
    </main>
  );
}

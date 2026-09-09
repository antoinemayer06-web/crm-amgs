import type { Metadata } from "next";
import Contact from "@/components/Contact";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Contact — échangeons sur votre projet",
  description:
    "Prenez rendez-vous pour un appel de 20-30 minutes avec AM Growth Solutions, envoyez un message, ou téléchargez la checklist double saisie.",
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

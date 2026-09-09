import type { Metadata } from "next";
import Contact from "@/components/Contact";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Contact — échangeons sur votre projet à La Réunion",
  description:
    "Prenez rendez-vous avec AM Growth Solutions à La Réunion pour un appel de 20-30 minutes, envoyez un message, ou téléchargez la checklist double saisie.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        title="Parlons de ce qui vous fait perdre du temps"
        subtitle="Un appel de 20-30 minutes suffit pour identifier ce qui peut être automatisé chez vous — où que vous soyez à La Réunion."
      />
      <Contact />
    </main>
  );
}

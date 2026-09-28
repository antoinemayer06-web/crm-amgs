import type { Metadata } from "next";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact et prise de rendez-vous",
  description:
    "Prenez rendez-vous avec AM Growth Solutions à La Réunion (974) pour un appel de 20-30 minutes, ou contactez-nous directement par WhatsApp, LinkedIn ou email.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageIntro
        title="Parlons de ce qui vous fait perdre du temps"
        subtitle="Un appel de 20-30 minutes suffit pour identifier ce qui peut être automatisé chez vous — où que vous soyez à La Réunion."
      />
      <Contact />
    </main>
  );
}

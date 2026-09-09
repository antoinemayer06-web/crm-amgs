import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import Process from "@/components/Process";

export const metadata: Metadata = {
  title: "Comment ça marche — méthode sur mesure",
  description:
    "Appel de cadrage, diagnostic, build et mise en service : la méthode AM Growth Solutions pour automatiser votre PME à La Réunion, sans délai générique imposé.",
  alternates: { canonical: "/comment-ca-marche" },
};

export default function CommentCaMarchePage() {
  return (
    <main>
      <PageIntro
        title="Comment ça marche : une méthode simple, sur mesure"
        subtitle="Quatre étapes, du premier échange à la mise en service — sans forfait générique ni délai universel."
      />
      <Process />
    </main>
  );
}

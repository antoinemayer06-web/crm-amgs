import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import PricingFactors from "@/components/PricingFactors";
import Process from "@/components/Process";
import ProcessOverview from "@/components/ProcessOverview";

export const metadata: Metadata = {
  title: "Comment ça marche — méthode et tarifs sur mesure",
  description:
    "Appel de cadrage, diagnostic, build et mise en service : la méthode AM Growth Solutions pour automatiser votre PME à La Réunion (974). Devis personnalisé, jamais de tarif générique.",
  alternates: { canonical: "/comment-ca-marche" },
};

export default function CommentCaMarchePage() {
  return (
    <main>
      <PageIntro
        title="Comment ça marche : une méthode simple, sur mesure"
        subtitle="Quatre étapes, du premier échange à la mise en service — sans forfait générique ni délai universel."
      />
      <ProcessOverview />
      <Process />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
            Un devis personnalisé, jamais un tarif générique
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Annoncer une fourchette de prix avant d&apos;avoir vu votre
            fonctionnement réel reviendrait à deviner. Ce qui détermine le
            coût d&apos;une mission, ce n&apos;est pas sa catégorie, c&apos;est
            trois choses concrètes :
          </p>

          <PricingFactors />

          <div className="mt-12 rounded-2xl bg-ink p-8 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-white/70" />
            <p className="mt-4 font-heading text-xl font-black text-white">
              Un premier échange pour cadrer votre projet
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
              Un appel de 20-30 minutes suffit pour comprendre votre
              fonctionnement et vous proposer un devis ferme, adapté à votre
              situation — pas un tarif générique.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
            >
              Demander un devis personnalisé
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Layers, MessageCircle, Wrench } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import Process from "@/components/Process";

export const metadata: Metadata = {
  title: "Comment ça marche — méthode et tarifs sur mesure",
  description:
    "Appel de cadrage, diagnostic, build et mise en service : la méthode AM Growth Solutions pour automatiser votre PME à La Réunion (974). Devis personnalisé, jamais de tarif générique.",
  alternates: { canonical: "/comment-ca-marche" },
};

const FACTORS = [
  {
    icon: Layers,
    title: "Le nombre d'outils à connecter",
    description:
      "Relier deux outils entre eux n'a pas la même portée qu'orchestrer un système à cinq outils.",
  },
  {
    icon: Wrench,
    title: "La complexité des règles métier",
    description:
      "Une synchronisation simple n'a rien à voir avec des automatisations en cascade, conditionnelles, propres à votre fonctionnement.",
  },
  {
    icon: ClipboardCheck,
    title: "Le suivi dans le temps",
    description:
      "Certaines missions s'arrêtent à la mise en service, d'autres incluent un ajustement régulier du système au fil de son usage réel.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <main>
      <PageIntro
        title="Comment ça marche : une méthode simple, sur mesure"
        subtitle="Quatre étapes, du premier échange à la mise en service — sans forfait générique ni délai universel."
      />
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

          <div className="mt-8 space-y-4">
            {FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-background p-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {factor.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {factor.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

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

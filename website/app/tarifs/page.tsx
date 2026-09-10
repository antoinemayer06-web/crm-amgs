import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Layers, MessageCircle, Wrench } from "lucide-react";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Tarifs — devis personnalisé",
  description:
    "Chaque système d'automatisation est chiffré sur mesure à La Réunion (974), selon le nombre d'outils à connecter et la complexité réelle des règles métier. Devis après un premier échange.",
  alternates: { canonical: "/tarifs" },
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

export default function TarifsPage() {
  return (
    <main>
      <PageIntro
        title="Un devis personnalisé, jamais un tarif générique"
        subtitle="Aucun système d'automatisation ne ressemble à un autre — le prix se construit après avoir compris le vôtre, pas avant."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-base leading-relaxed text-muted">
            Annoncer une fourchette de prix avant d&apos;avoir vu votre
            fonctionnement réel reviendrait à deviner. Ce qui détermine le
            coût d&apos;une mission, ce n&apos;est pas sa catégorie, c&apos;est
            trois choses concrètes :
          </p>

          <div className="mt-10 space-y-4">
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
                    <h2 className="font-heading text-base font-bold text-foreground">
                      {factor.title}
                    </h2>
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

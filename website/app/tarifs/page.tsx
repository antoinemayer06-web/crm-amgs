import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { PRICING_TIERS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tarifs — fourchettes indicatives",
  description:
    "Fourchettes de prix pour l'automatisation de PME à La Réunion (974) : audit, automatisation simple, gestion de projet, systèmes multi-outils et suivi mensuel.",
  alternates: { canonical: "/tarifs" },
};

export default function TarifsPage() {
  return (
    <main>
      <PageIntro
        title="Des fourchettes claires, un devis toujours personnalisé"
        subtitle="Chaque automatisation dépend de votre fonctionnement réel. Voici des repères de prix, pas des tarifs figés."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.label}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {tier.label}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {tier.description}
                  </p>
                </div>
                <p className="shrink-0 whitespace-nowrap font-heading text-xl font-black text-primary-dark">
                  À partir de {tier.from}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-ink p-8 text-center">
            <p className="font-heading text-xl font-black text-white">
              Le bon tarif dépend de votre situation
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
              Ces fourchettes donnent un ordre de grandeur. Le diagnostic
              initial permet de cadrer précisément le périmètre et
              d&apos;annoncer un prix et un délai fermes avant tout
              engagement.
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

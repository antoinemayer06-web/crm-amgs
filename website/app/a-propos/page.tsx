import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { CASE_STUDY } from "@/lib/content";

// Mot-clé principal : "consultant automatisation La Réunion"

export const metadata: Metadata = {
  title: "À propos — Antoine Mayer, consultant automatisation à La Réunion",
  description:
    "AM Growth Solutions est dirigée par Antoine Mayer, consultant en automatisation basé à La Réunion (974). Une approche sur mesure, sans imposer de nouveaux outils.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <main>
      <PageIntro
        title="Antoine Mayer, consultant en automatisation à La Réunion"
        subtitle="AM Growth Solutions accompagne les PME réunionnaises qui jonglent entre plusieurs outils déconnectés."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 text-base leading-relaxed text-muted">
            <p>
              Je dirige AM Growth Solutions, une activité freelance
              d&apos;automatisation basée à La Réunion. Je travaille avec des
              PME de 3 à 30 personnes — cabinets de conseil, bureaux
              d&apos;études, cabinets d&apos;ingénierie et d&apos;expertise,
              agences — qui utilisent déjà un CRM ou un outil de gestion,
              mais qui perdent du temps à ressaisir la même information dans
              plusieurs logiciels.
            </p>
            <p>
              Mon approche part d&apos;un constat simple : la plupart des
              PME n&apos;ont pas besoin d&apos;un outil supplémentaire, mais
              d&apos;un lien entre ceux qu&apos;elles utilisent déjà. Je ne
              propose donc pas de solution standardisée à imposer à votre
              équipe — je connecte les outils en place, j&apos;automatise ce
              qui se répète, et j&apos;adapte le système à votre
              fonctionnement réel, pas l&apos;inverse.
            </p>
            <p>
              Ce qui me différencie, ce n&apos;est pas un discours sur le
              gain de temps — c&apos;est la rapidité de livraison, vérifiable
              sur des missions réelles. Pour {CASE_STUDY.client}, un{" "}
              {CASE_STUDY.sector} réunionnais, une mission annoncée à{" "}
              {CASE_STUDY.missions[0].quotedDelay} a été livrée en{" "}
              {CASE_STUDY.missions[0].actualDelay}. Le détail est dans{" "}
              <Link
                href={CASE_STUDY.href}
                className="font-semibold text-primary underline underline-offset-2"
              >
                l&apos;étude de cas complète
              </Link>
              .
            </p>
            <p>
              Basé à La Réunion, j&apos;interviens auprès d&apos;entreprises
              réunionnaises qui connaissent les mêmes contraintes que moi :
              des équipes resserrées, où chaque heure passée à ressaisir une
              information est une heure qui manque ailleurs.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="font-heading text-xl font-black text-white">
              On en discute ?
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

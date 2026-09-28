import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";

// Page 404 personnalisée — Next.js renvoie automatiquement un vrai statut
// HTTP 404 pour toute route non résolue quand ce fichier existe, avec
// `noindex` ci-dessous pour empêcher toute indexation accidentelle.
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      <PageIntro
        title="Page introuvable"
        subtitle="Cette page n'existe pas ou plus. Voici quelques liens utiles pour continuer votre navigation."
      />
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/services"
              className="inline-block rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Voir nos services
            </Link>
            <Link
              href="/blog"
              className="inline-block rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Lire le blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

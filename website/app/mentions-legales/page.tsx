import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Mentions légales — AM Growth Solutions",
  description:
    "Mentions légales du site amgrowthsolutions.fr : éditeur, hébergement et propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <main>
      <PageIntro title="Mentions légales" />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Éditeur du site
            </h2>
            <div className="mt-4 space-y-1 text-base leading-relaxed text-muted">
              <p>Le site amgrowthsolutions.fr est édité par :</p>
              <p>
                Antoine MAYER, exerçant en micro-entreprise sous la
                dénomination commerciale &laquo; AM Growth Solutions &raquo;
              </p>
              <p>Statut : Micro-entreprise (auto-entrepreneur)</p>
              <p>SIRET : 999 852 973 00018</p>
              <p>Adresse : 24 rue Mazagran, 97400 Saint-Denis, La Réunion</p>
              <p>TVA non applicable, article 293 B du Code Général des Impôts</p>
              <p>
                Email :{" "}
                <a
                  href="mailto:antoine.mayer@amgrowthsolutions.fr"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  antoine.mayer@amgrowthsolutions.fr
                </a>
              </p>
              <p>Téléphone : 0693327398</p>
              <p className="pt-2">
                Directeur de la publication : Antoine MAYER
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Hébergement
            </h2>
            <div className="mt-4 space-y-1 text-base leading-relaxed text-muted">
              <p>Le site est hébergé par :</p>
              <p>Vercel Inc.</p>
              <p>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p>
                Site web :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  vercel.com
                </a>
              </p>
              <p className="pt-2">
                Le nom de domaine est enregistré auprès de :
              </p>
              <p>OVH SAS</p>
              <p>2 rue Kellermann, 59100 Roubaix, France</p>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Propriété intellectuelle
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              L&apos;ensemble des contenus présents sur ce site (textes,
              visuels, éléments graphiques, logo) est la propriété exclusive
              d&apos;Antoine MAYER / AM Growth Solutions, sauf mention
              contraire. Toute reproduction, même partielle, est interdite
              sans autorisation préalable.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Politique de confidentialité — AM Growth Solutions",
  description:
    "Quelles données sont collectées sur amgrowthsolutions.fr et comment elles sont utilisées, conformément au RGPD.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main>
      <PageIntro title="Politique de confidentialité" />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-10">
          <p className="text-base leading-relaxed text-muted">
            Cette page explique quelles données sont collectées lors de
            votre visite sur amgrowthsolutions.fr et comment elles sont
            utilisées, conformément au Règlement Général sur la Protection
            des Données (RGPD).
          </p>

          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Responsable du traitement
            </h2>
            <div className="mt-4 space-y-1 text-base leading-relaxed text-muted">
              <p>Antoine MAYER, AM Growth Solutions</p>
              <p>
                <a
                  href="mailto:antoine.mayer@amgrowthsolutions.fr"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  antoine.mayer@amgrowthsolutions.fr
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Données collectées
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              La prise de contact s&apos;effectue via plusieurs canaux, dont
              certains impliquent des services tiers :
            </p>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted">
              <li>
                <span className="font-semibold text-foreground/90">
                  Calendly
                </span>{" "}
                (prise de rendez-vous, widget intégré directement sur le
                site) : ce service peut déposer des cookies techniques
                nécessaires à son fonctionnement. Calendly dispose de sa
                propre politique de confidentialité, consultable sur{" "}
                <a
                  href="https://calendly.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  calendly.com/privacy
                </a>
                .
              </li>
              <li>
                <span className="font-semibold text-foreground/90">
                  WhatsApp
                </span>{" "}
                (contact direct) : en cliquant sur le bouton WhatsApp, vous
                êtes redirigé vers l&apos;application WhatsApp pour échanger
                directement avec Antoine Mayer. WhatsApp (Meta) dispose de sa
                propre politique de confidentialité.
              </li>
              <li>
                <span className="font-semibold text-foreground/90">
                  LinkedIn
                </span>{" "}
                : le lien vers le profil LinkedIn vous redirige vers la
                plateforme LinkedIn, soumise à sa propre politique de
                confidentialité.
              </li>
              <li>
                <span className="font-semibold text-foreground/90">
                  Email
                </span>{" "}
                (contact@amgrowthsolutions.fr) : si vous nous contactez par
                email, les informations transmises (nom, email, contenu du
                message) sont conservées le temps nécessaire au traitement de
                votre demande et ne sont jamais transmises à des tiers ni
                utilisées à des fins commerciales sans votre consentement.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Cookies
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Ce site n&apos;utilise aucun cookie de mesure d&apos;audience
              ou publicitaire pour son propre compte. Le widget de prise de
              rendez-vous intégré (Calendly) peut déposer ses propres
              cookies techniques, gérés selon la politique de
              confidentialité de Calendly.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Vos droits
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Conformément au RGPD, vous disposez d&apos;un droit
              d&apos;accès, de rectification et de suppression des données
              vous concernant. Pour exercer ce droit, contactez{" "}
              <a
                href="mailto:antoine.mayer@amgrowthsolutions.fr"
                className="font-semibold text-primary underline underline-offset-2"
              >
                antoine.mayer@amgrowthsolutions.fr
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

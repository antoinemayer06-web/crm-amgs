import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageIntro from "@/components/PageIntro";
import { serviceSchema } from "@/lib/schema";

// Page de synthèse unique pour les 7 types de solutions déjà présentés sur
// l'accueil (section "Notre remède") — remplace les deux anciennes pages
// piliers (automatisation-gestion-projet, automatisation-administrative-
// financiere), trop étroites pour refléter la largeur réelle de l'activité.

const SERVICES = [
  {
    slot: "solution-1-connexion-outils",
    image: "/images/solutions/solution-1-connexion-outils.jpg",
    title: "Connexion d'outils entre eux",
    description:
      "Votre CRM, votre outil de gestion de projet, votre stockage cloud — chacun fait bien son travail, mais ils ne se parlent pas entre eux. Nous les connectons pour que l'information circule automatiquement d'un outil à l'autre, sans ressaisie manuelle et sans changer vos habitudes.",
  },
  {
    slot: "solution-2-site-formulaire",
    image: "/images/solutions/solution-2-site-formulaire-v3.jpg",
    title: "Sites ou formulaires reliés à une base de données",
    description:
      "Un formulaire rempli par un client ou un collaborateur peut déclencher automatiquement la création d'une fiche dans votre CRM ou votre base de données — sans que personne n'ait à recopier l'information à la main. Utile pour la collecte de leads, les demandes internes, ou le suivi de dossiers.",
  },
  {
    slot: "solution-3-dashboards",
    image: "/images/solutions/solution-3-dashboards-v2.jpg",
    title: "Dashboards de pilotage automatiques",
    description:
      "Un tableau de bord type Power BI qui se met à jour tout seul, à partir des données déjà présentes dans vos outils. Fini les rapports compilés à la main chaque semaine — l'information est à jour en permanence, visible d'un coup d'œil.",
  },
  {
    slot: "solution-4-microsoft-365",
    image: "/images/solutions/solution-4-microsoft-365.jpg",
    title: "Automatisations Microsoft 365",
    description:
      "Excel avancé, Power Automate, Microsoft Forms — la suite Microsoft que vous utilisez déjà peut faire beaucoup plus que ce que vous en exploitez aujourd'hui. Nous construisons des flux automatiques entre vos fichiers et vos outils pour éliminer les tâches répétitives internes.",
  },
  {
    slot: "solution-5-administratif-financier",
    image: "/images/solutions/solution-5-administratif-financier.jpg",
    title: "Automatisation administrative & financière",
    description:
      "Devis, factures, relances de paiement : autant de tâches répétitives qui peuvent être générées et envoyées automatiquement dès qu'une condition est remplie, sans ressaisie entre votre CRM et votre outil de facturation.",
  },
  {
    slot: "solution-6-charge-equipe",
    image: "/images/solutions/solution-6-charge-equipe.jpg",
    title: "Suivi de charge d'équipe",
    description:
      "Un plan de charge automatique qui montre en temps réel qui est disponible et qui est débordé, construit directement à partir des tâches déjà assignées dans vos outils — sans tableur à mettre à jour à la main.",
  },
  {
    slot: "solution-7-ia",
    image: "/images/solutions/solution-7-ia.jpg",
    title: "Agents & assistants IA",
    description:
      "Veille de marché automatique, extraction de documents, catégorisation, réponses automatisées — des agents IA conçus sur mesure pour des cas d'usage concrets de votre activité, pas un gadget ajouté après coup.",
  },
];

export const metadata: Metadata = {
  title: "Nos services d'automatisation | AM Growth Solutions",
  description:
    "Connexion d'outils, dashboards, automatisations Microsoft 365, agents IA sur mesure — découvrez les automatisations possibles pour votre PME à La Réunion (974).",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <JsonLd
        data={serviceSchema({
          name: "Automatisation de processus métier pour PME",
          description:
            "Connexion d'outils entre eux, sites et formulaires reliés à une base de données, dashboards de pilotage, automatisations Microsoft 365, automatisation administrative et financière, suivi de charge d'équipe, agents et assistants IA sur mesure.",
          path: "/services",
        })}
      />

      <PageIntro
        title="Nos services d'automatisation"
        subtitle="Chaque entreprise a un fonctionnement différent. Plutôt qu'une solution standardisée, nous construisons le système adapté à vos outils et vos process réels — qu'il s'agisse de connecter deux logiciels entre eux ou de bâtir un système complet sur mesure."
      />

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {SERVICES.map((service, index) => (
              <article
                key={service.slot}
                className="overflow-hidden rounded-2xl border border-border bg-background"
              >
                <div className="relative aspect-[3/1] w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 672px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-heading text-sm font-bold text-white"
                    >
                      {index + 1}
                    </span>
                    <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                      {service.title}
                    </h2>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-ink p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-heading text-xl font-black text-white">
                Un fonctionnement similaire au vôtre ?
              </p>
              <p className="mt-1 text-sm text-white/70">
                Chaque système est chiffré sur mesure après un premier
                échange.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

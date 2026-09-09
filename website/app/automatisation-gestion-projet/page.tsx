import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PillarPage from "@/components/PillarPage";
import { PILLARS } from "@/lib/content";
import { serviceSchema } from "@/lib/schema";

// Mot-clé principal : "automatisation gestion de projet"
// Mot-clé secondaire : "automatisation CRM"

const PILLAR = PILLARS[0];

export const metadata: Metadata = {
  title: "Automatisation de la gestion de projet à La Réunion",
  description:
    "Connectez votre CRM et votre outil de gestion de projet : dossiers, tâches et plans de charge créés automatiquement. Pour les PME de La Réunion, sans changer d'outils.",
  alternates: { canonical: PILLAR.href },
};

export default function AutomatisationGestionProjetPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: PILLAR.title,
          description: PILLAR.shortDescription,
          path: PILLAR.href,
        })}
      />
      <PillarPage
        title="Automatisation de la gestion de projet pour PME à La Réunion"
        intro="Vous utilisez déjà un CRM ou un outil de gestion, mais chaque nouveau projet veut dire recréer un dossier, une tâche, un rappel — à la main, dans plusieurs outils. AM Growth Solutions connecte ce qui existe déjà pour que ça se fasse tout seul."
        questionHeading="Comment automatiser la gestion de projet sans changer d'outil ?"
        questionAnswer={[
          "La plupart des PME réunionnaises que j'accompagne utilisent déjà au moins deux outils pour gérer leurs projets : un CRM (Axonaut, HubSpot...) pour le commercial, et un outil de gestion de tâches (ClickUp, Monday, Trello...) pour le suivi opérationnel. Le problème n'est pas le nombre d'outils, c'est qu'ils ne se parlent pas entre eux. Chaque nouveau client signé dans le CRM doit être recréé manuellement dans l'outil de gestion — dossier, tâches, échéances, affectation à l'équipe.",
          "L'automatisation ne remplace aucun de ces outils : elle les connecte. Dès qu'un projet passe au statut « gagné » dans le CRM, un dossier structuré, des tâches types et des notifications sont créés automatiquement dans l'outil de gestion, avec les bonnes personnes déjà assignées. Le dirigeant garde ses habitudes, l'équipe garde ses outils du quotidien — seule la ressaisie manuelle disparaît.",
          "La brique la plus demandée reste le plan de charge automatique : au lieu d'un tableur mis à jour à la main (ou jamais), chacun voit en temps réel qui est disponible et qui est débordé, directement à partir des tâches déjà assignées dans l'outil de gestion. Ça change concrètement la façon de répartir les nouveaux dossiers dans l'équipe.",
        ]}
        bulletsHeading="Ce qui est automatisé concrètement"
        bullets={[...PILLAR.bullets]}
        pricingLabel="Automatisation de gestion de projet"
        pricingFrom="1 800€"
      />
    </>
  );
}

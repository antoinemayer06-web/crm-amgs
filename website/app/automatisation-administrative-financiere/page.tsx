import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PillarPage from "@/components/PillarPage";
import { PILLARS } from "@/lib/content";
import { serviceSchema } from "@/lib/schema";

// Mot-clé principal : "optimisation processus administratifs PME"
// Mot-clé secondaire : "automatisation CRM"

const PILLAR = PILLARS[1];

export const metadata: Metadata = {
  title: "Automatisation administrative & financière à La Réunion",
  description:
    "Devis, factures et relances générés depuis votre CRM, reporting automatique envoyé au dirigeant. Optimisation des processus administratifs des PME de La Réunion (974).",
  alternates: { canonical: PILLAR.href },
};

export default function AutomatisationAdministrativeFinanciere() {
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
        title="Automatisation administrative & financière pour PME à La Réunion"
        intro="Devis refaits à la main, factures ressaisies dans le logiciel de compta, relances oubliées, reporting compilé le week-end : la partie administrative d'une PME prend souvent plus de temps que le métier lui-même. Elle peut être automatisée sans changer de logiciel de comptabilité."
        questionHeading="Comment automatiser les devis, factures et relances sans changer de logiciel ?"
        questionAnswer={[
          "Dans beaucoup de PME, l'information existe déjà dans le CRM — le client, le montant, les prestations — mais elle est retapée une deuxième fois pour éditer le devis, puis une troisième fois dans le logiciel de comptabilité pour la facture. Chaque ressaisie est une occasion d'erreur, et personne n'a le temps de relancer systématiquement les factures impayées.",
          "L'automatisation consiste à faire circuler cette information une seule fois : le devis et la facture sont générés directement depuis les données du CRM, puis synchronisés avec l'outil de comptabilité déjà en place. Aucun nouveau logiciel n'est imposé à l'équipe comptable — le système vient combler le vide entre les outils existants, pas les remplacer.",
          "Deux automatisations reviennent le plus souvent chez nos clients réunionnais : les relances de factures impayées, déclenchées automatiquement à échéance sans qu'un dirigeant ait à s'en souvenir, et le reporting périodique — un tableau de bord ou un rapport envoyé par email, généré tout seul, sans avoir à le demander ni à le compiler à la main.",
        ]}
        bulletsHeading="Ce qui est automatisé concrètement"
        bullets={[...PILLAR.bullets]}
      />
    </>
  );
}

// Injecte un objet Schema.org en JSON-LD. Toutes les données viennent de
// lib/schema.ts (contenu statique, pas de saisie utilisateur) — pas de
// risque d'injection à sérialiser ici.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

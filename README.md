# CRM — AM Growth Solutions

CRM interne pour piloter l'agence : prospection, deals, projets de livraison,
marketing et base de connaissance.

**Stack** : React + Vite + Tailwind CSS (frontend), Supabase (base de données,
auth, storage).

## Installation

```bash
npm install
cp .env.example .env
```

Renseignez dans `.env` :

```
VITE_SUPABASE_URL=https://<votre-projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé-anon>
```

Puis lancez le serveur de dev :

```bash
npm run dev
```

## Base de données Supabase

Le schéma complet se trouve dans `supabase/migrations/20260901000000_init_schema.sql`.

Pour l'appliquer :

- **Via l'éditeur SQL de Supabase** : copiez/collez le contenu du fichier de
  migration dans SQL Editor > New query, puis exécutez.
- **Via la CLI Supabase** (si le projet est lié) :

  ```bash
  npx supabase link --project-ref <votre-project-ref>
  npx supabase db push
  ```

### Étapes de pipeline par défaut

Les 7 étapes par défaut (Nouveau, Qualifié, RDV pris, Proposition envoyée,
Négociation, Gagné, Perdu) ne sont pas créées automatiquement par la
migration car elles dépendent de l'utilisateur connecté (`owner_id`). Une
fois authentifié dans l'app, appelez une seule fois :

```js
await supabase.rpc('seed_default_pipeline_stages')
```

### Sécurité (RLS)

Toutes les tables ont `owner_id` (par défaut `auth.uid()`) et Row Level
Security activé : chaque utilisateur ne voit que ses propres données. La
structure est prête pour du multi-utilisateur, même si un seul compte est
utilisé pour l'instant.

## Prochaines étapes

Les pages de l'interface seront construites une par une dans les prochaines
itérations.

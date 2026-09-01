-- Le statut de facturation/livraison ne se pilote plus au niveau de
-- l'entreprise (un client peut avoir plusieurs projets, chacun avec son
-- propre statut) : il sera réintroduit sur la table `projects` quand la
-- page dédiée sera construite. On retire les colonnes correspondantes
-- de `companies`.

alter table public.companies drop constraint if exists statut_livraison_only_for_client;
alter table public.companies drop constraint if exists companies_statut_livraison_check;
alter table public.companies drop column if exists statut_livraison;
alter table public.companies drop column if exists date_echeance;

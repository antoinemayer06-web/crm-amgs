-- Refonte du modèle companies : status binaire (prospect/client),
-- source restreinte, suppression de tags, website -> contact,
-- temperature commune aux deux statuts, nouveaux enums de suivi.

-- 1) Normaliser les données existantes avant de resserrer les contraintes.
--    dormant -> prospect à relancer (sans_réponse) ; perdu -> supprimé.
update public.companies
  set status = 'prospect', statut_prospect = coalesce(statut_prospect, 'sans_réponse')
  where status = 'dormant';

delete from public.companies where status = 'perdu';

update public.companies
  set source = null
  where source is not null
    and source not in ('linkedin', 'email', 'bouche_à_oreille', 'campagne_publicitaire', 'appel');

update public.companies
  set statut_prospect = case statut_prospect
    when 'réunion_de_cadrage' then 'en_discussion'
    when 'en_attente' then 'à_contacter'
    else statut_prospect
  end
  where statut_prospect is not null;

update public.companies
  set statut_livraison = case statut_livraison
    when 'en_cours' then 'en_cours_livraison'
    when 'échéance' then 'en_cours_livraison'
    when 'facturé' then 'facture_transmise'
    else statut_livraison
  end
  where statut_livraison is not null;

-- 2) Retirer les anciennes contraintes CHECK (noms auto-générés à la
-- création : on les retrouve dynamiquement plutôt que de deviner un nom).
do $$
declare r record;
begin
  for r in
    select distinct con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'companies'
      and att.attname in ('status', 'source', 'statut_prospect', 'statut_livraison')
      and con.contype = 'c'
  loop
    execute format('alter table public.companies drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.companies drop constraint if exists temperature_only_for_client;

-- 3) Nouvelles contraintes.
alter table public.companies
  add constraint companies_status_check check (status in ('prospect', 'client'));

alter table public.companies
  add constraint companies_source_check
    check (source in ('linkedin', 'email', 'bouche_à_oreille', 'campagne_publicitaire', 'appel'));

alter table public.companies
  add constraint companies_statut_prospect_check
    check (statut_prospect in (
      'à_contacter', 'contacté', 'sans_réponse', 'refus',
      'en_discussion', 'devis_à_transmettre', 'devis_transmis', 'devis_signé'
    ));

alter table public.companies
  add constraint companies_statut_livraison_check
    check (statut_livraison in ('en_cours_livraison', 'livré', 'à_facturer', 'facture_transmise', 'payé'));

alter table public.companies
  add constraint statut_prospect_only_for_prospect
    check (statut_prospect is null or status = 'prospect');

alter table public.companies
  add constraint statut_livraison_only_for_client
    check (statut_livraison is null or status = 'client');

-- 4) Colonnes : tags supprimé, website -> contact, nouvelles dates.
alter table public.companies drop column tags;
alter table public.companies rename column website to contact;
alter table public.companies add column date_contact date;
alter table public.companies add column date_echeance date;

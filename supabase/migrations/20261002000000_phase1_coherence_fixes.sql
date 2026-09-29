-- Phase 1 de la refonte de cohérence — corrections de bugs, sans aucune
-- suppression de données. Toutes les opérations ci-dessous sont
-- additives ou des renommages de valeurs qui préservent les lignes
-- existantes (voir le rapport d'audit pour le contexte de chaque point).

-- ---------------------------------------------------------------------
-- 1) companies.source : 'site_web' était déjà proposé dans l'interface
-- (constants.js) et utilisé par défaut lors de la conversion d'une
-- demande de site en prospect, mais absent de la contrainte CHECK —
-- ce qui fait échouer l'insertion. On l'ajoute à la liste autorisée.
-- ---------------------------------------------------------------------
alter table public.companies drop constraint companies_source_check;
alter table public.companies
  add constraint companies_source_check
    check (source in (
      'linkedin', 'email', 'bouche_à_oreille', 'campagne_publicitaire', 'appel', 'site_web'
    ));

-- ---------------------------------------------------------------------
-- 2) notification_settings.types_actifs : la valeur par défaut stockée
-- en base ne listait que les 5 premiers types de notification créés
-- historiquement. On la complète avec les 3 types ajoutés depuis
-- (objectif_fin_mois, evenement_calendrier, nouvelle_demande_site), et
-- on fusionne ces clés manquantes dans les lignes déjà existantes SANS
-- toucher aux préférences déjà personnalisées par l'utilisateur sur les
-- types déjà présents (jsonb '||' : les clés à gauche de l'opérateur ne
-- sont écrasées que si absentes à droite — ici c'est l'inverse : on part
-- des valeurs existantes et on complète seulement ce qui manque).
-- ---------------------------------------------------------------------
alter table public.notification_settings
  alter column types_actifs set default '{
    "action_marketing_du_jour": true,
    "facture_impayee_7j": true,
    "objectif_mi_mois": true,
    "objectif_fin_mois": true,
    "projet_demarre_ou_termine_bientot": true,
    "prospect_bloque_devis": true,
    "evenement_calendrier": true,
    "nouvelle_demande_site": true
  }'::jsonb;

update public.notification_settings
set types_actifs =
  jsonb_build_object(
    'objectif_fin_mois', coalesce(types_actifs -> 'objectif_fin_mois', 'true'::jsonb),
    'evenement_calendrier', coalesce(types_actifs -> 'evenement_calendrier', 'true'::jsonb),
    'nouvelle_demande_site', coalesce(types_actifs -> 'nouvelle_demande_site', 'true'::jsonb)
  ) || types_actifs
where not (
  types_actifs ? 'objectif_fin_mois'
  and types_actifs ? 'evenement_calendrier'
  and types_actifs ? 'nouvelle_demande_site'
);

-- ---------------------------------------------------------------------
-- 3) demandes_site <-> companies : ajoute le lien manquant. Nullable
-- (une demande non convertie n'a pas d'entreprise), mis à jour par le
-- code lors de la conversion (voir SiteDemandesTab.jsx).
-- ---------------------------------------------------------------------
alter table public.demandes_site
  add column company_id uuid references public.companies(id) on delete set null;

create index demandes_site_company_id_idx on public.demandes_site(company_id);

-- ---------------------------------------------------------------------
-- 4) demandes_site.statut : harmonisation de la casse vers le format du
-- reste de l'application (minuscules + underscores). Migration des
-- lignes existantes d'abord, puis nouvelle contrainte CHECK — si cette
-- dernière échoue, c'est qu'une ligne porte une valeur de statut en
-- dehors des 4 connues (à signaler, le CASE ci-dessous ne couvre que les
-- 4 valeurs jamais proposées par l'interface ou la fonction leads-quiz).
-- ---------------------------------------------------------------------
update public.demandes_site
set statut = case statut
  when 'Nouveau' then 'nouveau'
  when 'Contacté' then 'contacte'
  when 'Converti' then 'converti'
  when 'Rejeté' then 'rejete'
  else statut
end;

alter table public.demandes_site alter column statut set default 'nouveau';

alter table public.demandes_site
  add constraint demandes_site_statut_check
    check (statut in ('nouveau', 'contacte', 'converti', 'rejete'));

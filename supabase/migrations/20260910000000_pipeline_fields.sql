-- Champs de pipeline pour les prospects (page Pipeline), rattachés
-- directement à companies pour éviter une table deals séparée.

alter table public.companies
  add column if not exists valeur_estimee numeric,
  add column if not exists prochaine_action text,
  add column if not exists date_prochaine_action date;

alter table public.companies
  add constraint valeur_estimee_only_for_prospect
    check (valeur_estimee is null or status = 'prospect'),
  add constraint prochaine_action_only_for_prospect
    check (prochaine_action is null or status = 'prospect'),
  add constraint date_prochaine_action_only_for_prospect
    check (date_prochaine_action is null or status = 'prospect');

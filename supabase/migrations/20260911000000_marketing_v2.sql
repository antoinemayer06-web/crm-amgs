-- Marketing v2 : rattachement optionnel à un prospect, simplification du
-- statut (planifié / publié / annulé), et récurrence à la création.

alter table public.marketing_actions
  add column if not exists company_id uuid references public.companies(id) on delete set null;

create index if not exists marketing_actions_company_id_idx on public.marketing_actions(company_id);

update public.marketing_actions
  set statut = 'planifié'
  where statut = 'en_cours';

do $$
declare r record;
begin
  for r in
    select distinct con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'marketing_actions'
      and att.attname = 'statut'
      and con.contype = 'c'
  loop
    execute format('alter table public.marketing_actions drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.marketing_actions
  add constraint marketing_actions_statut_check
    check (statut in ('planifié', 'publié', 'annulé'));

-- Récurrence : les trois colonnes vont toujours ensemble (soit toutes
-- nulles, soit toutes renseignées). Les occurrences sont matérialisées
-- en plusieurs lignes dès la création, chacune restant modifiable /
-- supprimable indépendamment.
alter table public.marketing_actions
  add column if not exists recurrence_frequence text
    check (recurrence_frequence in ('jour', 'semaine', 'mois')),
  add column if not exists recurrence_intervalle integer,
  add column if not exists recurrence_fin date;

alter table public.marketing_actions
  add constraint recurrence_fields_consistent
    check (
      (recurrence_frequence is null and recurrence_intervalle is null and recurrence_fin is null)
      or (
        recurrence_frequence is not null
        and recurrence_intervalle is not null and recurrence_intervalle > 0
        and recurrence_fin is not null
      )
    );

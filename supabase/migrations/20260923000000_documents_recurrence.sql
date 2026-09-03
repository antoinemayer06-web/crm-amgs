-- Factures récurrentes (même mécanique que les dépenses/actions
-- marketing : les occurrences sont matérialisées en plusieurs lignes
-- dès la génération, chacune restant modifiable/supprimable
-- indépendamment) — optionnel, project par project.

alter table public.documents
  add column if not exists recurrence_frequence text
    check (recurrence_frequence in ('jour', 'semaine', 'mois')),
  add column if not exists recurrence_intervalle integer,
  add column if not exists recurrence_fin date;

alter table public.documents
  add constraint recurrence_fields_consistent
    check (
      (recurrence_frequence is null and recurrence_intervalle is null and recurrence_fin is null)
      or (
        recurrence_frequence is not null
        and recurrence_intervalle is not null and recurrence_intervalle > 0
        and recurrence_fin is not null
      )
    );

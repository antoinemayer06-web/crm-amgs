-- Récurrence sur les dépenses (même mécanique que marketing_actions :
-- les occurrences sont matérialisées en plusieurs lignes dès la création,
-- chacune restant modifiable / supprimable indépendamment) + objectif de
-- résultat mensuel, comparé au résultat réalisé (cash encaissé - dépenses).

alter table public.expenses
  add column if not exists recurrence_frequence text
    check (recurrence_frequence in ('jour', 'semaine', 'mois')),
  add column if not exists recurrence_intervalle integer,
  add column if not exists recurrence_fin date;

alter table public.expenses
  add constraint recurrence_fields_consistent
    check (
      (recurrence_frequence is null and recurrence_intervalle is null and recurrence_fin is null)
      or (
        recurrence_frequence is not null
        and recurrence_intervalle is not null and recurrence_intervalle > 0
        and recurrence_fin is not null
      )
    );

create table public.finance_goals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  objectif_resultat_mensuel numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.finance_goals
  for each row execute function public.set_updated_at();

alter table public.finance_goals enable row level security;

create policy "select_own_finance_goals" on public.finance_goals
  for select using (owner_id = auth.uid());
create policy "insert_own_finance_goals" on public.finance_goals
  for insert with check (owner_id = auth.uid());
create policy "update_own_finance_goals" on public.finance_goals
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_finance_goals" on public.finance_goals
  for delete using (owner_id = auth.uid());

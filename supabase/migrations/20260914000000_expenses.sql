-- Dépenses de l'agence (URSSAF, abonnements, marketing, etc.), saisies
-- manuellement, pour comparer au CA dans le module "Dépenses vs Résultat"
-- du dashboard.

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  libelle text not null,
  categorie text not null default 'autre'
    check (categorie in ('urssaf', 'abonnement', 'marketing', 'salaire', 'autre')),
  montant numeric not null,
  date_depense date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index expenses_owner_id_idx on public.expenses(owner_id);
create index expenses_date_depense_idx on public.expenses(date_depense);

create trigger set_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();

alter table public.expenses enable row level security;

create policy "select_own_expenses" on public.expenses
  for select using (owner_id = auth.uid());
create policy "insert_own_expenses" on public.expenses
  for insert with check (owner_id = auth.uid());
create policy "update_own_expenses" on public.expenses
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_expenses" on public.expenses
  for delete using (owner_id = auth.uid());

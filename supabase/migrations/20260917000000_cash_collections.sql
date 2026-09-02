-- Journal des encaissements : chaque fois qu'un montant encaissé est
-- enregistré sur un projet, on garde une ligne datée (au lieu d'un seul
-- total cumulé sans historique). C'est la source de vérité du "cash
-- réel collecté" utilisée par la page Finance pour le suivi mensuel et
-- l'objectif de résultat. projects.montant_encaisse reste à jour en
-- parallèle (incrémenté à chaque ajout) pour l'affichage existant.

create table public.cash_collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  montant numeric not null,
  date_encaissement date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cash_collections_owner_id_idx on public.cash_collections(owner_id);
create index cash_collections_project_id_idx on public.cash_collections(project_id);
create index cash_collections_date_encaissement_idx on public.cash_collections(date_encaissement);

create trigger set_updated_at before update on public.cash_collections
  for each row execute function public.set_updated_at();

alter table public.cash_collections enable row level security;

create policy "select_own_cash_collections" on public.cash_collections
  for select using (owner_id = auth.uid());
create policy "insert_own_cash_collections" on public.cash_collections
  for insert with check (owner_id = auth.uid());
create policy "update_own_cash_collections" on public.cash_collections
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_cash_collections" on public.cash_collections
  for delete using (owner_id = auth.uid());

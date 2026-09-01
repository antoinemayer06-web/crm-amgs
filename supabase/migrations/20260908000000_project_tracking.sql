-- Suivi financier et temporel des projets + journal du travail effectué.

alter table public.projects
  add column if not exists montant_facture numeric,
  add column if not exists montant_encaisse numeric,
  add column if not exists date_fin_reelle date,
  add column if not exists duree_estimee_heures numeric;

create table if not exists public.project_work_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  date date not null default current_date,
  description text not null,
  duree_heures numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_work_logs_owner_id_idx on public.project_work_logs(owner_id);
create index if not exists project_work_logs_project_id_idx on public.project_work_logs(project_id);

alter table public.project_work_logs enable row level security;

create policy "select_own_project_work_logs" on public.project_work_logs
  for select using (owner_id = auth.uid());
create policy "insert_own_project_work_logs" on public.project_work_logs
  for insert with check (owner_id = auth.uid());
create policy "update_own_project_work_logs" on public.project_work_logs
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_project_work_logs" on public.project_work_logs
  for delete using (owner_id = auth.uid());

create trigger set_updated_at before update on public.project_work_logs
  for each row execute function public.set_updated_at();

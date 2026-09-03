-- Impact chiffré de l'automatisation (temps gagné, valeur économisée)
-- + témoignages clients, affichés dans la fenêtre dédiée agrandie du
-- projet — un argument à montrer au client.

alter table public.projects
  add column if not exists temps_gagne_estime_heures numeric,
  add column if not exists temps_gagne_unite text
    check (temps_gagne_unite in ('par_semaine', 'par_mois')),
  add column if not exists valeur_economisee_estimee numeric;

create table public.project_testimonials (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  auteur text not null,
  contenu text not null,
  note integer check (note between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_testimonials_owner_id_idx on public.project_testimonials(owner_id);
create index project_testimonials_project_id_idx on public.project_testimonials(project_id);

create trigger set_updated_at before update on public.project_testimonials
  for each row execute function public.set_updated_at();

alter table public.project_testimonials enable row level security;

create policy "select_own_project_testimonials" on public.project_testimonials
  for select using (owner_id = auth.uid());
create policy "insert_own_project_testimonials" on public.project_testimonials
  for insert with check (owner_id = auth.uid());
create policy "update_own_project_testimonials" on public.project_testimonials
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_project_testimonials" on public.project_testimonials
  for delete using (owner_id = auth.uid());

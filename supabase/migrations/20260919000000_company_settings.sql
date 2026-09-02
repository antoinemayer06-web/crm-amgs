-- Page Paramètres : infos de la société (une seule ligne par owner,
-- même logique que finance_goals) + fichiers libres (CGV, RIB, contrats
-- types...) stockés dans un bucket dédié.

create table public.company_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  nom_societe text,
  forme_juridique text,
  siret text,
  adresse text,
  code_postal text,
  ville text,
  email_contact text,
  telephone text,
  iban text,
  bic text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.company_settings
  for each row execute function public.set_updated_at();

alter table public.company_settings enable row level security;

create policy "select_own_company_settings" on public.company_settings
  for select using (owner_id = auth.uid());
create policy "insert_own_company_settings" on public.company_settings
  for insert with check (owner_id = auth.uid());
create policy "update_own_company_settings" on public.company_settings
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_company_settings" on public.company_settings
  for delete using (owner_id = auth.uid());

create table public.company_files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nom text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index company_files_owner_id_idx on public.company_files(owner_id);

alter table public.company_files enable row level security;

create policy "select_own_company_files" on public.company_files
  for select using (owner_id = auth.uid());
create policy "insert_own_company_files" on public.company_files
  for insert with check (owner_id = auth.uid());
create policy "delete_own_company_files" on public.company_files
  for delete using (owner_id = auth.uid());

-- Bucket privé pour les fichiers de la société, même schéma d'accès
-- (dossier <owner_id>/<fichier>) que documents/vision.
insert into storage.buckets (id, name, public)
values ('company-files', 'company-files', false)
on conflict (id) do nothing;

create policy "select_own_company_files_storage"
  on storage.objects for select
  using (bucket_id = 'company-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "insert_own_company_files_storage"
  on storage.objects for insert
  with check (bucket_id = 'company-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "delete_own_company_files_storage"
  on storage.objects for delete
  using (bucket_id = 'company-files' and (storage.foldername(name))[1] = auth.uid()::text);

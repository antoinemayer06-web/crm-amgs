-- Page "Vision" : mur d'inspiration en canvas infini, post-it et images
-- posés librement. Espace personnel, sans lien avec les autres entités
-- du CRM.

create table public.vision_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null check (type in ('note', 'image')),
  contenu text,
  image_url text,
  position_x numeric not null default 0,
  position_y numeric not null default 0,
  largeur numeric not null default 220,
  hauteur numeric not null default 220,
  couleur text,
  rotation numeric not null default 0,
  z_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vision_notes_type_fields check (
    (type = 'note' and image_url is null)
    or (type = 'image' and contenu is null and image_url is not null)
  )
);

create index vision_notes_owner_id_idx on public.vision_notes(owner_id);

create trigger set_updated_at before update on public.vision_notes
  for each row execute function public.set_updated_at();

alter table public.vision_notes enable row level security;

create policy "select_own_vision_notes" on public.vision_notes
  for select using (owner_id = auth.uid());
create policy "insert_own_vision_notes" on public.vision_notes
  for insert with check (owner_id = auth.uid());
create policy "update_own_vision_notes" on public.vision_notes
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_vision_notes" on public.vision_notes
  for delete using (owner_id = auth.uid());

-- Bucket de stockage pour les images du mur Vision. Privé, comme le
-- bucket documents : accès uniquement via URL signée, restreint au
-- dossier de l'utilisateur courant (<owner_id>/<fichier>).
insert into storage.buckets (id, name, public)
values ('vision', 'vision', false)
on conflict (id) do nothing;

create policy "select_own_vision_storage"
  on storage.objects for select
  using (bucket_id = 'vision' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "insert_own_vision_storage"
  on storage.objects for insert
  with check (bucket_id = 'vision' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "update_own_vision_storage"
  on storage.objects for update
  using (bucket_id = 'vision' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'vision' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "delete_own_vision_storage"
  on storage.objects for delete
  using (bucket_id = 'vision' and (storage.foldername(name))[1] = auth.uid()::text);

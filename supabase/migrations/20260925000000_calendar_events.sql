-- Événements libres du Calendrier (réunions, rdv…) — pas liés à un
-- projet ou une action marketing existants (ceux-là apparaissent dans
-- la vue Calendrier directement depuis leurs propres tables : voir
-- src/hooks/useCalendarEvents.js pour l'agrégation côté client).

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titre text not null,
  description text,
  date_debut timestamptz not null,
  date_fin timestamptz,
  lieu text,
  company_id uuid references public.companies(id) on delete set null,
  alerte_avant_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index calendar_events_owner_id_idx on public.calendar_events(owner_id);
create index calendar_events_date_debut_idx on public.calendar_events(date_debut);
create index calendar_events_company_id_idx on public.calendar_events(company_id);

create trigger set_updated_at before update on public.calendar_events
  for each row execute function public.set_updated_at();

alter table public.calendar_events enable row level security;

create policy "select_own_calendar_events" on public.calendar_events
  for select using (owner_id = auth.uid());
create policy "insert_own_calendar_events" on public.calendar_events
  for insert with check (owner_id = auth.uid());
create policy "update_own_calendar_events" on public.calendar_events
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_calendar_events" on public.calendar_events
  for delete using (owner_id = auth.uid());

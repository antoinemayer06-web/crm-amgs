-- Système de notifications/alertes : 5 types précis générés une fois par
-- jour par une Edge Function planifiée (voir supabase/functions/daily-notifications),
-- affichés dans un panneau sur le Dashboard, et relayés en notification
-- push PWA via les abonnements enregistrés dans push_subscriptions.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null
    check (type in (
      'action_marketing_du_jour',
      'facture_impayee_7j',
      'objectif_mi_mois',
      'projet_demarre_ou_termine_bientot',
      'prospect_bloque_devis'
    )),
  titre text not null,
  message text not null,
  entite_type text check (entite_type in ('company', 'project', 'marketing_action')),
  entite_id uuid,
  lue boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_owner_id_idx on public.notifications(owner_id);
create index notifications_owner_lue_idx on public.notifications(owner_id, lue);
-- Utilisé par la fonction planifiée pour éviter les doublons : une
-- notification identique déjà non lue pour la même entité ne doit pas
-- être recréée chaque jour.
create index notifications_dedup_idx on public.notifications(owner_id, type, entite_id, lue);

alter table public.notifications enable row level security;

create policy "select_own_notifications" on public.notifications
  for select using (owner_id = auth.uid());
create policy "insert_own_notifications" on public.notifications
  for insert with check (owner_id = auth.uid());
create policy "update_own_notifications" on public.notifications
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_notifications" on public.notifications
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- notification_settings : une ligne par utilisateur, un simple
-- interrupteur par type de notification.
-- ---------------------------------------------------------------------
create table public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  types_actifs jsonb not null default '{
    "action_marketing_du_jour": true,
    "facture_impayee_7j": true,
    "objectif_mi_mois": true,
    "projet_demarre_ou_termine_bientot": true,
    "prospect_bloque_devis": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.notification_settings
  for each row execute function public.set_updated_at();

alter table public.notification_settings enable row level security;

create policy "select_own_notification_settings" on public.notification_settings
  for select using (owner_id = auth.uid());
create policy "insert_own_notification_settings" on public.notification_settings
  for insert with check (owner_id = auth.uid());
create policy "update_own_notification_settings" on public.notification_settings
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_notification_settings" on public.notification_settings
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- push_subscriptions : un abonnement Web Push par navigateur/appareil
-- installé (endpoint = identifiant unique fourni par le navigateur).
-- ---------------------------------------------------------------------
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index push_subscriptions_owner_id_idx on public.push_subscriptions(owner_id);

alter table public.push_subscriptions enable row level security;

create policy "select_own_push_subscriptions" on public.push_subscriptions
  for select using (owner_id = auth.uid());
create policy "insert_own_push_subscriptions" on public.push_subscriptions
  for insert with check (owner_id = auth.uid());
create policy "update_own_push_subscriptions" on public.push_subscriptions
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_push_subscriptions" on public.push_subscriptions
  for delete using (owner_id = auth.uid());

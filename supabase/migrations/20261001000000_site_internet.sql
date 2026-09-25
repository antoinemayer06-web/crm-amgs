-- Nouvelle section "Site internet" : suivi des visites/clics du site
-- marketing (evenements_site) et des réponses au quiz de qualification
-- (demandes_site), plus un journal d'audit indépendant (journal_demandes_site)
-- pour pouvoir vérifier après coup qu'aucune soumission n'a été perdue.
--
-- Ces tables sont alimentées par deux Edge Functions appelées depuis le
-- site marketing externe (hors de ce repo), authentifiées par une clé
-- d'API statique (SITE_API_KEY) et non par un utilisateur Supabase — les
-- Edge Functions utilisent le service role et renseignent owner_id
-- explicitement (variable d'env OWNER_ID), donc les policies RLS
-- ci-dessous ne servent qu'à la lecture/édition depuis le CRM.

create table public.evenements_site (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null
    check (type in ('page_view', 'clic_calendly', 'clic_email', 'clic_linkedin', 'clic_whatsapp')),
  page text,
  session_id text,
  date_heure timestamptz not null default now()
);

create index evenements_site_owner_date_idx on public.evenements_site(owner_id, date_heure desc);
create index evenements_site_owner_type_idx on public.evenements_site(owner_id, type);

alter table public.evenements_site enable row level security;

create policy "select_own_evenements_site" on public.evenements_site
  for select using (owner_id = auth.uid());
create policy "insert_own_evenements_site" on public.evenements_site
  for insert with check (owner_id = auth.uid());
create policy "update_own_evenements_site" on public.evenements_site
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_evenements_site" on public.evenements_site
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- demandes_site : une ligne par soumission du quiz de qualification.
-- ---------------------------------------------------------------------
create table public.demandes_site (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nom text,
  email text not null,
  telephone text,
  reponses jsonb not null default '{}'::jsonb,
  score numeric,
  statut text not null default 'Nouveau',
  date_soumission timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Utilisé par la fonction leads-quiz pour la protection anti-doublon
-- (même email arrivant deux fois dans un court intervalle).
create index demandes_site_owner_email_idx on public.demandes_site(owner_id, email, created_at desc);
create index demandes_site_owner_date_idx on public.demandes_site(owner_id, date_soumission desc);

create trigger set_updated_at before update on public.demandes_site
  for each row execute function public.set_updated_at();

alter table public.demandes_site enable row level security;

create policy "select_own_demandes_site" on public.demandes_site
  for select using (owner_id = auth.uid());
create policy "insert_own_demandes_site" on public.demandes_site
  for insert with check (owner_id = auth.uid());
create policy "update_own_demandes_site" on public.demandes_site
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_demandes_site" on public.demandes_site
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- journal_demandes_site : journal d'audit de CHAQUE tentative de
-- soumission du quiz reçue par l'Edge Function (réussie ou échouée),
-- pour pouvoir vérifier après coup qu'aucune réponse n'a été perdue.
-- Écrit uniquement par la fonction (service role, qui ignore RLS) —
-- lecture seule depuis le CRM, aucune policy d'écriture pour les
-- utilisateurs authentifiés.
-- ---------------------------------------------------------------------
create table public.journal_demandes_site (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reussite boolean not null,
  raison_erreur text,
  payload_recu jsonb,
  demande_id uuid references public.demandes_site(id) on delete set null,
  created_at timestamptz not null default now()
);

create index journal_demandes_site_owner_date_idx on public.journal_demandes_site(owner_id, created_at desc);

alter table public.journal_demandes_site enable row level security;

create policy "select_own_journal_demandes_site" on public.journal_demandes_site
  for select using (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- Nouveau type de notification : une nouvelle demande du quiz du site
-- internet. Même mécanique que les alertes existantes (badge dans la
-- nav + panneau de notifications), déclenchée directement par la
-- fonction leads-quiz plutôt que par le cron quotidien.
-- ---------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'notifications'
      and att.attname in ('type', 'entite_type')
      and con.contype = 'c'
  loop
    execute format('alter table public.notifications drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.notifications
  add constraint notifications_type_check
    check (type in (
      'action_marketing_du_jour',
      'facture_impayee_7j',
      'objectif_mi_mois',
      'objectif_fin_mois',
      'projet_demarre_ou_termine_bientot',
      'prospect_bloque_devis',
      'evenement_calendrier',
      'nouvelle_demande_site'
    ));

alter table public.notifications
  add constraint notifications_entite_type_check
    check (entite_type in ('company', 'project', 'marketing_action', 'calendar_event', 'demande_site'));

-- CRM AM Growth Solutions — schéma initial
-- Toutes les tables portent owner_id (préparation multi-utilisateur),
-- created_at / updated_at, et RLS activé (accès restreint au propriétaire).

-- ---------------------------------------------------------------------
-- Fonction utilitaire : maintien automatique de updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'prospect'
    check (status in ('prospect', 'client', 'perdu', 'dormant')),
  sector text,
  size text,
  source text
    check (source in ('linkedin', 'référence', 'site web', 'salon', 'autre')),
  health_score text
    check (health_score in ('bon', 'attention', 'risque')),
  tags text[] not null default '{}',
  website text,
  notes_generales text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint health_score_only_for_client
    check (health_score is null or status = 'client')
);

create index companies_owner_id_idx on public.companies(owner_id);
create index companies_status_idx on public.companies(status);

create trigger set_updated_at before update on public.companies
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- contacts
-- ---------------------------------------------------------------------
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  role text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_owner_id_idx on public.contacts(owner_id);
create index contacts_company_id_idx on public.contacts(company_id);

create trigger set_updated_at before update on public.contacts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- notes (historique chronologique des échanges avec une entreprise)
-- ---------------------------------------------------------------------
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  auteur text not null,
  contenu text not null,
  type text not null default 'générale'
    check (type in ('appel', 'email', 'réunion', 'générale')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_owner_id_idx on public.notes(owner_id);
create index notes_company_id_idx on public.notes(company_id);

create trigger set_updated_at before update on public.notes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- documents (fichiers stockés dans Supabase Storage)
-- ---------------------------------------------------------------------
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  nom text not null,
  type text not null
    check (type in ('facture', 'bon_de_livraison', 'proposition', 'contrat', 'autre')),
  url text not null,
  montant numeric,
  statut text
    check (statut in ('brouillon', 'envoyé', 'payé', 'en_retard')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_owner_id_idx on public.documents(owner_id);
create index documents_company_id_idx on public.documents(company_id);

create trigger set_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- pipeline_stages
-- ---------------------------------------------------------------------
create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nom text not null,
  ordre int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pipeline_stages_owner_id_idx on public.pipeline_stages(owner_id);

create trigger set_updated_at before update on public.pipeline_stages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- deals
-- ---------------------------------------------------------------------
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  stage_id uuid not null references public.pipeline_stages(id) on delete restrict,
  valeur_estimee numeric,
  probabilite int check (probabilite between 0 and 100),
  prochaine_action text,
  date_prochaine_action date,
  raison_perte text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deals_owner_id_idx on public.deals(owner_id);
create index deals_company_id_idx on public.deals(company_id);
create index deals_stage_id_idx on public.deals(stage_id);

create trigger set_updated_at before update on public.deals
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- projects (livraison des automatisations vendues)
-- ---------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete set null,
  nom text not null,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'en_cours', 'en_test', 'livré', 'en_pause')),
  date_debut date,
  date_livraison_prevue date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_owner_id_idx on public.projects(owner_id);
create index projects_company_id_idx on public.projects(company_id);
create index projects_deal_id_idx on public.projects(deal_id);

create trigger set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- project_steps
-- ---------------------------------------------------------------------
create table public.project_steps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  titre text not null,
  statut text not null default 'à_faire'
    check (statut in ('à_faire', 'en_cours', 'fait')),
  ordre int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_steps_owner_id_idx on public.project_steps(owner_id);
create index project_steps_project_id_idx on public.project_steps(project_id);

create trigger set_updated_at before update on public.project_steps
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nom text not null,
  objectif text,
  date_debut date,
  date_fin date,
  budget numeric,
  statut text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index campaigns_owner_id_idx on public.campaigns(owner_id);

create trigger set_updated_at before update on public.campaigns
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- marketing_actions
-- ---------------------------------------------------------------------
create table public.marketing_actions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titre text not null,
  type text not null
    check (type in ('post_linkedin', 'email', 'contenu_blog', 'campagne_pub', 'autre')),
  statut text not null default 'planifié'
    check (statut in ('planifié', 'en_cours', 'publié', 'annulé')),
  date_prevue date,
  campaign_id uuid references public.campaigns(id) on delete set null,
  description text,
  resultats text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index marketing_actions_owner_id_idx on public.marketing_actions(owner_id);
create index marketing_actions_campaign_id_idx on public.marketing_actions(campaign_id);

create trigger set_updated_at before update on public.marketing_actions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- tasks (tâches transverses)
-- ---------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titre text not null,
  description text,
  company_id uuid references public.companies(id) on delete set null,
  due_date date,
  statut text not null default 'à_faire'
    check (statut in ('à_faire', 'fait')),
  priorite text not null default 'moyenne'
    check (priorite in ('haute', 'moyenne', 'basse')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_owner_id_idx on public.tasks(owner_id);
create index tasks_company_id_idx on public.tasks(company_id);

create trigger set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- knowledge_base
-- ---------------------------------------------------------------------
create table public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titre text not null,
  categorie text not null
    check (categorie in ('script_appel', 'template_proposition', 'sop', 'autre')),
  contenu text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index knowledge_base_owner_id_idx on public.knowledge_base(owner_id);

create trigger set_updated_at before update on public.knowledge_base
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- ai_actions_log (historique des actions proposées/validées par l'IA)
-- ---------------------------------------------------------------------
create table public.ai_actions_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  action_type text not null,
  description text,
  payload jsonb,
  statut text not null default 'proposée'
    check (statut in ('proposée', 'validée', 'rejetée')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  validated_at timestamptz
);

create index ai_actions_log_owner_id_idx on public.ai_actions_log(owner_id);

create trigger set_updated_at before update on public.ai_actions_log
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- Un seul utilisateur pour l'instant, mais chaque table est déjà
-- restreinte par owner_id pour supporter le multi-utilisateur.
-- ---------------------------------------------------------------------
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.deals enable row level security;
alter table public.projects enable row level security;
alter table public.project_steps enable row level security;
alter table public.campaigns enable row level security;
alter table public.marketing_actions enable row level security;
alter table public.tasks enable row level security;
alter table public.knowledge_base enable row level security;
alter table public.ai_actions_log enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'companies', 'contacts', 'notes', 'documents', 'pipeline_stages',
    'deals', 'projects', 'project_steps', 'campaigns', 'marketing_actions',
    'tasks', 'knowledge_base', 'ai_actions_log'
  ]
  loop
    execute format(
      'create policy "select_own_%1$s" on public.%1$s for select using (owner_id = auth.uid());',
      t
    );
    execute format(
      'create policy "insert_own_%1$s" on public.%1$s for insert with check (owner_id = auth.uid());',
      t
    );
    execute format(
      'create policy "update_own_%1$s" on public.%1$s for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());',
      t
    );
    execute format(
      'create policy "delete_own_%1$s" on public.%1$s for delete using (owner_id = auth.uid());',
      t
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Étapes de pipeline par défaut
-- owner_id dépend de l'utilisateur connecté : cette fonction crée les
-- 7 étapes par défaut pour l'utilisateur courant (à appeler une fois,
-- via supabase.rpc('seed_default_pipeline_stages'), après la première
-- connexion). Idempotente : ne fait rien si des étapes existent déjà.
-- ---------------------------------------------------------------------
create or replace function public.seed_default_pipeline_stages()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.pipeline_stages where owner_id = auth.uid()) then
    return;
  end if;

  insert into public.pipeline_stages (owner_id, nom, ordre) values
    (auth.uid(), 'Nouveau', 1),
    (auth.uid(), 'Qualifié', 2),
    (auth.uid(), 'RDV pris', 3),
    (auth.uid(), 'Proposition envoyée', 4),
    (auth.uid(), 'Négociation', 5),
    (auth.uid(), 'Gagné', 6),
    (auth.uid(), 'Perdu', 7);
end;
$$;

grant execute on function public.seed_default_pipeline_stages() to authenticated;

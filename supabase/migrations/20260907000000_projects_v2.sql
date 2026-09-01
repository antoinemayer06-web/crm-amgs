-- Fusionne livré/à_facturer en un seul statut, ajoute l'archivage des
-- projets, des échéances début/fin par étape, et des documents liés
-- soit à une company, soit à un projet précis.

-- 1) Fusion des statuts livré + à_facturer.
update public.projects
  set statut = 'livré_à_facturer'
  where statut in ('livré', 'à_facturer');

alter table public.projects drop constraint if exists projects_statut_check;
alter table public.projects
  add constraint projects_statut_check
    check (statut in ('en_cours_livraison', 'livré_à_facturer', 'facture_transmise', 'payé'));

-- 2) Archivage des projets.
alter table public.projects add column if not exists archived boolean not null default false;
create index if not exists projects_archived_idx on public.projects(archived);

-- 3) Échéances début/fin par étape.
alter table public.project_steps add column if not exists date_debut date;
alter table public.project_steps add column if not exists date_fin date;

-- 4) Documents : un document peut être rattaché à un projet précis (en
-- plus de la company). project_id nul = document au niveau de la company.
alter table public.documents
  add column if not exists project_id uuid references public.projects(id) on delete cascade;
create index if not exists documents_project_id_idx on public.documents(project_id);

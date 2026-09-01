-- Le temps se suit désormais par tâche (project_steps), pas au niveau
-- global du projet : chaque étape porte sa propre estimation, et le
-- journal de travail (project_work_logs) se rattache à une étape
-- précise plutôt qu'au projet. Le temps "réel" d'un projet se déduit en
-- sommant les entrées de journal de toutes ses étapes.

alter table public.project_steps
  add column if not exists duree_estimee_heures numeric;

alter table public.project_work_logs
  add column if not exists step_id uuid references public.project_steps(id) on delete cascade;

-- Données existantes sans étape associée : non rattachables au nouveau
-- modèle (uniquement des données de test à ce stade), on les retire.
delete from public.project_work_logs where step_id is null;

alter table public.project_work_logs
  alter column step_id set not null;

alter table public.project_work_logs drop column if exists project_id;

create index if not exists project_work_logs_step_id_idx on public.project_work_logs(step_id);

-- Remplacé par la somme des estimations par étape.
alter table public.projects drop column if exists duree_estimee_heures;

-- Heures prévues par projet, pour comparaison avec le temps réel déjà
-- calculable par agrégation des heures saisies au niveau des tâches
-- (project_steps / project_work_logs) — cette logique existante n'est
-- pas modifiée.

alter table public.projects
  add column if not exists heures_prevues numeric;

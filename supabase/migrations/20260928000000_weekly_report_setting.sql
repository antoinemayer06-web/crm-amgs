-- Toggle du rapport hebdomadaire par email (voir supabase/functions/weekly-report),
-- même ligne de réglages que les notifications (une par owner).

alter table public.notification_settings
  add column if not exists rapport_hebdomadaire_actif boolean not null default true;

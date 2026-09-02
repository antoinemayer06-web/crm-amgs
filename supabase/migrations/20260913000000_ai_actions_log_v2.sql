-- Assistant IA : deux colonnes techniques en plus de `payload` (qui reste
-- exactement les paramètres de l'action, comme demandé) — l'identifiant du
-- tool_use Claude pour pouvoir reprendre la conversation après validation,
-- et le résultat (id/table créés) une fois l'action exécutée, pour lier
-- vers la fiche concernée depuis l'historique.

alter table public.ai_actions_log
  add column if not exists tool_use_id text,
  add column if not exists result jsonb;

create index if not exists ai_actions_log_tool_use_id_idx on public.ai_actions_log(tool_use_id);

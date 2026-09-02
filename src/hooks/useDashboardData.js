import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Un seul hook consolidé : le dashboard a besoin d'un instantané de
// plusieurs tables à la fois, mieux vaut un aller-retour groupé qu'une
// cascade de hooks avec chacun son propre isLoading/isError.
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [
        documentsRes,
        companiesRes,
        projectsRes,
        stepsRes,
        workLogsRes,
        notesRes,
        tasksRes,
        marketingActionsRes,
      ] = await Promise.all([
        supabase.from('documents').select('*, company:companies(id, name)'),
        supabase.from('companies').select('*'),
        // Pas de filtre archived ici : le CA/heures déjà facturés ou
        // travaillés sur un projet archivé restent comptés. Les KPIs
        // "actifs" appliquent leur propre filtre dans dashboardUtils.
        supabase.from('projects').select('*, company:companies(id, name)'),
        supabase.from('project_steps').select('*'),
        supabase.from('project_work_logs').select('*'),
        supabase
          .from('notes')
          .select('id, created_at, company_id, company:companies(id, name)')
          .order('created_at', { ascending: false })
          .limit(15),
        supabase.from('tasks').select('*, company:companies(id, name)'),
        supabase.from('marketing_actions').select('id, statut, date_prevue'),
      ])

      for (const res of [
        documentsRes,
        companiesRes,
        projectsRes,
        stepsRes,
        workLogsRes,
        notesRes,
        tasksRes,
        marketingActionsRes,
      ]) {
        if (res.error) throw res.error
      }

      return {
        documents: documentsRes.data,
        companies: companiesRes.data,
        projects: projectsRes.data,
        steps: stepsRes.data,
        workLogs: workLogsRes.data,
        notes: notesRes.data,
        tasks: tasksRes.data,
        marketingActions: marketingActionsRes.data,
      }
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Les entrées de temps se font sur une étape précise (project_steps),
// jamais directement sur le projet.
export function useWorkLogsForSteps(stepIds) {
  return useQuery({
    queryKey: ['project_work_logs', 'steps', stepIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_work_logs')
        .select('*')
        .in('step_id', stepIds)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: stepIds.length > 0,
  })
}

export function useCreateProjectWorkLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('project_work_logs')
        .insert(values)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_work_logs'] })
    },
  })
}

export function useDeleteProjectWorkLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('project_work_logs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_work_logs'] })
    },
  })
}

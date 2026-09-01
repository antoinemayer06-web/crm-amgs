import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useProjectWorkLogs(projectId) {
  return useQuery({
    queryKey: ['project_work_logs', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_work_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(projectId),
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project_work_logs', data.project_id] })
    },
  })
}

export function useDeleteProjectWorkLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, projectId }) => {
      const { error } = await supabase.from('project_work_logs').delete().eq('id', id)
      if (error) throw error
      return { projectId }
    },
    onSuccess: ({ projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['project_work_logs', projectId] })
    },
  })
}

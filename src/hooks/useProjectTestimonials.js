import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useProjectTestimonials(projectId) {
  return useQuery({
    queryKey: ['project_testimonials', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_testimonials')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(projectId),
  })
}

export function useCreateProjectTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, auteur, contenu, note }) => {
      const { data, error } = await supabase
        .from('project_testimonials')
        .insert({ project_id: projectId, auteur, contenu, note })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project_testimonials', variables.projectId] })
    },
  })
}

export function useDeleteProjectTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }) => {
      const { error } = await supabase.from('project_testimonials').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project_testimonials', variables.projectId] })
    },
  })
}

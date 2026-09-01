import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const PROJECT_SELECT = '*, company:companies(id, name, status)'

export function useProjects(filters = {}) {
  return useQuery({
    queryKey: ['projects', 'all', filters],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .order('date_livraison_prevue', { ascending: true, nullsFirst: false })

      if (filters.statut) {
        query = query.eq('statut', filters.statut)
      }
      if (filters.companyId) {
        query = query.eq('company_id', filters.companyId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useProjectsByCompany(companyId) {
  return useQuery({
    queryKey: ['projects', 'company', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(companyId),
  })
}

export function useProject(id) {
  return useQuery({
    queryKey: ['projects', 'one', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(values)
        .select(PROJECT_SELECT)
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(values)
        .eq('id', id)
        .select(PROJECT_SELECT)
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Un client est "actif" s'il a au moins un projet dont le statut n'est
// pas "livré", "inactif" sinon (y compris s'il n'a aucun projet).
export function useClientActivityMap(companyIds) {
  return useQuery({
    queryKey: ['projects', 'activity-map', companyIds],
    queryFn: async () => {
      const map = {}
      for (const id of companyIds) map[id] = false

      const { data, error } = await supabase
        .from('projects')
        .select('company_id, statut')
        .in('company_id', companyIds)
      if (error) throw error

      for (const project of data) {
        if (project.statut !== 'livré') map[project.company_id] = true
      }
      return map
    },
    enabled: companyIds.length > 0,
  })
}

// -----------------------------------------------------------------
// project_steps : chargés globalement une fois et partagés (cartes
// kanban/liste pour les compteurs, panneau latéral pour le détail).
// -----------------------------------------------------------------
export function useAllProjectSteps() {
  return useQuery({
    queryKey: ['project_steps', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_steps')
        .select('*')
        .order('ordre', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateProjectStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('project_steps')
        .insert(values)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

export function useUpdateProjectStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('project_steps')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

export function useDeleteProjectStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('project_steps').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

// Réordonnancement : met à jour `ordre` pour chaque étape déplacée.
export function useReorderProjectSteps() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (steps) => {
      await Promise.all(
        steps.map((step, index) =>
          supabase.from('project_steps').update({ ordre: index }).eq('id', step.id),
        ),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

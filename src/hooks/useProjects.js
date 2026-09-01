import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useProjectsByCompany(companyId) {
  return useQuery({
    queryKey: ['projects', 'company', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(companyId),
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

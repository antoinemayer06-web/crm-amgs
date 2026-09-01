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

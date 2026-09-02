import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useAiActionsLog() {
  return useQuery({
    queryKey: ['ai_actions_log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_actions_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15)
      if (error) throw error
      return data
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useMarketingActions(filters = {}) {
  return useQuery({
    queryKey: ['marketing_actions', filters],
    queryFn: async () => {
      let query = supabase
        .from('marketing_actions')
        .select('*, campaign:campaigns(id, nom)')
        .order('date_prevue', { ascending: true })

      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.statut) {
        query = query.eq('statut', filters.statut)
      }
      if (filters.campaignId) {
        query = query.eq('campaign_id', filters.campaignId)
      }
      if (filters.dateFrom) {
        query = query.gte('date_prevue', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('date_prevue', filters.dateTo)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useMarketingAction(id) {
  return useQuery({
    queryKey: ['marketing_actions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_actions')
        .select('*, campaign:campaigns(id, nom)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: Boolean(id),
  })
}

export function useCreateMarketingAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('marketing_actions')
        .insert(values)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_actions'] })
    },
  })
}

export function useUpdateMarketingAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('marketing_actions')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketing_actions'] })
      queryClient.invalidateQueries({ queryKey: ['marketing_actions', data.id] })
    },
  })
}

export function useDeleteMarketingAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('marketing_actions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing_actions'] })
    },
  })
}

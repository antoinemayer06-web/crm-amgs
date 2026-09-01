import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useContacts(companyId) {
  return useQuery({
    queryKey: ['contacts', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('company_id', companyId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: Boolean(companyId),
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert(values)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', data.company_id] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', data.company_id] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, companyId }) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) throw error
      return { companyId }
    },
    onSuccess: ({ companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', companyId] })
    },
  })
}

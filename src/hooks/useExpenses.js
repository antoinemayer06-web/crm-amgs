import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { buildRecurrenceOccurrences } from '../lib/recurrenceUtils'

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date_depense', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

// Une dépense avec récurrence est éclatée en plusieurs lignes (une par
// occurrence) dès la création — voir buildRecurrenceOccurrences.
export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const occurrences = buildRecurrenceOccurrences(values, 'date_depense')
      const { data, error } = await supabase.from('expenses').insert(occurrences).select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Objectif de résultat mensuel : une seule ligne par owner (upsert).
export function useFinanceGoal() {
  return useQuery({
    queryKey: ['finance_goal'],
    queryFn: async () => {
      const { data, error } = await supabase.from('finance_goals').select('*').maybeSingle()
      if (error) throw error
      return data
    },
  })
}

export function useUpdateFinanceGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ownerId, objectifResultatMensuel }) => {
      const { data, error } = await supabase
        .from('finance_goals')
        .upsert(
          { owner_id: ownerId, objectif_resultat_mensuel: objectifResultatMensuel },
          { onConflict: 'owner_id' },
        )
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_goal'] })
    },
  })
}

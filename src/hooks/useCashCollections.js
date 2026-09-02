import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Journal des encaissements réels, projet par projet — voir la migration
// cash_collections. C'est la source de vérité du cash effectivement
// reçu, utilisée pour le suivi mensuel sur la page Finance.
export function useCashCollections() {
  return useQuery({
    queryKey: ['cash_collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_collections')
        .select('*, project:projects(id, nom, company:companies(id, name))')
        .order('date_encaissement', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useCashCollectionsForProject(projectId) {
  return useQuery({
    queryKey: ['cash_collections', 'project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_collections')
        .select('*')
        .eq('project_id', projectId)
        .order('date_encaissement', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(projectId),
  })
}

// Enregistre un encaissement (ligne datée dans cash_collections) ET met
// à jour projects.montant_encaisse en conséquence, pour que l'affichage
// existant (total cumulé sur le projet) reste juste.
export function useCreateCashCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, montant, dateEncaissement, currentMontantEncaisse }) => {
      const { data, error: insertError } = await supabase
        .from('cash_collections')
        .insert({ project_id: projectId, montant, date_encaissement: dateEncaissement })
        .select()
        .single()
      if (insertError) throw insertError

      const { error: updateError } = await supabase
        .from('projects')
        .update({ montant_encaisse: Number(currentMontantEncaisse ?? 0) + Number(montant) })
        .eq('id', projectId)
      if (updateError) throw updateError

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash_collections'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Supprime un encaissement et retire son montant du total cumulé sur le
// projet, pour rester cohérent avec l'ajout.
export function useDeleteCashCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, projectId, montant, currentMontantEncaisse }) => {
      const { error: deleteError } = await supabase.from('cash_collections').delete().eq('id', id)
      if (deleteError) throw deleteError

      const { error: updateError } = await supabase
        .from('projects')
        .update({ montant_encaisse: Number(currentMontantEncaisse ?? 0) - Number(montant) })
        .eq('id', projectId)
      if (updateError) throw updateError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash_collections'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

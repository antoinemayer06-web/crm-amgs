import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Les virgules et parenthèses cassent la syntaxe du filtre `or` de
// PostgREST : on les retire du terme de recherche avant de l'injecter.
function sanitizeSearchTerm(term) {
  return term.replace(/[,()]/g, ' ').trim()
}

export function useKnowledgeEntries(filters = {}) {
  return useQuery({
    queryKey: ['knowledge_base', filters],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_base')
        .select('*')
        .order('updated_at', { ascending: false })

      if (filters.categorie) {
        query = query.eq('categorie', filters.categorie)
      }
      if (filters.search) {
        const term = sanitizeSearchTerm(filters.search)
        if (term) {
          query = query.or(`titre.ilike.%${term}%,contenu.ilike.%${term}%`)
        }
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useKnowledgeEntry(id) {
  return useQuery({
    queryKey: ['knowledge_base', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: Boolean(id),
  })
}

export function useCreateKnowledgeEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert(values)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] })
    },
  })
}

export function useUpdateKnowledgeEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] })
      queryClient.invalidateQueries({ queryKey: ['knowledge_base', data.id] })
    },
  })
}

export function useDeleteKnowledgeEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('knowledge_base').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] })
    },
  })
}

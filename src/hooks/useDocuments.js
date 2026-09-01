import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'documents'

export function useDocuments(companyId) {
  return useQuery({
    queryKey: ['documents', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(companyId),
  })
}

export async function getDocumentSignedUrl(path) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60)
  if (error) throw error
  return data.signedUrl
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ companyId, ownerId, file, nom, type, montant, statut }) => {
      const path = `${ownerId}/${companyId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from('documents')
        .insert({
          company_id: companyId,
          nom,
          type,
          url: path,
          montant,
          statut,
        })
        .select()
        .single()

      if (error) {
        await supabase.storage.from(BUCKET).remove([path])
        throw error
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', data.company_id] })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', data.company_id] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, companyId, path }) => {
      await supabase.storage.from(BUCKET).remove([path])
      const { error } = await supabase.from('documents').delete().eq('id', id)
      if (error) throw error
      return { companyId }
    },
    onSuccess: ({ companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', companyId] })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'documents'

// projectId présent -> documents rattachés à ce projet précis.
// projectId absent -> documents au niveau de la company (project_id nul).
export function useDocuments({ companyId, projectId }) {
  return useQuery({
    queryKey: ['documents', { companyId, projectId }],
    queryFn: async () => {
      let query = supabase.from('documents').select('*').order('created_at', { ascending: false })
      query = projectId
        ? query.eq('project_id', projectId)
        : query.eq('company_id', companyId).is('project_id', null)

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: Boolean(projectId || companyId),
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
    mutationFn: async ({
      companyId,
      projectId,
      ownerId,
      file,
      nom,
      type,
      montant,
      statut,
      date_document,
    }) => {
      const folder = projectId ? `${companyId}/projects/${projectId}` : companyId
      const path = `${ownerId}/${folder}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from('documents')
        .insert({
          company_id: companyId,
          project_id: projectId ?? null,
          nom,
          type,
          url: path,
          montant,
          statut,
          date_document,
        })
        .select()
        .single()

      if (error) {
        await supabase.storage.from(BUCKET).remove([path])
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, path }) => {
      if (path) await supabase.storage.from(BUCKET).remove([path])
      const { error } = await supabase.from('documents').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

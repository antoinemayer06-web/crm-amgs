import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'company-files'

// Infos de la société : une seule ligne par owner (upsert), même
// logique que finance_goals.
export function useCompanySettings() {
  return useQuery({
    queryKey: ['company_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('company_settings').select('*').maybeSingle()
      if (error) throw error
      return data
    },
  })
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ownerId, values }) => {
      const { data, error } = await supabase
        .from('company_settings')
        .upsert({ owner_id: ownerId, ...values }, { onConflict: 'owner_id' })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_settings'] })
    },
  })
}

export function useCompanyFiles() {
  return useQuery({
    queryKey: ['company_files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_files')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export async function getCompanyFileSignedUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60)
  if (error) throw error
  return data.signedUrl
}

export function useUploadCompanyFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, ownerId }) => {
      const path = `${ownerId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from('company_files')
        .insert({ owner_id: ownerId, nom: file.name, url: path })
        .select()
        .single()

      if (error) {
        await supabase.storage.from(BUCKET).remove([path])
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_files'] })
    },
  })
}

export function useDeleteCompanyFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, path }) => {
      await supabase.storage.from(BUCKET).remove([path])
      const { error } = await supabase.from('company_files').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_files'] })
    },
  })
}

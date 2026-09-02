import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'vision'
const SIGNED_URL_TTL = 60 * 60 // 1h : largement suffisant pour une session de travail sur le mur.

export function useVisionNotes() {
  return useQuery({
    queryKey: ['vision_notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vision_notes')
        .select('*')
        .order('z_index', { ascending: true })
      if (error) throw error

      const imageNotes = data.filter((note) => note.type === 'image' && note.image_url)
      if (imageNotes.length === 0) return data

      const { data: signedUrls, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(
          imageNotes.map((note) => note.image_url),
          SIGNED_URL_TTL,
        )
      if (signError) throw signError

      const urlByPath = new Map(signedUrls.map((entry) => [entry.path, entry.signedUrl]))
      return data.map((note) =>
        note.type === 'image' ? { ...note, resolvedImageUrl: urlByPath.get(note.image_url) ?? null } : note,
      )
    },
  })
}

// Pas d'invalidation sur create/delete : le canvas gère son tableau de
// noeuds localement (ajout/retrait direct) pour rester fluide — un
// refetch en cours de manipulation écraserait des éditions locales pas
// encore sauvegardées (texte en cours de frappe, drag en cours…).
export function useCreateVisionNote() {
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase.from('vision_notes').insert(values).select().single()
      if (error) throw error
      return data
    },
  })
}

export function useUpdateVisionNote() {
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { error } = await supabase.from('vision_notes').update(values).eq('id', id)
      if (error) throw error
    },
    // Pas d'invalidation ici : les mises à jour de position/taille/texte
    // viennent d'interactions locales déjà reflétées dans l'état React
    // Flow — recharger casserait le geste en cours de l'utilisateur.
  })
}

export function useDeleteVisionNote() {
  return useMutation({
    mutationFn: async ({ id, imagePath }) => {
      if (imagePath) {
        await supabase.storage.from(BUCKET).remove([imagePath])
      }
      const { error } = await supabase.from('vision_notes').delete().eq('id', id)
      if (error) throw error
    },
  })
}

export function useUploadVisionImage() {
  return useMutation({
    mutationFn: async ({ file, ownerId }) => {
      const path = `${ownerId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file)
      if (error) throw error
      return path
    },
  })
}

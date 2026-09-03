import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buildRecurrenceOccurrences } from '../lib/recurrenceUtils'
import { supabase } from '../lib/supabaseClient'

const PROJECT_SELECT = '*, company:companies(id, name, status)'

export function useProjects(filters = {}) {
  return useQuery({
    queryKey: ['projects', 'all', filters],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .order('date_livraison_prevue', { ascending: true, nullsFirst: false })

      if (filters.statut) {
        query = query.eq('statut', filters.statut)
      }
      if (filters.companyId) {
        query = query.eq('company_id', filters.companyId)
      }
      if (filters.archived !== undefined) {
        query = query.eq('archived', filters.archived)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useProjectsByCompany(companyId) {
  return useQuery({
    queryKey: ['projects', 'company', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: Boolean(companyId),
  })
}

export function useProject(id) {
  return useQuery({
    queryKey: ['projects', 'one', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_SELECT)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(values)
        .select(PROJECT_SELECT)
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(values)
        .eq('id', id)
        .select(PROJECT_SELECT)
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Met à jour le montant facturé du projet ET maintient un document daté
// (table `documents`, type "facture") en parallèle — c'est ce document
// daté que lisent les rapports financiers (CA facturé du mois), alors
// que `montant_facture` reste le total affiché sur la fiche projet.
// Sans ce second écrit, la saisie sur le projet n'a aucune date et ne
// remonte jamais dans les calculs mensuels.
// Date du document "facture" lié au projet (si déjà créé) — sert à
// pré-remplir le champ date de facturation sur la fiche projet, pour
// que l'utilisateur voie et puisse corriger la date déjà enregistrée
// plutôt que de repartir d'aujourd'hui à chaque ouverture.
export function useProjectFactureDate(projectId) {
  return useQuery({
    queryKey: ['documents', 'facture-date', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('date_document')
        .eq('project_id', projectId)
        .eq('type', 'facture')
        .maybeSingle()
      if (error) throw error
      return data?.date_document ?? null
    },
    enabled: Boolean(projectId),
  })
}

export function useUpdateProjectMontantFacture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, companyId, projectNom, montant, dateFacturation }) => {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ montant_facture: montant })
        .eq('id', projectId)
      if (updateError) throw updateError

      const { data: existing, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('project_id', projectId)
        .eq('type', 'facture')
        .maybeSingle()
      if (fetchError) throw fetchError

      const dateDocument = dateFacturation || new Date().toISOString().slice(0, 10)
      if (existing) {
        const { error } = await supabase
          .from('documents')
          .update({ montant, date_document: dateDocument })
          .eq('id', existing.id)
        if (error) throw error
      } else if (montant != null) {
        const { error } = await supabase.from('documents').insert({
          company_id: companyId,
          project_id: projectId,
          nom: `Facture — ${projectNom}`,
          type: 'facture',
          montant,
          date_document: dateDocument,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
    },
  })
}

// Génère une série de factures récurrentes (même mécanique que les
// dépenses/actions marketing : occurrences matérialisées en plusieurs
// lignes indépendantes) — la première occurrence remplace/crée le
// document "facture" suivi pour ce projet, les suivantes sont ajoutées.
export function useGenerateRecurringFacture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      projectId,
      companyId,
      projectNom,
      montant,
      dateDebut,
      frequence,
      intervalle,
      dateFin,
    }) => {
      const occurrences = buildRecurrenceOccurrences(
        {
          date_document: dateDebut,
          recurrence_frequence: frequence,
          recurrence_intervalle: intervalle,
          recurrence_fin: dateFin,
        },
        'date_document',
      )
      const [first, ...rest] = occurrences

      const { error: updateError } = await supabase
        .from('projects')
        .update({ montant_facture: montant })
        .eq('id', projectId)
      if (updateError) throw updateError

      const { data: existing, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('project_id', projectId)
        .eq('type', 'facture')
        .maybeSingle()
      if (fetchError) throw fetchError

      if (existing) {
        const { error } = await supabase
          .from('documents')
          .update({ montant, ...first })
          .eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('documents').insert({
          company_id: companyId,
          project_id: projectId,
          nom: `Facture — ${projectNom}`,
          type: 'facture',
          montant,
          ...first,
        })
        if (error) throw error
      }

      if (rest.length > 0) {
        const { error } = await supabase.from('documents').insert(
          rest.map((occurrence) => ({
            company_id: companyId,
            project_id: projectId,
            nom: `Facture — ${projectNom}`,
            type: 'facture',
            montant,
            ...occurrence,
          })),
        )
        if (error) throw error
      }

      return occurrences.length
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Un client est "actif" s'il a au moins un projet non archivé encore en
// cours de livraison, "inactif" sinon (y compris s'il n'a aucun projet).
export function useClientActivityMap(companyIds) {
  return useQuery({
    queryKey: ['projects', 'activity-map', companyIds],
    queryFn: async () => {
      const map = {}
      for (const id of companyIds) map[id] = false

      const { data, error } = await supabase
        .from('projects')
        .select('company_id, statut, archived')
        .in('company_id', companyIds)
      if (error) throw error

      for (const project of data) {
        if (!project.archived && project.statut === 'en_cours_livraison') {
          map[project.company_id] = true
        }
      }
      return map
    },
    enabled: companyIds.length > 0,
  })
}

// -----------------------------------------------------------------
// project_steps : chargés globalement une fois et partagés (cartes
// kanban/liste pour les compteurs, panneau latéral pour le détail).
// -----------------------------------------------------------------
export function useAllProjectSteps() {
  return useQuery({
    queryKey: ['project_steps', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_steps')
        .select('*')
        .order('ordre', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateProjectStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('project_steps')
        .insert(values)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

export function useUpdateProjectStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('project_steps')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

export function useDeleteProjectStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('project_steps').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

// Réordonnancement : met à jour `ordre` pour chaque étape déplacée.
export function useReorderProjectSteps() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (steps) => {
      await Promise.all(
        steps.map((step, index) =>
          supabase.from('project_steps').update({ ordre: index }).eq('id', step.id),
        ),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_steps'] })
    },
  })
}

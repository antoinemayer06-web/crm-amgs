import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*, company:companies(id, name)')
        .order('date_debut', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(values)
        .select('*, company:companies(id, name)')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar_events'] })
    },
  })
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('calendar_events')
        .update(values)
        .eq('id', id)
        .select('*, company:companies(id, name)')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar_events'] })
    },
  })
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('calendar_events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar_events'] })
    },
  })
}

// Agrège tout ce qui a une date dans le CRM en une liste unique
// d'éléments de calendrier : actions marketing, échéances de projet,
// étapes de projet datées, et événements libres. Chaque source garde
// son lien vers l'entité d'origine (sauf les événements libres, qui
// sont l'entité elle-même).
export function useCalendarData() {
  const marketingQuery = useQuery({
    queryKey: ['calendar', 'marketing_actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_actions')
        .select('id, titre, date_prevue, statut')
        .not('date_prevue', 'is', null)
      if (error) throw error
      return data
    },
  })

  const projectsQuery = useQuery({
    queryKey: ['calendar', 'projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, nom, date_livraison_prevue, archived, company:companies(id, name)')
        .not('date_livraison_prevue', 'is', null)
        .eq('archived', false)
      if (error) throw error
      return data
    },
  })

  const stepsQuery = useQuery({
    queryKey: ['calendar', 'project_steps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_steps')
        .select('id, titre, statut, date_debut, date_fin, project:projects(id, nom, archived)')
      if (error) throw error
      return data.filter((step) => (step.date_debut || step.date_fin) && !step.project?.archived)
    },
  })

  const eventsQuery = useCalendarEvents()

  const isLoading =
    marketingQuery.isLoading || projectsQuery.isLoading || stepsQuery.isLoading || eventsQuery.isLoading
  const isError = marketingQuery.isError || projectsQuery.isError || stepsQuery.isError || eventsQuery.isError

  const items = []

  for (const action of marketingQuery.data ?? []) {
    items.push({
      key: `marketing-${action.id}`,
      sourceType: 'marketing',
      title: action.titre,
      date: action.date_prevue,
      linkTo: '/marketing',
      raw: action,
    })
  }

  for (const project of projectsQuery.data ?? []) {
    items.push({
      key: `deadline-${project.id}`,
      sourceType: 'project_deadline',
      title: project.nom,
      subtitle: project.company?.name,
      date: project.date_livraison_prevue,
      linkTo: `/projects?open=${project.id}`,
      raw: project,
    })
  }

  for (const step of stepsQuery.data ?? []) {
    items.push({
      key: `step-${step.id}`,
      sourceType: 'project_step',
      title: step.titre,
      subtitle: step.project?.nom,
      date: step.date_fin || step.date_debut,
      linkTo: step.project ? `/projects?open=${step.project.id}` : null,
      raw: step,
    })
  }

  for (const event of eventsQuery.data ?? []) {
    items.push({
      key: `event-${event.id}`,
      sourceType: 'event',
      title: event.titre,
      subtitle: event.company?.name,
      date: event.date_debut,
      linkTo: null,
      raw: event,
    })
  }

  return { items, isLoading, isError }
}

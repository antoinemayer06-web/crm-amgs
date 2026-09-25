import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const EVENT_TYPES = ['page_view', 'clic_calendly', 'clic_email', 'clic_linkedin', 'clic_whatsapp']

function periodRange(period) {
  const now = new Date()
  const start = new Date(now)
  if (period === 'jour') {
    start.setHours(0, 0, 0, 0)
  } else if (period === 'semaine') {
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
  } else {
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0, 0)
  }
  return { start, end: now }
}

// Regroupe les événements en points pour le graphique d'évolution : par
// heure sur une journée (plus lisible qu'un seul point), par jour sur une
// semaine ou un mois.
function buildSeries(events, period, start, end) {
  const buckets = new Map()

  if (period === 'jour') {
    for (let h = 0; h < 24; h += 1) {
      buckets.set(String(h), { label: `${h}h`, visites: 0 })
    }
    for (const event of events) {
      if (event.type !== 'page_view') continue
      const hour = new Date(event.date_heure).getHours()
      buckets.get(String(hour)).visites += 1
    }
  } else {
    const cursor = new Date(start)
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10)
      buckets.set(key, {
        label: cursor.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        visites: 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    for (const event of events) {
      if (event.type !== 'page_view') continue
      const key = event.date_heure.slice(0, 10)
      if (buckets.has(key)) buckets.get(key).visites += 1
    }
  }

  return [...buckets.values()]
}

export function useSiteEvents(period) {
  const { start, end } = periodRange(period)

  return useQuery({
    queryKey: ['site_events', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evenements_site')
        .select('type, page, session_id, date_heure')
        .gte('date_heure', start.toISOString())
        .lte('date_heure', end.toISOString())
      if (error) throw error

      const compteurs = Object.fromEntries(EVENT_TYPES.map((type) => [type, 0]))
      const visiteursUniques = new Set()
      const pagesVues = new Map()

      for (const event of data) {
        if (compteurs[event.type] !== undefined) compteurs[event.type] += 1
        if (event.session_id) visiteursUniques.add(event.session_id)
        if (event.type === 'page_view' && event.page) {
          pagesVues.set(event.page, (pagesVues.get(event.page) ?? 0) + 1)
        }
      }

      const topPages = [...pagesVues.entries()]
        .map(([page, vues]) => ({ page, vues }))
        .sort((a, b) => b.vues - a.vues)
        .slice(0, 10)

      return {
        compteurs,
        visiteursUniques: visiteursUniques.size,
        topPages,
        series: buildSeries(data, period, start, end),
      }
    },
  })
}

export function useSiteLeads() {
  return useQuery({
    queryKey: ['demandes_site'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demandes_site')
        .select('*')
        .order('date_soumission', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useUpdateSiteLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase
        .from('demandes_site')
        .update(values)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandes_site'] })
    },
  })
}

export function useDeleteSiteLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('demandes_site').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandes_site'] })
    },
  })
}

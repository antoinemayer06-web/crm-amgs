import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

const DEFAULT_TYPES_ACTIFS = {
  action_marketing_du_jour: true,
  facture_impayee_7j: true,
  objectif_mi_mois: true,
  objectif_fin_mois: true,
  projet_demarre_ou_termine_bientot: true,
  prospect_bloque_devis: true,
  evenement_calendrier: true,
}

// Mêmes règles de redirection que la fonction planifiée (voir
// supabase/functions/daily-notifications) : au clic, on retombe sur les
// mêmes URLs que celles envoyées dans le payload push.
export function notificationTargetUrl(notification) {
  const { entite_type: entiteType, entite_id: entiteId } = notification
  if (entiteType === 'project') return `/projects?open=${entiteId}`
  if (entiteType === 'company') return `/companies/${entiteId}`
  if (entiteType === 'marketing_action') return '/marketing'
  if (entiteType === 'calendar_event') return `/calendar?open=${entiteId}`
  return null
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('notifications').update({ lue: true }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notifications').update({ lue: true }).eq('lue', false)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// notification_settings : une ligne par owner (upsert), même logique que
// finance_goals / company_settings. Types manquants dans la ligne (ou
// aucune ligne du tout) = activés par défaut.
export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('types_actifs')
        .maybeSingle()
      if (error) throw error
      return { ...DEFAULT_TYPES_ACTIFS, ...(data?.types_actifs ?? {}) }
    },
  })
}

// Rapport hebdomadaire par email (voir supabase/functions/weekly-report) —
// même ligne de réglages, colonne dédiée distincte de types_actifs.
export function useWeeklyReportSetting() {
  return useQuery({
    queryKey: ['notification_settings', 'weekly_report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('rapport_hebdomadaire_actif')
        .maybeSingle()
      if (error) throw error
      return data?.rapport_hebdomadaire_actif ?? true
    },
  })
}

export function useUpdateWeeklyReportSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ownerId, active }) => {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({ owner_id: ownerId, rapport_hebdomadaire_actif: active }, { onConflict: 'owner_id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification_settings'] })
    },
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ownerId, typesActifs }) => {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({ owner_id: ownerId, types_actifs: typesActifs }, { onConflict: 'owner_id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification_settings'] })
    },
  })
}

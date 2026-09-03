import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buildRecurrenceOccurrences } from '../lib/recurrenceUtils'
import { supabase } from '../lib/supabaseClient'

const today = () => new Date().toISOString().slice(0, 10)

// Factures récurrentes rattachées à une entreprise (pas à un projet) —
// distinct du modèle de facturation par projet (documents.type='facture'),
// avec un suivi paiement propre : une occurrence ne compte dans le CA
// facturé qu'une fois marquée payée (voir getRecurringInvoicesCAForMonth).
export function useRecurringInvoicesByCompany(companyId) {
  return useQuery({
    queryKey: ['recurring_invoices', 'company', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_invoices')
        .select('*')
        .eq('company_id', companyId)
        .order('date_prevue', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: Boolean(companyId),
  })
}

export function useAllRecurringInvoices() {
  return useQuery({
    queryKey: ['recurring_invoices', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_invoices')
        .select('*, company:companies(id, name)')
        .order('date_prevue', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

// Une facture récurrente est éclatée en plusieurs lignes (une par
// occurrence) dès la création — voir buildRecurrenceOccurrences.
export function useCreateRecurringInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values) => {
      const occurrences = buildRecurrenceOccurrences(values, 'date_prevue')
      const { data, error } = await supabase.from('recurring_invoices').insert(occurrences).select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_invoices'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteRecurringInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('recurring_invoices').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_invoices'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Marquer facturée fixe la date de facturation (aujourd'hui par défaut) ;
// démarquer l'efface — c'est cette date qui détermine le mois où la
// facture compte dans le CA facturé (distinct du paiement, voir plus bas).
export function useSetRecurringInvoiceFactured() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, facturee, dateFacturation }) => {
      const { error } = await supabase
        .from('recurring_invoices')
        .update({ facturee, date_facturation: facturee ? dateFacturation || today() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_invoices'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateRecurringInvoiceFacturationDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dateFacturation }) => {
      const { error } = await supabase
        .from('recurring_invoices')
        .update({ date_facturation: dateFacturation })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_invoices'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Marquer payée fixe la date de paiement (aujourd'hui par défaut) ;
// démarquer l'efface — c'est cette date qui détermine le mois où la
// facture compte dans le CA encaissé (distinct de la facturation, ci-dessus).
export function useSetRecurringInvoicePaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payee, datePaiement }) => {
      const { error } = await supabase
        .from('recurring_invoices')
        .update({ payee, date_paiement: payee ? datePaiement || today() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_invoices'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateRecurringInvoicePaymentDate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, datePaiement }) => {
      const { error } = await supabase
        .from('recurring_invoices')
        .update({ date_paiement: datePaiement })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_invoices'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

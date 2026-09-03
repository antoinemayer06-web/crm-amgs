import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Instantané consolidé pour la page Finance : documents (CA facturé),
// encaissements réels (cash_collections), dépenses et objectif mensuel.
export function useFinanceData() {
  return useQuery({
    queryKey: ['finance'],
    queryFn: async () => {
      const [documentsRes, cashCollectionsRes, expensesRes, financeGoalRes, recurringInvoicesRes] =
        await Promise.all([
          supabase.from('documents').select('id, type, montant, date_document'),
          supabase.from('cash_collections').select('*, project:projects(id, nom)'),
          supabase.from('expenses').select('*'),
          supabase.from('finance_goals').select('*').maybeSingle(),
          supabase.from('recurring_invoices').select('*, company:companies(id, name)'),
        ])

      for (const res of [documentsRes, cashCollectionsRes, expensesRes, financeGoalRes, recurringInvoicesRes]) {
        if (res.error) throw res.error
      }

      return {
        documents: documentsRes.data,
        cashCollections: cashCollectionsRes.data,
        expenses: expensesRes.data,
        financeGoal: financeGoalRes.data,
        recurringInvoices: recurringInvoicesRes.data,
      }
    },
  })
}

import { useState } from 'react'
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from '../../lib/constants'

const today = () => new Date().toISOString().slice(0, 10)

const emptyValues = { libelle: '', categorie: 'autre', montant: '', date_depense: today() }

export default function ExpenseForm({ onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(emptyValues)
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.libelle.trim()) {
      setError('Le libellé est obligatoire.')
      return
    }
    if (values.montant === '' || Number(values.montant) <= 0) {
      setError('Le montant doit être un nombre positif.')
      return
    }

    try {
      await onSubmit({
        libelle: values.libelle.trim(),
        categorie: values.categorie,
        montant: Number(values.montant),
        date_depense: values.date_depense || today(),
      })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="libelle" className="block text-sm font-medium text-neutral-700">
          Libellé *
        </label>
        <input
          id="libelle"
          value={values.libelle}
          onChange={(event) => update('libelle', event.target.value)}
          placeholder="ex : URSSAF T3, abonnement HubSpot…"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="categorie" className="block text-sm font-medium text-neutral-700">
            Catégorie
          </label>
          <select
            id="categorie"
            value={values.categorie}
            onChange={(event) => update('categorie', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            {EXPENSE_CATEGORIES.map((categorie) => (
              <option key={categorie} value={categorie}>
                {EXPENSE_CATEGORY_LABELS[categorie]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="montant" className="block text-sm font-medium text-neutral-700">
            Montant (€) *
          </label>
          <input
            id="montant"
            type="number"
            step="0.01"
            min="0"
            value={values.montant}
            onChange={(event) => update('montant', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="date_depense" className="block text-sm font-medium text-neutral-700">
          Date
        </label>
        <input
          id="date_depense"
          type="date"
          value={values.date_depense}
          onChange={(event) => update('date_depense', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? 'Enregistrement…' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

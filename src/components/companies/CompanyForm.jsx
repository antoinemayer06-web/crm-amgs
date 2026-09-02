import { useState } from 'react'
import {
  COMPANY_SOURCES,
  COMPANY_STATUS_OPTIONS,
  STATUT_PROSPECT_OPTIONS,
  TEMPERATURE_OPTIONS,
  formatEnumLabel,
} from '../../lib/constants'

const emptyValues = {
  name: '',
  status: 'prospect',
  sector: '',
  size: '',
  source: '',
  contact: '',
  statut_prospect: '',
  temperature: '',
  date_contact: '',
  valeur_estimee: '',
  prochaine_action: '',
  date_prochaine_action: '',
  notes_generales: '',
}

// Les colonnes nullable arrivent en `null` depuis Supabase : on les
// normalise en chaîne vide pour que les <input>/<select> restent
// contrôlés et que `.trim()` ne plante jamais sur une valeur d'édition.
function toFormValues(initialValues) {
  if (!initialValues) return {}
  const values = {}
  for (const key of Object.keys(emptyValues)) {
    if (key in initialValues) {
      values[key] = initialValues[key] ?? ''
    }
  }
  return values
}

export default function CompanyForm({
  initialValues,
  defaultStatus,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [values, setValues] = useState({
    ...emptyValues,
    status: defaultStatus ?? emptyValues.status,
    ...toFormValues(initialValues),
  })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError('Le nom est obligatoire.')
      return
    }

    // Une fois le devis signé, l'entreprise devient automatiquement
    // cliente — aucune action manuelle supplémentaire n'est nécessaire.
    const isConverting = values.status === 'prospect' && values.statut_prospect === 'devis_signé'
    const finalStatus = isConverting ? 'client' : values.status
    const finalStatutProspect =
      finalStatus === 'prospect' ? values.statut_prospect || 'à_contacter' : null

    const payload = {
      name: values.name.trim(),
      status: finalStatus,
      sector: values.sector.trim() || null,
      size: values.size.trim() || null,
      source: values.source || null,
      contact: values.contact.trim() || null,
      statut_prospect: finalStatutProspect,
      temperature: isConverting ? 'chaud' : values.temperature || null,
      date_contact: finalStatutProspect ? values.date_contact || null : null,
      valeur_estimee:
        finalStatutProspect && values.valeur_estimee !== '' ? Number(values.valeur_estimee) : null,
      prochaine_action: finalStatutProspect ? values.prochaine_action.trim() || null : null,
      date_prochaine_action: finalStatutProspect ? values.date_prochaine_action || null : null,
      notes_generales: values.notes_generales.trim() || null,
    }

    try {
      await onSubmit(payload)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-ink-secondary">
          Nom *
        </label>
        <input
          id="name"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-ink-secondary">
            Statut
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(event) => update('status', event.target.value)}
            className="w-full input-chrome"
          >
            {COMPANY_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="temperature" className="block text-sm font-medium text-ink-secondary">
            Température
          </label>
          <select
            id="temperature"
            value={values.temperature}
            onChange={(event) => update('temperature', event.target.value)}
            className="w-full input-chrome"
          >
            <option value="">—</option>
            {TEMPERATURE_OPTIONS.map((temp) => (
              <option key={temp} value={temp}>
                {formatEnumLabel(temp)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {values.status === 'prospect' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="statut_prospect" className="block text-sm font-medium text-ink-secondary">
              Étape prospect
            </label>
            <select
              id="statut_prospect"
              value={values.statut_prospect}
              onChange={(event) => update('statut_prospect', event.target.value)}
              className="w-full input-chrome"
            >
              {STATUT_PROSPECT_OPTIONS.map((statut) => (
                <option key={statut} value={statut}>
                  {formatEnumLabel(statut)}
                </option>
              ))}
            </select>
          </div>
          {values.statut_prospect === 'contacté' && (
            <div className="space-y-1">
              <label htmlFor="date_contact" className="block text-sm font-medium text-ink-secondary">
                Date de contact
              </label>
              <input
                id="date_contact"
                type="date"
                value={values.date_contact}
                onChange={(event) => update('date_contact', event.target.value)}
                className="w-full input-chrome"
              />
            </div>
          )}
          <div className="space-y-1">
            <label htmlFor="valeur_estimee" className="block text-sm font-medium text-ink-secondary">
              Valeur estimée (€)
            </label>
            <input
              id="valeur_estimee"
              type="number"
              step="0.01"
              min="0"
              value={values.valeur_estimee}
              onChange={(event) => update('valeur_estimee', event.target.value)}
              className="w-full input-chrome"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="prochaine_action" className="block text-sm font-medium text-ink-secondary">
              Prochaine action
            </label>
            <input
              id="prochaine_action"
              value={values.prochaine_action}
              onChange={(event) => update('prochaine_action', event.target.value)}
              className="w-full input-chrome"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="date_prochaine_action"
              className="block text-sm font-medium text-ink-secondary"
            >
              Date de la prochaine action
            </label>
            <input
              id="date_prochaine_action"
              type="date"
              value={values.date_prochaine_action}
              onChange={(event) => update('date_prochaine_action', event.target.value)}
              className="w-full input-chrome"
            />
          </div>
        </div>
      )}

      {values.status === 'client' && (
        <p className="rounded-md bg-surface-hover px-3 py-2 text-sm text-ink-secondary">
          Le statut de livraison/facturation se gère désormais par projet, depuis
          l'onglet « Projets liés ».
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="sector" className="block text-sm font-medium text-ink-secondary">
            Secteur
          </label>
          <input
            id="sector"
            value={values.sector}
            onChange={(event) => update('sector', event.target.value)}
            className="w-full input-chrome"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="size" className="block text-sm font-medium text-ink-secondary">
            Taille
          </label>
          <input
            id="size"
            value={values.size}
            onChange={(event) => update('size', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="source" className="block text-sm font-medium text-ink-secondary">
            Source
          </label>
          <select
            id="source"
            value={values.source}
            onChange={(event) => update('source', event.target.value)}
            className="w-full input-chrome"
          >
            <option value="">—</option>
            {COMPANY_SOURCES.map((source) => (
              <option key={source} value={source}>
                {formatEnumLabel(source)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="contact" className="block text-sm font-medium text-ink-secondary">
            Contact
          </label>
          <input
            id="contact"
            value={values.contact}
            onChange={(event) => update('contact', event.target.value)}
            placeholder="téléphone, email…"
            className="w-full input-chrome"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes_generales" className="block text-sm font-medium text-ink-secondary">
          Notes générales
        </label>
        <textarea
          id="notes_generales"
          rows={3}
          value={values.notes_generales}
          onChange={(event) => update('notes_generales', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
          Annuler
        </button>
        <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

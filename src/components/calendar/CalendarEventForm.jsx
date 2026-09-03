import { useEffect, useState } from 'react'
import { useCompanies } from '../../hooks/useCompanies'

const ALERT_OPTIONS = [
  { value: '', label: 'Pas de rappel' },
  { value: '15', label: '15 minutes avant' },
  { value: '30', label: '30 minutes avant' },
  { value: '60', label: '1 heure avant' },
  { value: '1440', label: '1 jour avant' },
]

// datetime-local attend "YYYY-MM-DDTHH:mm" en heure locale — un ISO
// timestamptz brut (UTC) afficherait la mauvaise heure dans le champ.
function toDatetimeLocalValue(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function defaultStart(prefillDate) {
  const date = prefillDate ? new Date(prefillDate) : new Date()
  date.setHours(9, 0, 0, 0)
  return toDatetimeLocalValue(date.toISOString())
}

export default function CalendarEventForm({ initialValues, prefillDate, onSubmit, onCancel, submitting }) {
  const { data: companies } = useCompanies({})
  const [values, setValues] = useState({
    titre: initialValues?.titre ?? '',
    description: initialValues?.description ?? '',
    date_debut: initialValues ? toDatetimeLocalValue(initialValues.date_debut) : defaultStart(prefillDate),
    date_fin: initialValues ? toDatetimeLocalValue(initialValues.date_fin) : '',
    lieu: initialValues?.lieu ?? '',
    company_id: initialValues?.company_id ?? '',
    alerte_avant_minutes: initialValues?.alerte_avant_minutes?.toString() ?? '',
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!initialValues) {
      setValues((prev) => ({ ...prev, date_debut: defaultStart(prefillDate) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillDate])

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }
    if (!values.date_debut) {
      setError('La date de début est obligatoire.')
      return
    }

    const payload = {
      titre: values.titre.trim(),
      description: values.description.trim() || null,
      date_debut: new Date(values.date_debut).toISOString(),
      date_fin: values.date_fin ? new Date(values.date_fin).toISOString() : null,
      lieu: values.lieu.trim() || null,
      company_id: values.company_id || null,
      alerte_avant_minutes: values.alerte_avant_minutes ? Number(values.alerte_avant_minutes) : null,
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
        <label htmlFor="titre" className="block text-sm font-medium text-ink-secondary">
          Titre *
        </label>
        <input
          id="titre"
          value={values.titre}
          onChange={(event) => update('titre', event.target.value)}
          placeholder="ex : Rendez-vous client, réunion d'équipe…"
          className="w-full input-chrome"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-ink-secondary">
          Description
        </label>
        <textarea
          id="description"
          rows={2}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="date_debut" className="block text-sm font-medium text-ink-secondary">
            Début *
          </label>
          <input
            id="date_debut"
            type="datetime-local"
            value={values.date_debut}
            onChange={(event) => update('date_debut', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="date_fin" className="block text-sm font-medium text-ink-secondary">
            Fin
          </label>
          <input
            id="date_fin"
            type="datetime-local"
            value={values.date_fin}
            onChange={(event) => update('date_fin', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="lieu" className="block text-sm font-medium text-ink-secondary">
            Lieu
          </label>
          <input
            id="lieu"
            value={values.lieu}
            onChange={(event) => update('lieu', event.target.value)}
            placeholder="Adresse ou lien visio"
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="company_id" className="block text-sm font-medium text-ink-secondary">
            Entreprise liée
          </label>
          <select
            id="company_id"
            value={values.company_id}
            onChange={(event) => update('company_id', event.target.value)}
            className="w-full input-chrome"
          >
            <option value="">—</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="alerte_avant_minutes" className="block text-sm font-medium text-ink-secondary">
          Rappel
        </label>
        <select
          id="alerte_avant_minutes"
          value={values.alerte_avant_minutes}
          onChange={(event) => update('alerte_avant_minutes', event.target.value)}
          className="w-full input-chrome"
        >
          {ALERT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-md border border-chrome-dark px-3 py-2 text-sm text-ink-secondary hover:bg-surface-hover max-md:min-h-[44px] sm:w-auto"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary sm:w-auto"
        >
          {submitting ? 'Enregistrement…' : initialValues ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  )
}

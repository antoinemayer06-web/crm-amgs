import { useEffect, useState } from 'react'

const UNITE_LABELS = { par_semaine: '/ semaine', par_mois: '/ mois' }

function formatMontant(value) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} €`
}

// Argument à montrer au client : mise en valeur du temps gagné et de la
// valeur générée par l'automatisation, dans le même style que la
// hero card "CA total" du Dashboard.
export default function ProjectImpactTab({ project, onSave }) {
  const [tempsGagne, setTempsGagne] = useState('')
  const [tempsUnite, setTempsUnite] = useState('par_mois')
  const [valeurEconomisee, setValeurEconomisee] = useState('')

  useEffect(() => {
    setTempsGagne(project.temps_gagne_estime_heures ?? '')
    setTempsUnite(project.temps_gagne_unite ?? 'par_mois')
    setValeurEconomisee(project.valeur_economisee_estimee ?? '')
  }, [project])

  function commitTempsGagne() {
    const value = tempsGagne === '' ? null : Number(tempsGagne)
    if (value !== (project.temps_gagne_estime_heures ?? null)) {
      onSave('temps_gagne_estime_heures', value)
    }
  }

  function handleUniteChange(event) {
    const value = event.target.value
    setTempsUnite(value)
    onSave('temps_gagne_unite', value)
  }

  function commitValeur() {
    const value = valeurEconomisee === '' ? null : Number(valeurEconomisee)
    if (value !== (project.valeur_economisee_estimee ?? null)) {
      onSave('valeur_economisee_estimee', value)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card-chrome-lit card-glass rounded-xl p-6">
          <p className="text-sm font-medium text-ink-tertiary">Temps gagné estimé</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-ink sm:text-5xl">
            {tempsGagne === '' ? '—' : `${tempsGagne} h`}
            {tempsGagne !== '' && (
              <span className="ml-1 text-lg font-medium text-ink-tertiary">
                {UNITE_LABELS[tempsUnite]}
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-ink-secondary">Grâce à l'automatisation mise en place</p>
        </div>
        <div className="card-chrome-lit card-glass rounded-xl p-6">
          <p className="text-sm font-medium text-ink-tertiary">Valeur générée estimée</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-ink sm:text-5xl">
            {formatMontant(valeurEconomisee)}
          </p>
          <p className="mt-1 text-xs text-ink-secondary">Un argument à partager avec le client</p>
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-chrome-dark p-4">
        <p className="text-xs font-medium text-ink-secondary">Renseigner l'estimation</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-secondary">Temps gagné (h)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={tempsGagne}
              onChange={(event) => setTempsGagne(event.target.value)}
              onBlur={commitTempsGagne}
              className="w-full input-chrome"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-secondary">Par</label>
            <select value={tempsUnite} onChange={handleUniteChange} className="w-full input-chrome">
              <option value="par_semaine">Semaine</option>
              <option value="par_mois">Mois</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-secondary">Valeur générée (€)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={valeurEconomisee}
              onChange={(event) => setValeurEconomisee(event.target.value)}
              onBlur={commitValeur}
              className="w-full input-chrome"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

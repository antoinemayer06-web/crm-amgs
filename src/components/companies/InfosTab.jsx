import { STATUT_PROSPECT_TONES, TEMPERATURE_TONES, formatEnumLabel } from '../../lib/constants'
import Badge from '../ui/Badge'

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-ink-secondary">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children ?? '—'}</dd>
    </div>
  )
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : null)
const formatMontant = (value) =>
  value == null ? null : `${Number(value).toLocaleString('fr-FR')} €`

export default function InfosTab({ company, actif }) {
  return (
    <div className="space-y-6 rounded-lg border border-chrome-dark bg-surface p-6">
      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <Field label="Secteur">{company.sector}</Field>
        <Field label="Taille">{company.size}</Field>
        <Field label="Source">{formatEnumLabel(company.source)}</Field>
        <Field label="Contact">{company.contact}</Field>
        <Field label="Température">
          {company.temperature ? (
            <Badge tone={TEMPERATURE_TONES[company.temperature]}>
              {formatEnumLabel(company.temperature)}
            </Badge>
          ) : null}
        </Field>

        {company.status === 'prospect' && (
          <>
            <Field label="Étape prospect">
              {company.statut_prospect ? (
                <Badge tone={STATUT_PROSPECT_TONES[company.statut_prospect]}>
                  {formatEnumLabel(company.statut_prospect)}
                </Badge>
              ) : null}
            </Field>
            <Field label="Date de contact">{formatDate(company.date_contact)}</Field>
            <Field label="Valeur estimée">{formatMontant(company.valeur_estimee)}</Field>
            <Field label="Prochaine action">{company.prochaine_action}</Field>
            <Field label="Date prochaine action">
              {formatDate(company.date_prochaine_action)}
            </Field>
          </>
        )}

        {company.status === 'client' && (
          <Field label="Activité">
            <Badge tone={actif ? 'green' : 'neutral'}>{actif ? 'Actif' : 'Inactif'}</Badge>
          </Field>
        )}
      </dl>

      {company.status === 'client' && (
        <p className="rounded-md bg-surface-hover px-3 py-2 text-sm text-ink-secondary">
          Le statut de livraison/facturation se gère par projet, depuis l'onglet
          « Projets liés ».
        </p>
      )}

      <div>
        <dt className="text-xs font-medium uppercase text-ink-secondary">Notes générales</dt>
        <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">
          {company.notes_generales || '—'}
        </dd>
      </div>
    </div>
  )
}

import {
  STATUT_LIVRAISON_TONES,
  STATUT_PROSPECT_TONES,
  TEMPERATURE_TONES,
  isEcheanceUrgente,
} from '../../lib/constants'
import Badge from '../ui/Badge'

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-neutral-500">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-900">{children ?? '—'}</dd>
    </div>
  )
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : null)

export default function InfosTab({ company, actif }) {
  const urgent =
    company.statut_livraison === 'en_cours_livraison' && isEcheanceUrgente(company.date_echeance)

  return (
    <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <Field label="Secteur">{company.sector}</Field>
        <Field label="Taille">{company.size}</Field>
        <Field label="Source">{company.source}</Field>
        <Field label="Contact">{company.contact}</Field>
        <Field label="Température">
          {company.temperature ? (
            <Badge tone={TEMPERATURE_TONES[company.temperature]}>{company.temperature}</Badge>
          ) : null}
        </Field>

        {company.status === 'prospect' && (
          <>
            <Field label="Étape prospect">
              {company.statut_prospect ? (
                <Badge tone={STATUT_PROSPECT_TONES[company.statut_prospect]}>
                  {company.statut_prospect}
                </Badge>
              ) : null}
            </Field>
            <Field label="Date de contact">{formatDate(company.date_contact)}</Field>
          </>
        )}

        {company.status === 'client' && (
          <>
            <Field label="Statut livraison">
              {company.statut_livraison ? (
                <div className="flex items-center gap-2">
                  <Badge tone={STATUT_LIVRAISON_TONES[company.statut_livraison]}>
                    {company.statut_livraison}
                  </Badge>
                  {urgent && (
                    <span className="text-xs font-medium text-red-600">
                      ● échéance dépassée ou proche
                    </span>
                  )}
                </div>
              ) : null}
            </Field>
            {company.statut_livraison === 'en_cours_livraison' && (
              <Field label="Date d'échéance">{formatDate(company.date_echeance)}</Field>
            )}
            <Field label="Activité">
              <Badge tone={actif ? 'green' : 'neutral'}>{actif ? 'actif' : 'inactif'}</Badge>
            </Field>
          </>
        )}
      </dl>

      <div>
        <dt className="text-xs font-medium uppercase text-neutral-500">Notes générales</dt>
        <dd className="mt-1 whitespace-pre-wrap text-sm text-neutral-900">
          {company.notes_generales || '—'}
        </dd>
      </div>
    </div>
  )
}

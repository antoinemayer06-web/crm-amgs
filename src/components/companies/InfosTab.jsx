import Badge from '../ui/Badge'
import { HEALTH_SCORE_TONES } from '../../lib/constants'

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-neutral-500">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-900">{children ?? '—'}</dd>
    </div>
  )
}

export default function InfosTab({ company }) {
  return (
    <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
      <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <Field label="Secteur">{company.sector}</Field>
        <Field label="Taille">{company.size}</Field>
        <Field label="Source">{company.source}</Field>
        <Field label="Health score">
          {company.health_score ? (
            <Badge tone={HEALTH_SCORE_TONES[company.health_score]}>
              {company.health_score}
            </Badge>
          ) : null}
        </Field>
        <Field label="Site web">
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-900 hover:underline"
            >
              {company.website}
            </a>
          ) : null}
        </Field>
        <Field label="Tags">
          {company.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {company.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </Field>
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

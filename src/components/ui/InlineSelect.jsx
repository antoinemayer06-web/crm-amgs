import { formatEnumLabel } from '../../lib/constants'
import { tones } from './Badge'

// Select stylé comme un badge, pour changer un statut directement dans
// une ligne de tableau sans ouvrir de modale.
export default function InlineSelect({ value, options, toneMap, onChange, disabled, placeholder = '—' }) {
  const toneClass = value ? tones[toneMap?.[value]] ?? tones.neutral : 'bg-surface-hover text-ink-tertiary'

  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value || null)}
      disabled={disabled}
      onClick={(event) => event.stopPropagation()}
      className={`rounded-full border-0 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-chrome-mid disabled:opacity-50 ${toneClass}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatEnumLabel(option)}
        </option>
      ))}
    </select>
  )
}

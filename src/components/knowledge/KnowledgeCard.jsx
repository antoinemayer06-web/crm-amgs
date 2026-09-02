import { KNOWLEDGE_CATEGORY_LABELS, KNOWLEDGE_CATEGORY_TONES } from '../../lib/constants'
import Badge from '../ui/Badge'

const PREVIEW_LENGTH = 140

function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function KnowledgeCard({ entry, onClick }) {
  const stripped = stripMarkdown(entry.contenu)
  const preview = stripped.slice(0, PREVIEW_LENGTH)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-2 rounded-xl border border-chrome-dark bg-surface p-4 text-left shadow-sm transition-shadow duration-150 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-ink">{entry.titre}</p>
        <Badge tone={KNOWLEDGE_CATEGORY_TONES[entry.categorie]}>
          {KNOWLEDGE_CATEGORY_LABELS[entry.categorie]}
        </Badge>
      </div>

      {preview && (
        <p className="line-clamp-2 text-sm text-ink-secondary">
          {preview}
          {stripped.length > PREVIEW_LENGTH ? '…' : ''}
        </p>
      )}

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-ink-secondary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

import { useState } from 'react'
import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_CATEGORY_LABELS } from '../../lib/constants'
import KnowledgeCard from './KnowledgeCard'

function EmptyState({ label }) {
  return (
    <div className="rounded-xl border border-chrome-dark bg-surface py-12 text-center">
      <p className="text-sm text-ink-tertiary">{label}</p>
    </div>
  )
}

function CardGrid({ entries, onEntryClick }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => (
        <KnowledgeCard key={entry.id} entry={entry} onClick={() => onEntryClick(entry)} />
      ))}
    </div>
  )
}

function CategorySection({ categorie, entries, onEntryClick }) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-3 flex items-center gap-2 text-left"
      >
        <span className={`text-ink-tertiary transition-transform duration-150 ${open ? 'rotate-90' : ''}`}>
          ›
        </span>
        <h3 className="text-sm font-semibold text-ink">{KNOWLEDGE_CATEGORY_LABELS[categorie]}</h3>
        <span className="text-xs text-ink-tertiary">({entries.length})</span>
      </button>

      {open &&
        (entries.length === 0 ? (
          <p className="pl-5 text-sm text-ink-tertiary">Aucune fiche pour l'instant, crée la première.</p>
        ) : (
          <CardGrid entries={entries} onEntryClick={onEntryClick} />
        ))}
    </div>
  )
}

export default function KnowledgeList({ entries, categoryFilter, onEntryClick }) {
  if (categoryFilter) {
    if (entries.length === 0) {
      return <EmptyState label="Aucune fiche pour l'instant, crée la première." />
    }
    return <CardGrid entries={entries} onEntryClick={onEntryClick} />
  }

  if (entries.length === 0) {
    return <EmptyState label="Aucune fiche pour l'instant, crée la première." />
  }

  return (
    <div className="space-y-6">
      {KNOWLEDGE_CATEGORIES.map((categorie) => (
        <CategorySection
          key={categorie}
          categorie={categorie}
          entries={entries.filter((entry) => entry.categorie === categorie)}
          onEntryClick={onEntryClick}
        />
      ))}
    </div>
  )
}

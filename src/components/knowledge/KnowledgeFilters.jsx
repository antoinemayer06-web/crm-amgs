import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_CATEGORY_LABELS } from '../../lib/constants'

const TABS = [{ key: '', label: 'Toutes' }, ...KNOWLEDGE_CATEGORIES.map((c) => ({ key: c, label: KNOWLEDGE_CATEGORY_LABELS[c] }))]

export default function KnowledgeFilters({ search, onSearchChange, categorie, onCategorieChange }) {
  return (
    <div className="space-y-3">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher dans le titre ou le contenu…"
        className="w-full max-w-md input-chrome"
      />

      <div className="flex w-fit flex-wrap gap-1 rounded-lg border border-chrome-dark bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key || 'all'}
            type="button"
            onClick={() => onCategorieChange(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
              categorie === tab.key ? 'bg-surface-hover text-ink' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

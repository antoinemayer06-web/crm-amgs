import { useState } from 'react'
import MarkdownContent from './MarkdownContent'

const TABS = [
  { key: 'write', label: 'Écrire' },
  { key: 'preview', label: 'Aperçu' },
]

export default function MarkdownEditor({ value, onChange }) {
  const [mode, setMode] = useState('write')

  return (
    <div className="space-y-2">
      <div className="flex w-fit gap-1 rounded-md border border-chrome-dark bg-surface-hover p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMode(tab.key)}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors duration-150 ${
              mode === tab.key ? 'bg-surface text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'write' ? (
        <textarea
          rows={12}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Support markdown : **gras**, listes, # titres, [liens](url)…"
          className="w-full rounded-md border border-chrome-dark px-3 py-2 font-mono text-sm focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
        />
      ) : (
        <div className="min-h-[18rem] rounded-md border border-chrome-dark bg-surface-hover px-3 py-2">
          <MarkdownContent content={value} />
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function MarketingRecapCard({ count }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
          Marketing cette semaine
        </p>
        <p className="mt-1 text-2xl font-semibold text-ink">{count}</p>
        <p className="mt-1 text-xs text-ink-secondary">
          action{count > 1 ? 's' : ''} planifiée{count > 1 ? 's' : ''}
        </p>
      </div>
      <Link to="/marketing" className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300">
        Voir le calendrier →
      </Link>
    </div>
  )
}

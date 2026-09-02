import { Link } from 'react-router-dom'

export default function MarketingRecapCard({ count }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Marketing cette semaine
        </p>
        <p className="mt-1 text-2xl font-semibold text-neutral-900">{count}</p>
        <p className="mt-1 text-xs text-neutral-500">
          action{count > 1 ? 's' : ''} planifiée{count > 1 ? 's' : ''}
        </p>
      </div>
      <Link to="/marketing" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
        Voir le calendrier →
      </Link>
    </div>
  )
}

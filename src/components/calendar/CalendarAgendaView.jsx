import { isSameDay, toLocalDateKey } from '../../lib/calendarUtils'
import CalendarItemPill from './CalendarItemPill'

// Vue agenda partagée par la vue semaine (plusieurs colonnes) et la vue
// jour (une seule colonne) — une liste triée par heure pour chaque jour,
// plus simple qu'une grille horaire mais tout aussi lisible ici.
export default function CalendarAgendaView({ days, itemsByDay, onSelectItem, onCreateAtDate }) {
  const today = new Date()

  return (
    <div className={`grid gap-3 ${days.length > 1 ? 'sm:grid-cols-7' : ''}`}>
      {days.map((date) => {
        const key = toLocalDateKey(date)
        const items = (itemsByDay[key] ?? []).slice().sort((a, b) => new Date(a.date) - new Date(b.date))
        const isToday = isSameDay(date, today)

        return (
          <div key={key} className="rounded-lg border border-chrome-dark">
            <button
              type="button"
              onClick={() => onCreateAtDate(date)}
              className="flex w-full items-center justify-between border-b border-chrome-dark px-3 py-2 hover:bg-surface-hover"
            >
              <span className="text-sm font-medium text-ink-secondary">
                {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              {isToday && (
                <span className="rounded-full bg-chrome-light px-2 py-0.5 text-[10px] font-semibold text-[#141416]">
                  Aujourd'hui
                </span>
              )}
            </button>
            <div className="min-h-16 space-y-0.5 p-2">
              {items.length === 0 ? (
                <p className="px-1.5 py-1 text-xs text-ink-tertiary">Rien de prévu.</p>
              ) : (
                items.map((item) => (
                  <CalendarItemPill key={item.key} item={item} onClick={onSelectItem} showTime />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

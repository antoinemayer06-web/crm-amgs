import { useMemo } from 'react'
import CalendarMonthView from '../calendar/CalendarMonthView'
import { marketingActionToCalendarItem } from '../../hooks/useCalendarEvents'
import { toLocalDateKey } from '../../lib/calendarUtils'

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

// Vue "Calendrier" du module Marketing : même moteur d'affichage que le
// calendrier principal (/calendar) — CalendarMonthView, filtré pour ne
// montrer que les actions marketing — au lieu d'une grille recodée
// indépendamment ici. Seul l'en-tête (titre du mois + navigation) reste
// propre à cette vue.
export default function CalendarView({ currentMonth, actions, onPrevMonth, onNextMonth, onToday, onDayClick, onActionClick }) {
  const itemsByDay = useMemo(() => {
    const map = {}
    for (const action of actions) {
      if (!action.date_prevue) continue
      const item = marketingActionToCalendarItem(action)
      const key = toLocalDateKey(item.date)
      if (!map[key]) map[key] = []
      map[key].push(item)
    }
    return map
  }, [actions])

  return (
    <div className="overflow-hidden rounded-xl border border-chrome-dark bg-surface">
      <div className="flex items-center justify-between border-b border-chrome-dark px-4 py-3">
        <h3 className="text-sm font-semibold capitalize text-ink">
          {monthFormatter.format(currentMonth)}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToday}
            className="rounded-md border border-chrome-dark px-3 py-1.5 text-xs font-medium text-ink-secondary hover:bg-surface-hover"
          >
            Aujourd'hui
          </button>
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Mois précédent"
            className="rounded-md px-2 py-1.5 text-ink-secondary hover:bg-surface-hover hover:text-ink"
          >
            ←
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Mois suivant"
            className="rounded-md px-2 py-1.5 text-ink-secondary hover:bg-surface-hover hover:text-ink"
          >
            →
          </button>
        </div>
      </div>

      <CalendarMonthView
        year={currentMonth.getFullYear()}
        month={currentMonth.getMonth()}
        itemsByDay={itemsByDay}
        onSelectItem={(item) => onActionClick(item.raw)}
        onCreateAtDate={(date) => onDayClick(toLocalDateKey(date))}
      />
    </div>
  )
}

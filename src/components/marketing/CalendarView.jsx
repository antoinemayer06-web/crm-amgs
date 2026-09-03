import { useMemo } from 'react'
import { MARKETING_ACTION_TYPE_TONES, formatEnumLabel } from '../../lib/constants'
import { tones } from '../ui/Badge'

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function buildGrid(currentMonth) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  // 0 = dimanche -> on décale pour un affichage lundi -> dimanche.
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)

  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    days.push(date)
  }
  return days
}

function toKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

export default function CalendarView({ currentMonth, actions, onPrevMonth, onNextMonth, onToday, onDayClick, onActionClick }) {
  const days = useMemo(() => buildGrid(currentMonth), [currentMonth])

  const actionsByDay = useMemo(() => {
    const map = new Map()
    for (const action of actions) {
      if (!action.date_prevue) continue
      const key = action.date_prevue
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(action)
    }
    return map
  }, [actions])

  const today = toKey(new Date())
  const currentMonthIndex = currentMonth.getMonth()

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

      <div className="grid grid-cols-7 border-b border-chrome-dark bg-surface-hover">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-ink-secondary">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date) => {
          const key = toKey(date)
          const dayActions = actionsByDay.get(key) ?? []
          const isCurrentMonth = date.getMonth() === currentMonthIndex
          const isToday = key === today

          return (
            <button
              key={key}
              type="button"
              onClick={() => onDayClick(key)}
              className={`flex min-h-24 flex-col items-stretch gap-1 border-b border-r border-chrome-dark p-1.5 text-left transition-colors duration-150 last:border-r-0 hover:bg-surface-hover ${
                isCurrentMonth ? 'bg-surface' : 'bg-surface-hover/50'
              }`}
            >
              <span
                className={`self-start rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  isToday
                    ? 'bg-chrome-light text-[#141416]'
                    : isCurrentMonth
                      ? 'text-ink-secondary'
                      : 'text-ink-tertiary'
                }`}
              >
                {date.getDate()}
              </span>

              <div className="flex flex-col gap-1">
                {dayActions.map((action) => {
                  const tone = MARKETING_ACTION_TYPE_TONES[action.type]
                  const cancelled = action.statut === 'annulé'
                  return (
                    <span
                      key={action.id}
                      onClick={(event) => {
                        event.stopPropagation()
                        onActionClick(action)
                      }}
                      className={`truncate rounded px-1.5 py-0.5 font-medium transition-opacity duration-150 hover:opacity-80 ${
                        tones[tone] ?? tones.neutral
                      } ${cancelled ? 'opacity-40 line-through' : ''}`}
                      title={`${action.titre} — ${formatEnumLabel(action.type)}`}
                    >
                      {action.titre}
                    </span>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

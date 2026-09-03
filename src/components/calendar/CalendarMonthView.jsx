import { useState } from 'react'
import { getMonthGridDays, isSameDay, toLocalDateKey, WEEKDAY_LABELS } from '../../lib/calendarUtils'
import CalendarItemPill from './CalendarItemPill'

const MAX_VISIBLE_PER_DAY = 3

export default function CalendarMonthView({ year, month, itemsByDay, onSelectItem, onCreateAtDate }) {
  const [expandedDay, setExpandedDay] = useState(null)
  const days = getMonthGridDays(year, month)
  const today = new Date()

  return (
    <div className="overflow-hidden rounded-lg border border-chrome-dark">
      <div className="grid grid-cols-7 border-b border-chrome-dark bg-surface-hover">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-2 text-center text-xs font-medium text-ink-tertiary">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const key = toLocalDateKey(date)
          const items = itemsByDay[key] ?? []
          const isCurrentMonth = date.getMonth() === month
          const isToday = isSameDay(date, today)
          const isExpanded = expandedDay === key
          const visibleItems = isExpanded ? items : items.slice(0, MAX_VISIBLE_PER_DAY)
          const hiddenCount = items.length - visibleItems.length

          return (
            <div
              key={key}
              onClick={() => onCreateAtDate(date)}
              className={`min-h-24 cursor-pointer border-b border-r border-chrome-dark p-1.5 last:border-r-0 sm:min-h-28 ${
                isCurrentMonth ? '' : 'bg-black/20'
              } hover:bg-surface-hover`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  isToday
                    ? 'bg-chrome-light font-semibold text-[#141416]'
                    : isCurrentMonth
                      ? 'text-ink-secondary'
                      : 'text-ink-tertiary'
                }`}
              >
                {date.getDate()}
              </span>
              <div className="mt-1 space-y-0.5">
                {visibleItems.map((item) => (
                  <CalendarItemPill key={item.key} item={item} onClick={onSelectItem} />
                ))}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setExpandedDay(key)
                    }}
                    className="px-1.5 text-xs text-ink-tertiary hover:text-ink-secondary"
                  >
                    +{hiddenCount} de plus
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

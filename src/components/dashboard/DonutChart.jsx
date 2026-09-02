import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const CHROME_SHADES = ['#d8dbde', '#a9adb3', '#8e9196', '#6a6d72', '#4a4c50', '#3a3c40']

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

export default function DonutChart({ data }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  if (total === 0) {
    return <p className="py-8 text-center text-sm text-ink-tertiary">Pas encore de données.</p>
  }

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={78}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={CHROME_SHADES[index % CHROME_SHADES.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatMontant(value)}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #3a3c40',
              background: '#141416',
              color: '#f2f2f3',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CHROME_SHADES[index % CHROME_SHADES.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-ink-secondary">{entry.name}</span>
            <span className="shrink-0 font-medium tabular-nums text-ink">{formatMontant(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

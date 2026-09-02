import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLOR_PREVU = '#8e9196'
const COLOR_REEL = '#d8dbde'
const COLOR_REEL_OVER = '#f2f2f3'

const SERIES_LABELS = { prevu: 'Prévu', reel: 'Réel' }

export default function HoursComparisonChart({ data }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-tertiary">
        Pas encore d'heures prévues ou saisies sur les projets actifs.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a3c40" vertical={false} />
        <XAxis
          dataKey="nom"
          tick={{ fontSize: 11, fill: '#8a8d91' }}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 11, fill: '#8a8d91' }} allowDecimals={false} unit="h" width={40} />
        <Tooltip
          formatter={(value, name) => [`${value} h`, SERIES_LABELS[name] ?? name]}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #3a3c40',
            background: '#141416',
            color: '#f2f2f3',
            fontSize: 12,
          }}
          labelStyle={{ color: '#f2f2f3' }}
          itemStyle={{ color: '#f2f2f3' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#8a8d91' }}
          formatter={(value) => SERIES_LABELS[value] ?? value}
        />
        <Bar dataKey="prevu" name="prevu" fill={COLOR_PREVU} radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="reel" name="reel" fill={COLOR_REEL} radius={[4, 4, 0, 0]} maxBarSize={32}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.reel > entry.prevu ? COLOR_REEL_OVER : COLOR_REEL} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

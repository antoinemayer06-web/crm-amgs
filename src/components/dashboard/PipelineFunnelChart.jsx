import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLOR = '#2a78d6'

export default function PipelineFunnelChart({ data }) {
  const total = data.reduce((sum, row) => sum + row.count, 0)

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-tertiary">
        Aucun prospect dans le pipeline pour l'instant.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a3c40" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#8a8d91' }} />
        <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 11, fill: '#d8dbde' }} />
        <Tooltip
          formatter={(value) => [`${value} prospect${value > 1 ? 's' : ''}`, '']}
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
        <Bar dataKey="count" fill={COLOR} radius={[0, 4, 4, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}

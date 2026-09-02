import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLOR = '#2a78d6'

export default function PipelineFunnelChart({ data }) {
  const total = data.reduce((sum, row) => sum + row.count, 0)

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-400">
        Aucun prospect dans le pipeline pour l'instant.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#898781' }} />
        <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 11, fill: '#52514e' }} />
        <Tooltip
          formatter={(value) => [`${value} prospect${value > 1 ? 's' : ''}`, '']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e1e0d9', fontSize: 12 }}
        />
        <Bar dataKey="count" fill={COLOR} radius={[0, 4, 4, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}

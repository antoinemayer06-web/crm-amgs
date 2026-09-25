import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useIsMobile } from '../../hooks/useIsMobile'

const COLOR_VISITES = '#2a78d6'

export default function SiteVisitsChart({ data }) {
  const isMobile = useIsMobile()

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 220 : 240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a3c40" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#8a8d91' }}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis tick={{ fontSize: 11, fill: '#8a8d91' }} width={32} allowDecimals={false} />
        <Tooltip
          formatter={(value) => [value, 'Visites']}
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
        <Line
          type="monotone"
          dataKey="visites"
          stroke={COLOR_VISITES}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

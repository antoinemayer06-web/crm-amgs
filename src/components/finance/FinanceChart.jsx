import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useIsMobile } from '../../hooks/useIsMobile'

const COLOR_FACTURE = '#2a78d6'
const COLOR_ENCAISSE = '#0f9d58'
const COLOR_DEPENSES = '#eb6834'
const COLOR_POSITIF = '#0f9d58'
const COLOR_NEGATIF = '#d03b3b'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

export default function FinanceChart({ caThisMonth, encaisseThisMonth, expensesThisMonth, resultatPrevu, resultatRealise }) {
  const isMobile = useIsMobile()
  const data = [
    { key: 'facture', label: 'Facturé', value: caThisMonth, fill: COLOR_FACTURE },
    { key: 'encaisse', label: 'Encaissé', value: encaisseThisMonth, fill: COLOR_ENCAISSE },
    { key: 'depenses', label: 'Dépenses', value: expensesThisMonth, fill: COLOR_DEPENSES },
    { key: 'prevu', label: 'Prévu', value: resultatPrevu, fill: resultatPrevu >= 0 ? COLOR_POSITIF : COLOR_NEGATIF },
    { key: 'realise', label: 'Réalisé', value: resultatRealise, fill: resultatRealise >= 0 ? COLOR_POSITIF : COLOR_NEGATIF },
  ]

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 260 : 240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: isMobile ? 28 : 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a3c40" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#8a8d91' }}
          interval={0}
          angle={isMobile ? -35 : 0}
          textAnchor={isMobile ? 'end' : 'middle'}
          height={isMobile ? 40 : 30}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8a8d91' }}
          width={isMobile ? 44 : 56}
          tickFormatter={(v) => (isMobile ? `${v / 1000}k` : `${v} €`)}
        />
        <Tooltip
          formatter={(value) => [formatMontant(value), '']}
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
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

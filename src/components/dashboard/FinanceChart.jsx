import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLOR_FACTURE = '#2a78d6'
const COLOR_ENCAISSE = '#0f9d58'
const COLOR_DEPENSES = '#eb6834'
const COLOR_POSITIF = '#0f9d58'
const COLOR_NEGATIF = '#d03b3b'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

export default function FinanceChart({ caThisMonth, encaisseThisMonth, expensesThisMonth, resultatPrevu, resultatRealise }) {
  const data = [
    { key: 'facture', label: 'CA facturé', value: caThisMonth, fill: COLOR_FACTURE },
    { key: 'encaisse', label: 'Encaissé', value: encaisseThisMonth, fill: COLOR_ENCAISSE },
    { key: 'depenses', label: 'Dépenses', value: expensesThisMonth, fill: COLOR_DEPENSES },
    { key: 'prevu', label: 'Résultat prévu', value: resultatPrevu, fill: resultatPrevu >= 0 ? COLOR_POSITIF : COLOR_NEGATIF },
    { key: 'realise', label: 'Résultat réalisé', value: resultatRealise, fill: resultatRealise >= 0 ? COLOR_POSITIF : COLOR_NEGATIF },
  ]

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#898781' }} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: '#898781' }} width={56} tickFormatter={(v) => `${v} €`} />
        <Tooltip
          formatter={(value) => [formatMontant(value), '']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e1e0d9', fontSize: 12 }}
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

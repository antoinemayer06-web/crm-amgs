// Badges colorés (bleu/vert/ambre/rouge), adaptés au fond sombre : fond
// teinté translucide + texte de la même teinte en clair, plutôt que les
// à-plats clairs d'origine (pensés pour un fond blanc).
export const tones = {
  neutral: 'bg-chrome-dark/50 text-ink-secondary',
  blue: 'bg-blue-500/15 text-blue-300',
  green: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  red: 'bg-red-500/15 text-red-300',
}

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone] ?? tones.neutral}`}
    >
      {children}
    </span>
  )
}

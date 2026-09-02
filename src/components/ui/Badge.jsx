// Palette monochrome : les tons historiques (neutral/blue/green/amber/red)
// sont conservés comme clés d'API (tous les call sites existants les
// utilisent déjà pour distinguer les statuts), mais chacun ne rend plus
// qu'une intensité de chrome différente — jamais de teinte. Les tons
// "critiques" utilisent un léger effet de pulsation plutôt qu'une couleur
// vive pour signaler l'urgence.
export const tones = {
  neutral: 'bg-chrome-dark/40 text-ink-tertiary',
  blue: 'bg-chrome-mid/25 text-chrome-light',
  green: 'bg-chrome-light/20 text-ink border border-chrome-light/30',
  amber: 'bg-chrome-mid/30 text-ink pulse-chrome',
  red: 'bg-chrome-light/25 text-ink border border-chrome-light/40 pulse-chrome',
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

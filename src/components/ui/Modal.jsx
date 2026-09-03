import { IconClose } from './icons'

const sizes = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
}

export default function Modal({ title, onClose, children, size = 'md' }) {
  return (
    // items-start + overlay scrollable sur mobile : quand le clavier
    // virtuel s'ouvre (ex. en tapant dans un champ du formulaire), un
    // centrage vertical strict (items-center) fait paraître le modal
    // "descendu" en bas d'un viewport réduit par le clavier — ancré en
    // haut, il reste visible et l'overlay prend le relais du scroll si
    // le contenu + le clavier ne tiennent plus dans l'espace visible.
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        className={`glass-panel my-auto max-h-[85vh] w-full overflow-y-auto rounded-lg shadow-xl ${sizes[size] ?? sizes.md}`}
      >
        <div className="flex items-center justify-between border-b border-chrome-dark px-5 py-4">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-ink-tertiary hover:text-ink-secondary max-md:h-12 max-md:w-12"
            aria-label="Fermer"
          >
            <IconClose className="h-4 w-4 max-md:h-5 max-md:w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { IconClose } from './icons'

export default function SidePanel({ title, onClose, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 150)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`glass-panel relative flex h-full w-full flex-col shadow-2xl transition-transform duration-200 ease-out sm:max-w-md ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* padding-top en env(safe-area-inset-top) : ce panneau passe en
            plein écran sur mobile (w-full h-full sous sm:), donc son en-tête
            se retrouve sinon exactement sous la barre de statut iOS/horloge,
            avec la croix de fermeture cachée dessous et non cliquable. */}
        <div
          className="flex items-center justify-between border-b border-chrome-dark px-5 py-4"
          style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
        >
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-ink-tertiary hover:text-ink-secondary max-md:h-12 max-md:w-12"
            aria-label="Fermer"
          >
            <IconClose className="h-4 w-4 max-md:h-5 max-md:w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

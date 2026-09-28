import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAiChat } from '../../lib/AiChatContext'
import { IconClose } from '../ui/icons'
import AiActionsHistory from './AiActionsHistory'
import ChatThread from './ChatThread'

export default function AiChatPanel() {
  const { isOpen, closeChat, entityContext } = useAiChat()
  const [showHistory, setShowHistory] = useState(false)

  if (!isOpen) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex justify-end">
      <div className="glass-panel pointer-events-auto flex h-full w-full max-w-sm flex-col shadow-2xl">
        {/* padding-top en env(safe-area-inset-top) : ce panneau est plein
            écran sur mobile, donc son en-tête se retrouve sinon exactement
            sous la barre de statut iOS/horloge, avec la croix de fermeture
            cachée dessous et non cliquable. */}
        <div
          className="flex items-center justify-between border-b border-chrome-dark px-4 py-3"
          style={{ paddingTop: 'max(0.75rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
        >
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ink">Assistant IA</h2>
            {entityContext?.label && (
              <p className="truncate text-xs text-ink-secondary">Contexte : {entityContext.label}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link to="/assistant" className="text-xs font-medium text-ink-secondary hover:text-ink">
              Plein écran
            </Link>
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="text-xs font-medium text-ink-secondary hover:text-ink"
            >
              {showHistory ? 'Chat' : 'Historique'}
            </button>
            <button
              type="button"
              onClick={closeChat}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-ink-tertiary hover:text-ink-secondary max-md:h-12 max-md:w-12"
              aria-label="Fermer"
            >
              <IconClose className="h-4 w-4 max-md:h-5 max-md:w-5" />
            </button>
          </div>
        </div>

        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4">
            <AiActionsHistory />
          </div>
        ) : (
          <ChatThread />
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAiChat } from '../../lib/AiChatContext'
import AiActionsHistory from './AiActionsHistory'
import ChatThread from './ChatThread'

export default function AiChatPanel() {
  const { isOpen, closeChat, entityContext } = useAiChat()
  const [showHistory, setShowHistory] = useState(false)

  if (!isOpen) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex justify-end">
      <div className="glass-panel pointer-events-auto flex h-full w-full max-w-sm flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-chrome-dark px-4 py-3">
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
              className="text-ink-tertiary hover:text-ink-secondary"
              aria-label="Fermer"
            >
              ✕
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

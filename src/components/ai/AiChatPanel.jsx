import { useEffect, useRef, useState } from 'react'
import { useAiChat } from '../../lib/AiChatContext'
import MarkdownContent from '../knowledge/MarkdownContent'
import ActionCard from './ActionCard'
import AiActionsHistory from './AiActionsHistory'

export default function AiChatPanel() {
  const {
    isOpen,
    closeChat,
    entityContext,
    displayMessages,
    pendingActions,
    isLoading,
    error,
    sendMessage,
    resolveActions,
  } = useAiChat()
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [displayMessages, pendingActions])

  if (!isOpen) return null

  async function handleSubmit(event) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex justify-end">
      <div className="pointer-events-auto flex h-full w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-neutral-900">Assistant IA</h2>
            {entityContext?.label && (
              <p className="truncate text-xs text-neutral-500">Contexte : {entityContext.label}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
            >
              {showHistory ? 'Chat' : 'Historique'}
            </button>
            <button
              type="button"
              onClick={closeChat}
              className="text-neutral-400 hover:text-neutral-600"
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
          <>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {displayMessages.length === 0 && (
                <p className="text-sm text-neutral-400">
                  Pose une question sur tes prospects, projets ou campagnes, ou demande-moi de préparer
                  une action (création d'entreprise, note, tâche…).
                </p>
              )}
              {displayMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'user' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {msg.role === 'assistant' ? <MarkdownContent content={msg.text} /> : msg.text}
                  </div>
                </div>
              ))}
              {pendingActions.length > 0 && (
                <ActionCard actions={pendingActions} onResolve={resolveActions} submitting={isLoading} />
              )}
              {isLoading && <p className="text-xs text-neutral-400">L'assistant réfléchit…</p>}
              {error && <p className="text-xs text-red-600">Erreur : {error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-neutral-200 p-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Écris un message…"
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

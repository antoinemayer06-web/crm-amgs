import { useEffect, useId, useRef, useState } from 'react'
import { useAiChat } from '../../lib/AiChatContext'
import MarkdownContent from '../knowledge/MarkdownContent'
import ActionCard from './ActionCard'

export default function ChatThread({ emptyStateClassName = 'text-sm text-ink-tertiary' }) {
  const { displayMessages, pendingActions, isLoading, error, sendMessage, resolveActions } = useAiChat()
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const scrollRef = useRef(null)
  const fileInputRef = useRef(null)
  const fileInputId = useId()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [displayMessages, pendingActions])

  async function handleSubmit(event) {
    event.preventDefault()
    const text = input.trim()
    if ((!text && !file) || isLoading) return
    setInput('')
    const attachedFile = file
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    await sendMessage(text || `Voici un fichier : ${attachedFile?.name}`, attachedFile)
  }

  function handleFileChange(event) {
    setFile(event.target.files?.[0] ?? null)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {displayMessages.length === 0 && (
          <p className={emptyStateClassName}>
            Pose une question sur tes prospects, projets ou campagnes, ou demande-moi de préparer une
            action (création d'entreprise, note, tâche…).
          </p>
        )}
        {displayMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user' ? 'bg-chrome-dark text-ink' : 'bg-surface-hover text-ink-secondary'
              }`}
            >
              {msg.attachmentName && (
                <p className={`mb-1 text-xs ${msg.role === 'user' ? 'text-ink-tertiary' : 'text-ink-secondary'}`}>
                  📎 {msg.attachmentName}
                </p>
              )}
              {msg.role === 'assistant' ? <MarkdownContent content={msg.text} /> : msg.text}
            </div>
          </div>
        ))}
        {pendingActions.length > 0 && (
          <ActionCard actions={pendingActions} onResolve={resolveActions} submitting={isLoading} />
        )}
        {isLoading && <p className="text-xs text-ink-tertiary">L'assistant réfléchit…</p>}
        {error && <p className="text-xs text-red-600">Erreur : {error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 border-t border-chrome-dark p-3">
        {file && (
          <div className="flex items-center justify-between rounded-md bg-surface-hover px-2.5 py-1.5 text-xs text-ink-secondary">
            <span className="truncate">📎 {file.name}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="shrink-0 text-ink-tertiary hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id={fileInputId}
          />
          <label
            htmlFor={fileInputId}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-chrome-dark px-2.5 py-2 text-sm text-ink-secondary hover:bg-surface-hover"
            title="Joindre un fichier (image ou PDF)"
          >
            📎
          </label>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Écris un message…"
            className="flex-1 input-chrome"
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !file)}
            className="btn-primary"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  )
}

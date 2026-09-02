import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'

const AiChatContext = createContext(undefined)

async function callAssistant(payload) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Erreur ${response.status}`)
  }
  return response.json()
}

function extractAssistantText(message) {
  if (!message || !Array.isArray(message.content)) return ''
  return message.content
    .filter((block) => block.type === 'text' && block.text?.trim())
    .map((block) => block.text)
    .join('\n\n')
}

export function AiChatProvider({ children }) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [entityContext, setEntityContext] = useState(null)
  const [history, setHistory] = useState([])
  const [displayMessages, setDisplayMessages] = useState([])
  const [pendingActions, setPendingActions] = useState([])
  const [pendingReadResults, setPendingReadResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const applyResult = useCallback(
    (data) => {
      setHistory(data.history ?? [])
      setPendingActions(data.pendingActions ?? [])
      setPendingReadResults(data.pendingReadResults ?? [])

      const lastAssistant = [...(data.history ?? [])].reverse().find((m) => m.role === 'assistant')
      const text = extractAssistantText(lastAssistant)
      if (text) {
        setDisplayMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text }])
      }
      if ((data.pendingActions ?? []).length > 0) {
        queryClient.invalidateQueries({ queryKey: ['ai_actions_log'] })
      }
    },
    [queryClient],
  )

  const sendMessage = useCallback(
    async (text) => {
      setIsLoading(true)
      setError(null)
      setDisplayMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }])
      try {
        const data = await callAssistant({ mode: 'chat', message: text, history, context: entityContext })
        applyResult(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [history, entityContext, applyResult],
  )

  const resolveActions = useCallback(
    async (decisions) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await callAssistant({
          mode: 'resolve',
          history,
          decisions,
          pendingReadResults,
          context: entityContext,
        })
        applyResult(data)
        queryClient.invalidateQueries({ queryKey: ['ai_actions_log'] })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [history, pendingReadResults, entityContext, applyResult, queryClient],
  )

  const value = useMemo(
    () => ({
      isOpen,
      toggleOpen: () => setIsOpen((prev) => !prev),
      openChat: () => setIsOpen(true),
      closeChat: () => setIsOpen(false),
      entityContext,
      setEntityContext,
      displayMessages,
      pendingActions,
      isLoading,
      error,
      sendMessage,
      resolveActions,
    }),
    [isOpen, entityContext, displayMessages, pendingActions, isLoading, error, sendMessage, resolveActions],
  )

  return <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>
}

export function useAiChat() {
  const context = useContext(AiChatContext)
  if (context === undefined) {
    throw new Error('useAiChat doit être utilisé à l’intérieur de AiChatProvider')
  }
  return context
}

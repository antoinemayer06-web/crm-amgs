import AiActionsHistory from '../components/ai/AiActionsHistory'
import ChatThread from '../components/ai/ChatThread'
import { useAiChat } from '../lib/AiChatContext'

export default function AiAssistantPage() {
  const { entityContext } = useAiChat()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Assistant IA</h2>
        {entityContext?.label && (
          <p className="text-sm text-neutral-500">Contexte actif : {entityContext.label}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-[75vh] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm lg:col-span-2">
          <ChatThread emptyStateClassName="text-sm text-neutral-400 max-w-md" />
        </div>

        <div className="h-[75vh] overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Historique des actions</h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <AiActionsHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

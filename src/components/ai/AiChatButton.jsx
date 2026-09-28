import { useAiChat } from '../../lib/AiChatContext'
import { IconClaude } from '../ui/icons'

export default function AiChatButton() {
  const { isOpen, toggleOpen, pendingActions } = useAiChat()

  if (isOpen) return null

  return (
    <button
      type="button"
      onClick={toggleOpen}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-canvas shadow-lg shadow-black/40 ring-1 ring-chrome-dark transition-transform duration-150 hover:scale-105"
      aria-label="Ouvrir l'assistant IA"
    >
      <span className="relative flex items-center justify-center">
        <IconClaude className="h-7 w-7" />
        {pendingActions.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {pendingActions.length}
          </span>
        )}
      </span>
    </button>
  )
}

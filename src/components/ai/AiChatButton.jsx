import { useAiChat } from '../../lib/AiChatContext'

export default function AiChatButton() {
  const { isOpen, toggleOpen, pendingActions } = useAiChat()

  if (isOpen) return null

  return (
    <button
      type="button"
      onClick={toggleOpen}
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white shadow-lg transition-transform duration-150 hover:scale-105"
      aria-label="Ouvrir l'assistant IA"
    >
      <span className="relative">
        💬
        {pendingActions.length > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {pendingActions.length}
          </span>
        )}
      </span>
    </button>
  )
}

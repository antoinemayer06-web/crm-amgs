import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const THRESHOLD = 64

// Pull-to-refresh tactile, léger : actif uniquement quand la zone
// scrollable ancestrale (le <main> de Layout) est déjà tout en haut,
// pour ne jamais interférer avec un scroll normal en cours.
export default function PullToRefresh({ children }) {
  const queryClient = useQueryClient()
  const containerRef = useRef(null)
  const startYRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  function handleTouchStart(event) {
    if (refreshing) return
    const scrollParent = containerRef.current?.closest('main')
    if (!scrollParent || scrollParent.scrollTop > 0) {
      startYRef.current = null
      return
    }
    startYRef.current = event.touches[0].clientY
  }

  function handleTouchMove(event) {
    if (startYRef.current == null || refreshing) return
    const delta = event.touches[0].clientY - startYRef.current
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, 90))
    }
  }

  async function handleTouchEnd() {
    if (startYRef.current == null) return
    startYRef.current = null
    if (pullDistance > THRESHOLD) {
      setRefreshing(true)
      setPullDistance(56)
      await queryClient.invalidateQueries()
      setRefreshing(false)
    }
    setPullDistance(0)
  }

  return (
    <div ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div
        className="flex items-center justify-center overflow-hidden text-xs text-ink-tertiary transition-[height] duration-150 md:hidden"
        style={{ height: pullDistance }}
      >
        {pullDistance > 0 &&
          (refreshing ? 'Actualisation…' : pullDistance > THRESHOLD ? 'Relâchez pour actualiser' : 'Tirez pour actualiser')}
      </div>
      {children}
    </div>
  )
}

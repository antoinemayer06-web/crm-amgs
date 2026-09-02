import { useEffect, useState } from 'react'

const QUERY = '(max-width: 767px)'

// Même seuil que le breakpoint `md` de Tailwind — utilisé pour les
// décisions de layout qui ne peuvent pas se faire en CSS pur (ex :
// changer la vue par défaut d'une page selon la taille d'écran).
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handleChange = (event) => setIsMobile(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}

import { useEffect, useState } from 'react'

const KEY = 'list-density'

// Préférence partagée entre toutes les vues liste (Entreprises, Pipeline,
// Projets) — un seul réglage, mémorisé localement.
export function useDensity() {
  const [density, setDensity] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'compact' ? 'compact' : 'comfortable'
    } catch {
      return 'comfortable'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, density)
    } catch {
      // stockage indisponible : pas bloquant
    }
  }, [density])

  return [density, setDensity]
}

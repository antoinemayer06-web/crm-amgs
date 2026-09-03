// Bloc de base : dimensionner via className (h-4 w-32, etc.).
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

// Grille de tuiles KPI (Dashboard, Finance…).
export function SkeletonStatGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-glass space-y-3 rounded-xl p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      ))}
    </div>
  )
}

// Lignes de liste/tableau génériques (Companies, Projects, Documents…).
export function SkeletonRows({ count = 5 }) {
  return (
    <div className="divide-y divide-chrome-dark">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="ml-auto h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

// Grand bloc rectangulaire (zone de graphique, calendrier, panneau).
export function SkeletonBlock({ className = 'h-64 w-full' }) {
  return <Skeleton className={className} />
}

// Marque "AM" : triangle façon sommet/montagne en dégradé violet chromé,
// chevrons clairs à la base (le "M"), diamant facetté au centre (accent
// métal liquide). Recréée en SVG pour rester nette à toute taille et ne
// dépendre d'aucun fichier image externe.
export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="AM Growth Solutions"
    >
      <defs>
        <linearGradient id="logo-triangle" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#8b6bf0" />
          <stop offset="45%" stopColor="#6d3fd6" />
          <stop offset="100%" stopColor="#3f1f8f" />
        </linearGradient>
        <linearGradient id="logo-chevrons" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f2effc" />
          <stop offset="100%" stopColor="#c9c0e8" />
        </linearGradient>
        <radialGradient id="logo-sheen" cx="30%" cy="15%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d="M50 4 L96 94 L4 94 Z" fill="url(#logo-triangle)" />
      <path d="M50 4 L96 94 L4 94 Z" fill="url(#logo-sheen)" />

      <path
        d="M17 94 L34 58 L50 80 L66 58 L83 94 Z"
        fill="url(#logo-chevrons)"
      />

      <g>
        <path d="M50 28 L37 45 L50 45 Z" fill="#8f86b8" />
        <path d="M50 28 L63 45 L50 45 Z" fill="#ffffff" />
        <path d="M37 45 L50 62 L50 45 Z" fill="#ffffff" />
        <path d="M63 45 L50 62 L50 45 Z" fill="#8f86b8" />
      </g>
    </svg>
  )
}

// Convertit un hex (#rrggbb) en rgba(...) — utilisé pour teinter les
// bulles verre du mur Vision à partir de la couleur de note choisie.
export function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

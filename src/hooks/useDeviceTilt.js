import { useEffect } from 'react'

// Pilote --tilt-x/--tilt-y sur :root depuis l'orientation du téléphone,
// consommées par le reflet des surfaces "verre liquide" en CSS.
const STORAGE_KEY = 'tilt-permission-granted'
let listening = false

function markGranted() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // stockage indisponible : pas bloquant
  }
}

function applyTilt(beta, gamma) {
  const x = 50 + Math.max(-1, Math.min(1, gamma / 45)) * 38
  const y = 50 + Math.max(-1, Math.min(1, (beta - 40) / 60)) * 38
  document.documentElement.style.setProperty('--tilt-x', `${x}%`)
  document.documentElement.style.setProperty('--tilt-y', `${y}%`)
}

function handleOrientation(event) {
  if (event.beta === null || event.gamma === null) return
  applyTilt(event.beta, event.gamma)
}

function startListening() {
  if (listening) return
  listening = true
  window.addEventListener('deviceorientation', handleOrientation)
}

export function needsTiltPermission() {
  return typeof window !== 'undefined' && typeof window.DeviceOrientationEvent?.requestPermission === 'function'
}

export function wasTiltGrantedBefore() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

// Doit être appelée depuis le onClick direct d'un bouton : sur iOS,
// Safari ignore silencieusement la demande de permission sinon.
export async function requestTiltPermission() {
  if (!needsTiltPermission()) {
    startListening()
    markGranted()
    return 'granted'
  }
  try {
    const state = await window.DeviceOrientationEvent.requestPermission()
    if (state === 'granted') {
      startListening()
      markGranted()
    }
    return state
  } catch {
    return 'denied'
  }
}

// Toujours démarrer l'écoute au chargement : si iOS a déjà accordé la
// permission lors d'une session précédente sur cette origine, les
// événements arrivent directement sans repasser par
// requestTiltPermission() — inutile de forcer une nouvelle activation
// à chaque ouverture de l'app.
export function useDeviceTilt() {
  useEffect(() => {
    startListening()
  }, [])
}

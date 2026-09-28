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

// Sur les PWA installées iOS, chaque lancement depuis l'écran d'accueil
// démarre un contexte neuf : l'autorisation gyroscope accordée la fois
// précédente n'est pas retenue, il faut la redemander à chaque fois — et
// seul un vrai geste utilisateur peut déclencher la popup système.
//
// Plutôt que d'attendre un bouton précis (qu'on doit aller chercher
// dans Paramètres), on retente sur CHAQUE tap dans l'app tant que
// l'autorisation n'est pas encore accordée. Sans `once` : si une
// première tentative échoue silencieusement (WebKit peut être capricieux
// sur ce point), les taps suivants réessaient — jamais bloquant pour
// l'action que l'utilisateur voulait faire.
export function useDeviceTilt() {
  useEffect(() => {
    if (!needsTiltPermission()) {
      startListening()
      return
    }
    if (listening) return

    function handleFirstInteraction() {
      if (listening) {
        document.removeEventListener('pointerdown', handleFirstInteraction, true)
        return
      }
      requestTiltPermission()
    }

    document.addEventListener('pointerdown', handleFirstInteraction, true)
    return () => document.removeEventListener('pointerdown', handleFirstInteraction, true)
  }, [])
}

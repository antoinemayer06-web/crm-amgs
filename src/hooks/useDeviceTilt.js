import { useEffect } from 'react'

// Anime le reflet des boutons "verre liquide" (.btn-primary) selon
// l'inclinaison réelle du téléphone : pilote --tilt-x/--tilt-y sur
// :root, consommées par le radial-gradient du reflet en CSS.
//
// Sur iOS 13+, l'accès au gyroscope exige une permission explicite qui
// ne peut être accordée que suite à un vrai clic sur un élément —
// jamais automatiquement, même au premier tap dans l'app : c'est une
// restriction plateforme (WebKit), pas quelque chose de contournable
// côté code. requestTiltPermission() est donc exposée pour être
// appelée directement depuis le onClick d'un vrai bouton visible (voir
// le bouton dans Paramètres) plutôt que devinée en arrière-plan.
let listening = false

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

export function isTiltListening() {
  return listening
}

// À appeler directement depuis le onClick d'un vrai bouton — jamais
// depuis un effet ou un listener délégué, sous peine que Safari
// ignore silencieusement la demande sans jamais afficher la popup.
export async function requestTiltPermission() {
  if (!needsTiltPermission()) {
    startListening()
    return 'granted'
  }
  try {
    const state = await window.DeviceOrientationEvent.requestPermission()
    if (state === 'granted') startListening()
    return state
  } catch {
    return 'denied'
  }
}

// Démarre directement l'écoute quand la plateforme n'exige aucune
// permission (Android, desktop avec capteurs) — sur iOS, ne fait rien :
// seul requestTiltPermission() (bouton Paramètres) peut l'activer.
export function useDeviceTilt() {
  useEffect(() => {
    if (needsTiltPermission()) return
    startListening()
  }, [])
}

import { useEffect } from 'react'

// Pilote --tilt-x/--tilt-y sur :root depuis l'orientation du téléphone,
// consommées par le reflet des surfaces "verre liquide" en CSS.
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

// Doit être appelée depuis le onClick direct d'un bouton : sur iOS,
// Safari ignore silencieusement la demande de permission sinon.
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

// Démarre l'écoute directement si la plateforme n'exige pas de
// permission ; sur iOS, seul requestTiltPermission() peut l'activer.
export function useDeviceTilt() {
  useEffect(() => {
    if (needsTiltPermission()) return
    startListening()
  }, [])
}

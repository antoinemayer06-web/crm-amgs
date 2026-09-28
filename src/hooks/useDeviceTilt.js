import { useEffect } from 'react'

// Anime le reflet des boutons "verre liquide" (.btn-primary) selon
// l'inclinaison réelle du téléphone : pilote --tilt-x/--tilt-y sur
// :root, consommées par le radial-gradient du reflet en CSS. Sur iOS
// 13+, l'accès au gyroscope exige une permission explicite qui ne peut
// être demandée que suite à un vrai geste utilisateur — on la déclenche
// donc au premier tap dans l'app plutôt qu'au montage. Sans capteur
// (desktop) ou si la permission est refusée, le reflet reste
// simplement fixe (valeurs par défaut du CSS) : aucune dégradation
// visible, juste pas d'animation.
export function useDeviceTilt() {
  useEffect(() => {
    let rafId = null

    function applyTilt(beta, gamma) {
      const x = 50 + Math.max(-1, Math.min(1, gamma / 45)) * 38
      const y = 50 + Math.max(-1, Math.min(1, (beta - 40) / 60)) * 38
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--tilt-x', `${x}%`)
        document.documentElement.style.setProperty('--tilt-y', `${y}%`)
      })
    }

    function handleOrientation(event) {
      if (event.beta === null || event.gamma === null) return
      applyTilt(event.beta, event.gamma)
    }

    function startListening() {
      window.addEventListener('deviceorientation', handleOrientation)
    }

    function requestIOSPermission() {
      window.DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') startListening()
        })
        .catch(() => {})
    }

    const needsIOSPermission = typeof window.DeviceOrientationEvent?.requestPermission === 'function'
    if (needsIOSPermission) {
      window.addEventListener('pointerdown', requestIOSPermission, { once: true })
    } else if (typeof window.DeviceOrientationEvent !== 'undefined') {
      startListening()
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      if (needsIOSPermission) window.removeEventListener('pointerdown', requestIOSPermission)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
}

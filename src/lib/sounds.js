// Sons d'interface courts et synthétiques (Web Audio API, pas de
// fichiers audio) — cohérents avec une interface épurée type
// Apple/Linear plutôt que des samples réalistes. Toutes les séquences
// durent moins de 300ms.

const STORAGE_KEY = 'sounds-enabled'

let audioContext = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  return audioContext
}

export function areSoundsEnabled() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === null ? true : stored === 'true'
  } catch {
    return true
  }
}

export function setSoundsEnabled(enabled) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(enabled))
  } catch {
    // stockage indisponible (navigation privée…) : pas bloquant
  }
}

function playTone(ctx, { frequency, startTime, duration, type, peakGain }) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startTime)
  // Enveloppe courte (attaque rapide, relâchement exponentiel) pour un
  // rendu net et discret plutôt qu'un bip qui traîne.
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.02)
}

function play(notes) {
  if (!areSoundsEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    for (const note of notes) {
      playTone(ctx, {
        frequency: note.frequency,
        duration: note.duration,
        type: note.type ?? 'sine',
        peakGain: note.peakGain ?? 0.12,
        startTime: now + (note.delay ?? 0),
      })
    }
  } catch {
    // Web Audio indisponible ou bloqué par la politique autoplay :
    // silencieux, ce n'est jamais bloquant pour l'action elle-même.
  }
}

// Validation d'une action proposée par l'Assistant IA.
export function playActionValidated() {
  play([
    { frequency: 660, duration: 0.1, peakGain: 0.12 },
    { frequency: 880, duration: 0.12, delay: 0.06, peakGain: 0.12 },
  ])
}

// Étape/tâche de projet cochée comme terminée.
export function playTaskComplete() {
  play([{ frequency: 740, duration: 0.09, peakGain: 0.1 }])
}

// Conversion prospect -> devis signé : un moment important, son plus
// marqué (petit arpège ascendant à 3 notes) mais toujours bref.
export function playProspectConverted() {
  play([
    { frequency: 523.25, duration: 0.1, peakGain: 0.16 },
    { frequency: 659.25, duration: 0.1, delay: 0.06, peakGain: 0.16 },
    { frequency: 783.99, duration: 0.14, delay: 0.12, peakGain: 0.18 },
  ])
}

// Nouvelle notification reçue.
export function playNotification() {
  play([
    { frequency: 587.33, duration: 0.08, peakGain: 0.1 },
    { frequency: 880, duration: 0.1, delay: 0.05, peakGain: 0.09 },
  ])
}

// Ouverture de la palette de commande — presque subliminal.
export function playPaletteOpen() {
  play([{ frequency: 1046.5, duration: 0.04, peakGain: 0.04 }])
}

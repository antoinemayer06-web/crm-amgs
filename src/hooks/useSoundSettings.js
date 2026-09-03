import { useState } from 'react'
import { areSoundsEnabled, setSoundsEnabled } from '../lib/sounds'

export function useSoundSettings() {
  const [enabled, setEnabled] = useState(areSoundsEnabled)

  function toggle(value) {
    setSoundsEnabled(value)
    setEnabled(value)
  }

  return { enabled, toggle }
}

import { useEffect, useState } from 'react'

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => (typeof matchMedia !== 'undefined' ? matchMedia(query).matches : false))
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMedia('(max-width: 767px)')
export const useIsTablet = () => useMedia('(max-width: 1023px)')

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../libs/gsap'

let instance = null

// Lets components (hero dots, menus) drive the scroll without prop drilling.
export const getLenis = () => instance

// Smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true })
    instance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Fonts and images shift the layout after first paint.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])
}

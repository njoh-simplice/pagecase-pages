import { gsap, ScrollTrigger, SplitText, useGSAP } from '../libs/gsap'

// Scroll reveals, desktop only. Inside each [data-reveal-component]:
//   data-reveal="heading"   characters fade in one by one
//   data-reveal="paragraph" fades in while scaling up from 0.9
//   data-reveal="fade"      fades in last
export default function useReveal(scope) {
  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
        let cancelled = false

        const run = contextSafe(() => {
          if (cancelled) return
          gsap.utils.toArray('[data-reveal-component]').forEach((component) => {
            const headings = component.querySelectorAll('[data-reveal="heading"]')
            const paragraphs = component.querySelectorAll('[data-reveal="paragraph"]')
            const fades = component.querySelectorAll('[data-reveal="fade"]')

            const box = component.getBoundingClientRect()
            const alreadyVisible = box.top < window.innerHeight * 0.8

            const tl = gsap.timeline({
              defaults: alreadyVisible ? { duration: 0 } : {},
              scrollTrigger: { trigger: component, start: 'top 80%', once: true },
            })

            headings.forEach((heading) => {
              const split = SplitText.create(heading, { type: 'chars,words,lines', linesClass: 'line-mask' })
              gsap.set(heading, { opacity: 1 })
              gsap.set(split.chars, { opacity: 0 })
              tl.to(split.chars, { opacity: 1, duration: 0.5, stagger: { each: 0.03 }, ease: 'none' }, 0)
            })
            paragraphs.forEach((p) => {
              gsap.set(p, { opacity: 0, scale: 0.9, transformOrigin: 'center' })
              tl.to(p, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.4)
            })
            if (fades.length) {
              gsap.set(fades, { autoAlpha: 0 })
              tl.to(fades, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0.8)
            }
          })
          ScrollTrigger.refresh()
        })

        document.fonts.ready.then(run)
        return () => {
          cancelled = true
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}

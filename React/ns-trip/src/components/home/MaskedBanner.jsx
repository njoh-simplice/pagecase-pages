import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../libs/gsap'
import { maskedBanner } from '../../utils/content'

// A faded copy of the heading sits underneath; the solid copy on top is
// revealed by a circle growing from below as the section scrolls in.
export default function MaskedBanner() {
  const root = useRef(null)
  const clip = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ small: '(max-width: 767px)', large: '(min-width: 768px)' }, (ctx) => {
        const { small } = ctx.conditions
        clip.current.style.clipPath = 'circle(0% at 50% 120%)'
        ScrollTrigger.create({
          trigger: root.current,
          start: small ? 'top 95%' : 'top 70%',
          end: small ? 'bottom 90%' : 'center center',
          scrub: 1,
          onUpdate: (self) => {
            clip.current.style.clipPath = `circle(${self.progress * 150}% at 50% 120%)`
          },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="bg-paper py-[9.4rem]">
      <div className="frame">
        <div ref={root} className="relative flex items-center justify-center">
          <h2 className="text-center text-h1 text-balance text-ink/20">{maskedBanner}</h2>
          <div ref={clip} className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <p className="text-center text-h1 text-balance">{maskedBanner}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

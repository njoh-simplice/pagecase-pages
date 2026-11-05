import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../../libs/gsap'
import { itineraries } from '../../utils/content'
import Button from '../ui/Button'
import { Icon } from '../ui/Icons'
import MediaPlaceholder from '../ui/MediaPlaceholder'

const OPEN = 'inset(0% 0% 0% 0%)'
const SHUT = 'inset(50% 50% 50% 50%)'

// Blue carousel card. Changing slides pushes the old text lines up out of their
// masks, closes the old image to its centre, then brings the new ones in.
export default function Itineraries() {
  const root = useRef(null)
  const state = useRef({ index: 0, busy: false, slides: [] })

  const { contextSafe } = useGSAP(
    (_, safe) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const slides = gsap.utils.toArray('[data-slide]', root.current).map((item) => ({
        item,
        image: item.querySelector('[data-slide-img]'),
        fades: item.querySelectorAll('[data-slide-fade]'),
        lines: [],
      }))
      state.current.slides = slides
      state.current.reduce = reduce

      document.fonts.ready.then(
        safe(() => {
          slides.forEach((s, i) => {
            const active = i === state.current.index
            gsap.set(s.item, { autoAlpha: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none' })
            if (reduce) return
            const split = SplitText.create(s.item.querySelectorAll('[data-slide-text]'), { type: 'lines', mask: 'lines' })
            s.lines = split.lines
            gsap.set(s.lines, { yPercent: active ? 0 : 110 })
            gsap.set(s.image, { clipPath: active ? OPEN : SHUT })
            gsap.set(s.fades, { autoAlpha: active ? 1 : 0 })
          })
        }),
      )
    },
    { scope: root },
  )

  const go = contextSafe((dir) => {
    const s = state.current
    if (s.busy) return
    const next = (s.index + dir + s.slides.length) % s.slides.length
    const from = s.slides[s.index]
    const to = s.slides[next]
    s.busy = true

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(from.item, { autoAlpha: 0, pointerEvents: 'none' })
        gsap.set(to.item, { pointerEvents: 'auto' })
        s.index = next
        s.busy = false
      },
    })

    if (s.reduce) {
      tl.to(from.item, { autoAlpha: 0, duration: 0.4, ease: 'power2' }, 0).fromTo(to.item, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2' }, 0)
      return
    }

    gsap.set(to.item, { autoAlpha: 1 })
    gsap.set(to.lines, { yPercent: 110 })
    tl.to(from.lines, { yPercent: -110, duration: 0.6, ease: 'power4.inOut', stagger: { amount: 0.25 } }, 0)
      .to(from.image, { clipPath: SHUT, duration: 0.6, ease: 'power4.inOut' }, 0)
      .to(from.fades, { autoAlpha: 0, duration: 0.6, ease: 'power4.inOut' }, 0)
      .to(to.lines, { yPercent: 0, duration: 0.7, ease: 'power4.inOut', stagger: { amount: 0.4 } }, '>-=0.3')
      .fromTo(to.image, { clipPath: SHUT }, { clipPath: OPEN, duration: 0.75, ease: 'power4.inOut' }, '<')
      .fromTo(to.fades, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '>-=0.3')
  })

  return (
    <section id="itineraries" className="bg-navy py-[6.6rem] text-white">
      <div ref={root} className="frame">
        <div className="relative overflow-hidden rounded-[4px] bg-ocean">
          {/* Dashed column guides */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
            {[25, 50, 75].map((x) => (
              <span key={x} className="absolute inset-y-0 border-l border-dashed border-white/25" style={{ left: `${x}%` }} />
            ))}
          </div>

          <div className="relative grid">
            {itineraries.map((it) => (
              <article key={it.name} data-slide className="col-start-1 row-start-1 grid lg:min-h-[31.2rem] lg:grid-cols-[32%_1fr] lg:gap-6">
                <div className="flex flex-col items-start justify-between gap-10 px-8 pt-10 lg:py-10">
                  <div className="flex flex-col items-start gap-5">
                    <span data-slide-fade className="text-h6 font-semibold uppercase text-navy">
                      {it.label}
                    </span>
                    <div data-slide-fade>
                      <Button href="/contact/" variant="navy">
                        See itinerary
                      </Button>
                    </div>
                  </div>
                  <span data-slide-fade className="text-h3 font-semibold tracking-[-0.04em]">
                    {it.name}
                  </span>
                </div>

                <div className="flex flex-col justify-between gap-10 px-8 pb-10 pt-8 lg:py-10 lg:pl-0 lg:pr-8">
                  <p data-slide-text className="text-h4">
                    {it.text}
                  </p>
                  <div className="flex items-center gap-4 pr-28">
                    {it.image ? (
                      <img data-slide-img src={it.image} alt="" loading="lazy" decoding="async" className="size-16 shrink-0 rounded-[4px] object-cover" />
                    ) : (
                      <MediaPlaceholder data-slide-img aria-label="Itinerary photo placeholder" className="size-16 shrink-0 rounded-[4px] bg-white/80" />
                    )}
                    <p data-slide-text>{it.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="absolute bottom-10 right-8 flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous itinerary"
              className="grid size-11 place-items-center rounded-[4px] border border-white transition-colors hover:bg-white hover:text-ocean"
            >
              <Icon name="arrowLeft" className="size-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next itinerary"
              className="grid size-11 place-items-center rounded-[4px] border border-white transition-colors hover:bg-white hover:text-ocean"
            >
              <Icon name="arrowRight" className="size-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

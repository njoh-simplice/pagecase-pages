import { useRef } from 'react'
import { gsap, useGSAP } from '../../libs/gsap'
import { why } from '../../utils/content'
import { Cross } from '../ui/Frame'
import { Icon } from '../ui/Icons'
import TopoCanvas from './TopoCanvas'

const STEP_DEG = 4

function Card({ card }) {
  return (
    <div className={`flex aspect-[0.7] w-[clamp(17rem,25vw,24rem)] flex-col justify-between rounded-lg px-[1.66rem] py-[2.2rem] ${card.tone}`}>
      <span className="grid size-16 place-items-center rounded-lg border border-current/60">
        <Icon name={card.icon} className="size-7" strokeWidth={1.2} />
      </span>
      <div>
        <h3 className="mb-[1.45rem] text-h5">{card.title}</h3>
        <p className="text-small">{card.text}</p>
      </div>
    </div>
  )
}

// 3 x 3 grid of crosses over the section, like survey marks on a map.
const marks = [
  ['left-margin top-[45px]', 'bg-[#949494]'],
  ['left-1/2 top-[45px]', 'bg-accent'],
  ['right-margin top-[45px]', 'bg-[#949494]'],
  ['left-margin top-1/2', 'bg-[#949494]'],
  ['right-margin top-1/2', 'bg-[#949494]'],
  ['left-margin bottom-[45px]', 'bg-accent'],
  ['left-1/2 bottom-[45px]', 'bg-accent'],
  ['right-margin bottom-[45px]', 'bg-accent'],
]

// Desktop: the section pins for four screens. Each card sits on top of a huge
// circle; as you scroll, the card rises to the centre while its circle rotates,
// fanning the cards out. Mobile: a plain list.
export default function WhyUs() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const pin = root.current
        const circles = gsap.utils.toArray('[data-circle]', pin)
        const travel = () => pin.offsetHeight - window.innerHeight
        const each = () => travel() / circles.length

        gsap.fromTo(
          '[data-circles]',
          { y: '5%' },
          { y: '-5%', ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: 'bottom bottom', scrub: true } },
        )
        gsap.to('[data-why-content]', {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${travel() * 0.25}`, scrub: true, invalidateOnRefresh: true },
        })

        let angle = -((circles.length - 1) * STEP_DEG) / 2
        circles.forEach((circle, i) => {
          const card = circle.querySelector('[data-card]')
          const trigger = {
            trigger: pin,
            start: () => `top top-=${each() * i}`,
            end: () => `+=${each()}`,
            scrub: true,
            invalidateOnRefresh: true,
          }
          gsap.set(card, { xPercent: -50, yPercent: -50, y: () => window.innerHeight * 0.55 + card.offsetHeight / 2 })
          gsap.to(circle, { rotation: angle, ease: 'power1.out', scrollTrigger: trigger })
          gsap.to(card, { rotation: angle, y: 0, ease: 'power1.out', scrollTrigger: trigger })
          angle += STEP_DEG
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="relative z-[1] overflow-clip">
      <div ref={root} className="relative md:h-[400vh]">
        <div className="relative overflow-hidden md:sticky md:top-0 md:h-svh">
          {/* Background: faint map and survey crosses */}
          <div className="absolute inset-0">
            <TopoCanvas className="absolute inset-0 size-full opacity-40" seed={4} />
            {marks.map(([pos, color]) => (
              <Cross key={pos} className={pos} color={color} />
            ))}
          </div>

          <div data-reveal-component data-why-content className="relative flex flex-col items-center px-6 pt-24 text-center md:absolute md:inset-0 md:justify-center md:pt-0">
            <h2 data-reveal="heading" className="mb-[2.4rem] max-w-[52rem] text-h1 text-balance">
              {why.title}
            </h2>
            <p data-reveal="paragraph" className="max-w-[25rem] text-ink/75">
              {why.text}
            </p>
          </div>

          {/* Desktop: cards on rotating circles */}
          <div data-circles className="pointer-events-none absolute inset-0 hidden md:block">
            {why.cards.map((card) => (
              <div key={card.title} data-circle className="absolute left-1/2 top-1/2 aspect-square w-[250vw] -translate-x-1/2">
                <div data-card className="absolute left-1/2 top-0">
                  <Card card={card} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked */}
          <div className="relative flex flex-col items-center gap-4 px-6 pb-24 pt-12 md:hidden">
            {why.cards.map((card, i) => (
              <div key={card.title} style={{ rotate: `${(i - 1.5) * 2}deg` }}>
                <Card card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

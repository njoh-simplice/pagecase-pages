import { useEffect, useRef, useState } from 'react'
import { facts } from '../../utils/content'
import { Icon } from '../ui/Icons'

const DELAY = 2500
const SPEED = 600
const VISIBLE = 5

// Distance from the active column, wrapped so the list loops (-2 .. 2 for 5 columns).
const offsetOf = (i, active, n) => {
  let d = (i - active) % n
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

const LOOK = {
  0: { opacity: 1, y: 0 },
  1: { opacity: 0.5, y: 16 },
  2: { opacity: 0.25, y: 32 },
}

// Horizontal, looping fact slider: the centred column is fully lit (number in
// lime), neighbours fade and drift down. Autoplays; arrows and clicks jump columns.
export default function Facts() {
  const { items } = facts
  const n = items.length
  const [active, setActive] = useState(0)
  const prev = useRef(items.map((_, i) => offsetOf(i, 0, n)))
  const timer = useRef(null)

  const restart = () => {
    clearInterval(timer.current)
    timer.current = setInterval(() => setActive((a) => (a + 1) % n), DELAY)
  }

  useEffect(() => {
    restart()
    return () => clearInterval(timer.current)
  }, [])

  const go = (index) => {
    setActive(((index % n) + n) % n)
    restart()
  }

  const offsets = items.map((_, i) => offsetOf(i, active, n))
  const jumps = offsets.map((o, i) => Math.abs(o - prev.current[i]) > 1)
  useEffect(() => {
    prev.current = offsets
  })

  return (
    <section className="overflow-hidden bg-navy text-white">
      <div className="frame flex flex-col gap-8 pt-[6.6rem] lg:flex-row lg:items-end lg:justify-between">
        <div data-reveal-component>
          <p data-reveal="paragraph" className="max-w-[34rem] origin-left text-h4">
            {facts.text}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous fact"
            className="grid size-12 place-items-center rounded-[4px] bg-white/20 transition-colors hover:bg-white/30"
          >
            <Icon name="arrowLeft" className="size-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next fact"
            className="grid size-12 place-items-center rounded-[4px] bg-white/20 transition-colors hover:bg-white/30"
          >
            <Icon name="arrowRight" className="size-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <ul className="relative mt-12 h-[clamp(12rem,18vw,15rem)] pb-[6.6rem] box-content" style={{ '--col': 'clamp(13rem, 24vw, 22rem)' }} aria-live="polite">
        {items.map((item, i) => {
          const o = offsets[i]
          const look = LOOK[Math.abs(o)] ?? { opacity: 0, y: 32 }
          const isActive = o === 0
          return (
            <li
              key={item.value}
              className="absolute left-1/2 top-0 flex h-[clamp(12rem,18vw,15rem)] w-(--col) cursor-pointer flex-col items-center justify-center gap-4 text-center"
              style={{
                opacity: Math.abs(o) <= Math.floor(VISIBLE / 2) ? look.opacity : 0,
                transform: `translate(calc(-50% + ${o} * var(--col)), ${look.y}px)`,
                transition: jumps[i] ? 'none' : `opacity ${SPEED}ms ease, transform ${SPEED}ms ease`,
              }}
              onClick={() => go(i)}
              aria-current={isActive}
            >
              <span className={`text-h1 transition-colors duration-500 ${isActive ? 'text-lime' : ''}`}>{item.value}</span>
              <span className="max-w-[16ch] text-h4">{item.label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

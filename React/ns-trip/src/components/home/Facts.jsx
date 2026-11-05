import { useEffect, useRef, useState } from 'react'
import { facts } from '../../utils/content'
import { Icon } from '../ui/Icons'

const DELAY = 2500
const SPEED = 600
const VISIBLE = 5

// Distance from the active row, wrapped so the list loops (-2 .. 2 for 5 rows).
const offsetOf = (i, active, n) => {
  let d = (i - active) % n
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

const LOOK = {
  0: { opacity: 1, x: 0 },
  1: { opacity: 0.5, x: 32 },
  2: { opacity: 0.25, x: 64 },
}

// Vertical, looping fact slider: the centred row is fully lit (number in lime),
// neighbours fade and drift right. Autoplays; arrows and clicks jump rows.
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
      <div className="frame grid gap-12 py-[6.6rem] lg:grid-cols-[40%_1fr]">
        <div data-reveal-component>
          <p data-reveal="paragraph" className="max-w-[34rem] origin-left text-h4">
            {facts.text}
          </p>
        </div>

        <div className="relative pr-14" style={{ '--row': 'calc(6rem + 3.2vw)' }}>
          <ul className="relative h-[calc(var(--row)*5)]" aria-live="polite">
            {items.map((item, i) => {
              const o = offsets[i]
              const look = LOOK[Math.abs(o)] ?? { opacity: 0, x: 64 }
              const isActive = o === 0
              return (
                <li
                  key={item.value}
                  className="absolute inset-x-0 top-1/2 flex h-(--row) cursor-pointer items-center gap-[clamp(1.5rem,2.8vw,2.5rem)]"
                  style={{
                    opacity: Math.abs(o) <= Math.floor(VISIBLE / 2) ? look.opacity : 0,
                    transform: `translate(${look.x}px, calc(-50% + ${o} * var(--row)))`,
                    transition: jumps[i] ? 'none' : `opacity ${SPEED}ms ease, transform ${SPEED}ms ease`,
                  }}
                  onClick={() => go(i)}
                  aria-current={isActive}
                >
                  <span className={`shrink-0 text-h1 transition-colors duration-500 ${isActive ? 'text-lime' : ''}`}>{item.value}</span>
                  <span className="max-w-[16ch] text-h4">{item.label}</span>
                </li>
              )
            })}
          </ul>

          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous fact"
              className="grid size-12 place-items-center rounded-[4px] bg-white/20 transition-colors hover:bg-white/30"
            >
              <Icon name="arrowUp" className="size-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next fact"
              className="grid size-12 place-items-center rounded-[4px] bg-white/20 transition-colors hover:bg-white/30"
            >
              <Icon name="arrowDown" className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

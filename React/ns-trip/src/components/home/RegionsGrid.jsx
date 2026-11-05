import { useEffect, useRef } from 'react'
import { gsap } from '../../libs/gsap'
import { regions, regionsTitle } from '../../utils/content'
import { PixelCorners } from '../ui/Frame'

const FADE = 0.5
const MIN_GAP = 0.3
const MAX_GAP = 0.9
const HOLD = 2000

const shuffle = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Framed grid of the ten regions. Once in view, the cells cross-fade one by one
// (random order and timing) from region name to capital and back, on a loop.
export default function RegionsGrid() {
  const grid = useRef(null)

  useEffect(() => {
    const cells = [...grid.current.querySelectorAll('[data-cell]')]
    const pair = (cell) => ({ a: cell.querySelector('[data-a]'), b: cell.querySelector('[data-b]') })
    let timers = []
    let loop = null
    let visible = false

    const stop = () => {
      timers.forEach(clearTimeout)
      timers = []
      clearTimeout(loop)
    }
    const reset = () => {
      stop()
      cells.forEach((c) => {
        const { a, b } = pair(c)
        gsap.killTweensOf([a, b])
        gsap.set(a, { opacity: 1 })
        gsap.set(b, { opacity: 0 })
      })
    }
    const swap = (forward) => {
      if (!visible) return
      let done = 0
      let at = 0
      shuffle(cells).forEach((cell) => {
        const delay = at
        at += MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP)
        timers.push(
          setTimeout(() => {
            if (!visible) return
            const { a, b } = pair(cell)
            const [from, to] = forward ? [a, b] : [b, a]
            gsap.to(from, { opacity: 0, duration: FADE, ease: 'power2.inOut' })
            gsap.to(to, {
              opacity: 1,
              duration: FADE,
              ease: 'power2.inOut',
              onComplete: () => {
                done += 1
                if (done === cells.length) loop = setTimeout(() => swap(!forward), forward ? HOLD : 1000)
              },
            })
          }, delay * 1000),
        )
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true
          loop = setTimeout(() => swap(true), 1500)
        } else {
          visible = false
          reset()
        }
      },
      { threshold: 0.2 },
    )
    reset()
    observer.observe(grid.current)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [])

  return (
    <section id="regions" data-reveal-component className="relative bg-paper">
      <div className="border-b border-line" />
      <div className="frame">
        <div className="border-x border-line px-6 py-[6.6rem]">
          <h2 data-reveal="heading" className="mx-auto max-w-5xl text-center text-h2 text-balance">
            {regionsTitle}
          </h2>
        </div>

        <div ref={grid} className="relative grid grid-cols-2 border-l border-t border-line sm:grid-cols-5">
          {regions.map(([name, capital]) => (
            <div
              key={name}
              data-cell
              className="relative grid h-[7.6rem] place-items-center border-b border-r border-line px-3 text-center"
            >
              <span data-a className="col-start-1 row-start-1 text-h5 font-semibold text-[#949494]">
                {name}
              </span>
              <span data-b className="col-start-1 row-start-1 text-h5 font-semibold text-[#949494] opacity-0">
                {capital}
              </span>
            </div>
          ))}
          <PixelCorners />
        </div>
      </div>
      <div className="-mt-px border-b border-line" />
    </section>
  )
}

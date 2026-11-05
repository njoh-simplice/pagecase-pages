import { useEffect, useRef, useState } from 'react'
import { steps } from '../../utils/content'
import { Cross, PixelCorners } from '../ui/Frame'
import TopoCanvas from './TopoCanvas'

// Square photo of the step's place with corner crosses and a name tag. Falls
// back to the navy contour block when a step has no image yet.
function StepVisual({ label, image, alt, seed, className = '' }) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-[4px] bg-navy ${className}`}>
      {image ? (
        <img src={image} alt={alt ?? label} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <TopoCanvas className="absolute inset-0 size-full" stroke="rgba(120, 170, 220, 0.16)" seed={seed} />
      )}
      <Cross className="left-[7%] top-[7%]" size={12} />
      <Cross className="left-[93%] top-[7%]" size={12} />
      <Cross className="left-[7%] top-[93%]" size={12} />
      <Cross className="left-[93%] top-[93%]" size={12} />
      <span className="absolute bottom-[10%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-white px-4 py-2.5 text-small font-semibold text-navy">
        {label}
      </span>
    </div>
  )
}

// Left: one full-height cell per step. Right: a sticky visual that switches to
// whichever step's text is closest to the middle of the viewport.
export default function StickySteps() {
  const list = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const anchors = [...list.current.querySelectorAll('[data-step]')]
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      anchors.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const d = Math.abs(mid - (r.top + r.height / 2))
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="experiences" className="border-y border-line">
      <div className="frame relative">
        <div ref={list} className="flex flex-col">
          {steps.map((step, i) => (
            <div
              key={step.title}
              data-step
              data-reveal-component
              className="relative -mb-px flex flex-col justify-center border-x border-b border-line px-6 py-16 lg:min-h-svh lg:w-[40%] lg:px-10 lg:pb-10 lg:pt-[6.6rem]"
            >
              <h2 data-reveal="heading" className="max-w-[28.4rem] text-h3">
                {step.title}
              </h2>
              <StepVisual label={step.media} image={step.image} alt={step.alt} seed={i + 1} className="mt-10 w-full lg:hidden" />
              <PixelCorners className="hidden lg:block" />
            </div>
          ))}
        </div>

        <div className="absolute inset-y-0 left-[40%] right-0 hidden border-r border-line lg:block">
          <div className="sticky top-0 flex h-svh items-center justify-center p-6">
            <div className="relative aspect-square w-[min(85%,76vh)]">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`absolute inset-0 transition-opacity duration-700 ease-osmo ${active === i ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden={active !== i}
                >
                  <StepVisual label={step.media} image={step.image} alt={step.alt} seed={i + 1} className="size-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

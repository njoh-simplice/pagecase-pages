import { useRef } from 'react'
import { gsap, useGSAP } from '../../libs/gsap'
import { cta } from '../../utils/content'
import Button from '../ui/Button'
import { PixelCorners } from '../ui/Frame'
import MediaPlaceholder from '../ui/MediaPlaceholder'

export default function CallToAction() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-cta-bg]',
        { yPercent: 8 },
        { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true } },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-hidden bg-navy text-white">
      <div data-cta-bg className="absolute -inset-y-[10%] inset-x-0">
        {cta.image ? (
          <img src={cta.image} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        ) : (
          <MediaPlaceholder tone="dark" label="Background image" className="size-full" />
        )}
      </div>
      <div className="absolute inset-0 bg-navy/55" />

      <div className="frame relative border-x border-white/20 py-20">
        <div data-reveal-component className="relative flex flex-col items-center gap-[2.4rem] px-4 py-[9.4rem] text-center">
          <span className="absolute -inset-x-[50vw] top-0 h-px bg-white/20" aria-hidden="true" />
          <span className="absolute -inset-x-[50vw] bottom-0 h-px bg-white/20" aria-hidden="true" />
          <PixelCorners tone="light" />
          <h2 data-reveal="heading" className="max-w-[48rem] text-h1 text-balance">
            {cta.title}
          </h2>
          <div data-reveal="fade">
            <Button href="/contact/" size="regular">
              {cta.button}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

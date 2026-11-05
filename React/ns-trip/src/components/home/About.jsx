import { useRef } from 'react'
import { gsap, useGSAP } from '../../libs/gsap'
import { about } from '../../utils/content'
import Button from '../ui/Button'
import { Cross, PixelCorners } from '../ui/Frame'
import { Play } from '../ui/Icons'
import MediaPlaceholder from '../ui/MediaPlaceholder'

// Full-bleed hairline used to frame blocks inside dark sections.
const Rule = ({ className = '' }) => (
  <span className={`pointer-events-none absolute -inset-x-[50vw] h-px bg-white/20 ${className}`} aria-hidden="true" />
)

export default function About() {
  const reel = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      reel.current,
      { yPercent: 8 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: reel.current, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true } },
    )
  })

  return (
    <section id="about" className="relative overflow-hidden bg-navy text-white">
      {about.image ? (
        <img src={about.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <MediaPlaceholder tone="dark" label="Background image" className="absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-navy/50" />

      <div className="frame relative border-x border-white/20 pb-20">
        <div className="pt-[5rem]">
          <div data-reveal-component className="relative py-[6.6rem]">
            <Rule className="top-0" />
            <Rule className="bottom-0" />
            <PixelCorners tone="light" />
            <div className="grid items-center gap-10 px-6 lg:mx-[4.2rem] lg:grid-cols-2 lg:px-0">
              <h2 data-reveal="heading" className="text-h1">
                {about.title}
              </h2>
              <div className="flex flex-col items-start gap-8">
                <p data-reveal="paragraph" className="max-w-xl">
                  {about.text}
                </p>
                <div data-reveal="fade">
                  <Button href="/contact/" size="regular">
                    {about.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative py-[4.75rem]">
            <Rule className="bottom-0" />
            <div ref={reel} className="relative mx-auto w-full overflow-hidden rounded-2xl lg:w-[80%]">
              <MediaPlaceholder kind="video" label={about.reel} className="aspect-video w-full bg-[#e2e2e2]" />
              <Cross className="left-[5%] top-[8%]" size={24} />
              <Cross className="left-[87.5%] top-[8%]" size={24} />
              <button
                type="button"
                aria-label="Play brand film"
                className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[rgba(100,100,100,0.3)] text-white backdrop-blur-md transition-transform duration-500 ease-osmo hover:scale-105 lg:size-40"
              >
                <Play className="ml-1 size-8 lg:size-12" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

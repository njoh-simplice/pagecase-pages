import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../../libs/gsap'
import { getLenis } from '../../hooks/useLenis'
import { hero } from '../../utils/content'
import HeroArtwork from './HeroArtwork'
import Preloader, { COLLAPSED_BOTTOM, COLLAPSED_TOP } from './Preloader'

// Share of the width taken by the headline column; the side panel gets the rest.
const SPLIT = '64.74%'
const SIDE = '35.26%'

const COLLAPSED_TR = 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)'
const COLLAPSED_BL = 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)'
const COLLAPSED_L = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

// Mouse parallax reach: 10rem, as in the reference.
const REACH = 160

// Tells the navbar to slide in (it lives outside the hero).
const showNav = () => window.dispatchEvent(new Event('ns-trip:nav-in'))

export default function Hero() {
  const root = useRef(null)

  useGSAP(
    (_, contextSafe) => {
      const el = root.current
      const one = (s) => el.querySelector(s)
      const all = (s) => gsap.utils.toArray(s, el)

      const pre = one('[data-preloader]')
      const preBg = one('[data-preloader-bg]')
      const preImg = one('[data-preloader-bg-image]')
      const preLogo = one('[data-preloader-logo]')
      const bg = one('[data-hero-bg]')
      const thick = all('[data-hero-svg="thick"] path')
      const thin = all('[data-hero-svg="thin"] path')
      const trip = one('[data-hero-svg="trip"]')
      const panel = one('[data-hero-panel]')
      const side = one('[data-hero-side]')
      const heading = one('[data-hero-heading]')
      const mobileText = one('[data-hero-mobile-text]')
      const hline = one('[data-hero-hline]')
      const vline = one('[data-hero-vline]')
      const cross = one('[data-hero-cross]')
      const dotList = one('[data-hero-dots]')
      const dots = all('[data-hero-dot]')
      const [p1, p2, p3] = all('[data-hero-p]')

      const setActive = (i) => dots.forEach((d, k) => (d.dataset.active = String(k === i)))
      setActive(0)

      // The intro always starts from the top of the page.
      history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)

      const mm = gsap.matchMedia()

      mm.add(
        { desktop: '(min-width: 992px)', mobile: '(max-width: 991px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions
          const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
          let cancelled = false

          if (reduce) {
            gsap.set(pre, { autoAlpha: 0 })
            gsap.set(heading, { visibility: 'visible' })
            gsap.set([p1, p2, p3, dotList], { opacity: 1 })
            showNav()
            return
          }

          // Starting state, set before first paint.
          gsap.set(pre, { autoAlpha: 1, clipPath: FULL })
          gsap.set(bg, { scale: 1.25 })
          gsap.set(thick, { drawSVG: '0%' })
          gsap.set(thin, { drawSVG: '0%' })
          gsap.set(trip, { clipPath: COLLAPSED_L })
          gsap.set(panel, { clipPath: desktop ? COLLAPSED_TR : COLLAPSED_L })
          gsap.set([dotList, p1], { opacity: 0 })
          if (desktop) gsap.set(side, { clipPath: COLLAPSED_BL })
          else gsap.set(mobileText, { autoAlpha: 0 })

          // Scroll story: thin lines + 2nd line, then the trip route + 3rd line.
          const buildScroll = (words2, words3) => {
            const u = gsap.timeline({
              defaults: { ease: 'linear' },
              scrollTrigger: {
                trigger: el,
                start: 'clamp(top top)',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                  const t = self.progress * 3
                  setActive(t < 0.5 ? 0 : t < 1.5 ? 1 : 2)
                },
              },
            })
            u.to(bg, { scale: 1.125, duration: 3 }, 0)
            if (!desktop) return
            u.fromTo(thin, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, 0)
              .fromTo(words2, { opacity: 0 }, { opacity: 1, stagger: { amount: 0.5 } }, 0)
              .fromTo(trip, { clipPath: COLLAPSED_L }, { clipPath: FULL, duration: 1 }, 1)
              .fromTo(words3, { opacity: 0 }, { opacity: 1, stagger: { amount: 0.5 } }, 1)
          }

          // Intro, same sequence and timings as the reference (seconds):
          // 0     preloader map wipes up, logo wipes in at 0.5
          // 1.75  logo and preloader wipe out, hero art zooms in from 1.25
          // 2.0   thick routes draw in from the screen edge (5s)
          // 3.0   navbar, hairlines and crosshair slide in
          // 3.75  headline panel opens; 4.25 headline letters and side panel
          const run = contextSafe(() => {
            if (cancelled) return

            let chars = []
            let words2 = []
            let words3 = []
            if (desktop) {
              chars = SplitText.create(heading, { type: 'chars,words' }).chars
              gsap.set(chars, { opacity: 0 })
              gsap.set(heading, { visibility: 'visible' })
              words2 = SplitText.create(p2, { type: 'words' }).words
              words3 = SplitText.create(p3, { type: 'words' }).words
              gsap.set([...words2, ...words3], { opacity: 0 })
              gsap.set([p2, p3], { opacity: 1 })
            } else {
              gsap.set(heading, { visibility: 'visible', autoAlpha: 0 })
            }

            const tl = gsap.timeline({
              defaults: { ease: 'osmo', duration: 0.6 },
              onComplete: () => gsap.set(pre, { autoAlpha: 0 }),
            })

            tl.fromTo(preImg, { scale: 1.125 }, { scale: 1, duration: 3, ease: 'linear' }, 0)
              .fromTo(preBg, { clipPath: COLLAPSED_BOTTOM, scale: 1.1 }, { clipPath: FULL, scale: 1, duration: 1.5 }, 0)
              .fromTo(preLogo, { clipPath: COLLAPSED_TOP, scale: 1.1 }, { clipPath: FULL, scale: 1, duration: 1.25, ease: 'expo.out' }, 0.5)
              .to(preLogo, { clipPath: COLLAPSED_BOTTOM, scale: 1.1, duration: 1.5 }, 1.75)
              .fromTo(pre, { clipPath: FULL }, { clipPath: COLLAPSED_TOP, duration: 1.5 }, 1.75)
              .fromTo(bg, { scale: 1.25 }, { scale: 1, duration: 2.75, ease: 'expo.out' }, 1.75)
              .fromTo(thick, { drawSVG: '0%' }, { drawSVG: '100%', duration: 5, ease: 'power3.out' }, 2)

            if (!desktop) {
              tl.fromTo(thin, { drawSVG: '0%' }, { drawSVG: '100%', duration: 5, ease: 'power3.out' }, 2)
                .fromTo(trip, { clipPath: COLLAPSED_L }, { clipPath: FULL, duration: 5, ease: 'power3.out' }, 2)
            }

            // On touch phones the navbar is simply shown, without the slide.
            if (desktop || !touch) tl.call(showNav, null, 3)
            else showNav()

            if (desktop) {
              tl.fromTo(hline, { top: '100%' }, { top: 0, duration: 1.75 }, 3)
                .fromTo(vline, { right: '-60%' }, { right: SIDE, duration: 1.75 }, 3)
                .fromTo(cross, { right: '-65%' }, { right: SIDE, duration: 1.75 }, 3)
            }

            tl.fromTo(panel, { clipPath: desktop ? COLLAPSED_TR : COLLAPSED_L }, { clipPath: FULL, duration: 1.5 }, 3.75)

            if (desktop) {
              tl.to(chars, { opacity: 1, duration: 0.5, stagger: { each: 0.03, from: 'start' }, ease: 'none' }, 4.25)
                .to(p1, { opacity: 1 }, 4.25)
                .to(dotList, { opacity: 1 }, 4.25)
                .fromTo(side, { clipPath: COLLAPSED_BL }, { clipPath: FULL, duration: 1.5 }, 4.25)
            } else {
              tl.to(heading, { autoAlpha: 1, duration: 1, ease: 'none' }, 4.75)
                .fromTo(mobileText, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out' }, 4.875)
            }

            // The scroll timeline takes over once the intro zoom has settled.
            tl.call(() => buildScroll(words2, words3), null, 4.5)
          })

          document.fonts.ready.then(run)

          // Mouse parallax, desktop with a real pointer only.
          let off = () => {}
          if (desktop && !touch) {
            const layers = all('[data-mouse]').map((node) => ({
              strength: parseFloat(node.dataset.mouse),
              x: gsap.quickTo(node, 'x', { duration: 2, ease: 'power3' }),
              y: gsap.quickTo(node, 'y', { duration: 2, ease: 'power3' }),
            }))
            const onMove = (e) => {
              const nx = (e.clientX / window.innerWidth - 0.5) * 2
              const ny = (e.clientY / window.innerHeight - 0.5) * 2
              layers.forEach((l) => {
                l.x(nx * -REACH * l.strength)
                l.y(ny * -REACH * l.strength)
              })
            }
            window.addEventListener('mousemove', onMove)
            off = () => window.removeEventListener('mousemove', onMove)
          }

          // Dots jump to the start of each third of the hero.
          const goTo = (e) => {
            const i = Number(e.currentTarget.dataset.index)
            const top = el.getBoundingClientRect().top + window.scrollY
            getLenis()?.scrollTo(top + i * window.innerHeight)
          }
          dots.forEach((d) => d.addEventListener('click', goTo))

          return () => {
            cancelled = true
            off()
            dots.forEach((d) => d.removeEventListener('click', goTo))
          }
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative lg:h-[300vh]" aria-label="Introduction">
      <Preloader />
      <div className="sticky top-0 flex h-svh min-h-[34rem] flex-col overflow-hidden bg-paper lg:block">
        {/* Phones: the art fills the space below the headline. Desktop: full screen. */}
        <div className="relative order-2 flex-1 overflow-hidden lg:absolute lg:inset-0">
          <HeroArtwork />
        </div>

        <div className="relative order-1 flex flex-col lg:absolute lg:inset-0">
          {/* Top row: map on the left, side panel on the right */}
          <div className="relative lg:flex-1">
            <div
              data-hero-side
              style={{ width: SIDE }}
              className="absolute inset-y-0 right-0 hidden flex-col justify-between bg-paper px-6 pb-[21px] pt-[7rem] lg:flex"
            >
              <ul data-hero-dots className="flex flex-col gap-1" role="list">
                {hero.lines.map((_, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      data-hero-dot
                      data-index={i}
                      aria-label={`Go to step ${i + 1}`}
                      className="group relative grid size-6 place-items-center rounded-full"
                    >
                      <span className="absolute inset-0 rounded-full border border-dashed border-ink opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100" />
                      <span className="size-1.5 rounded-full bg-[#8794a1] transition-all duration-500 group-data-[active=true]:size-[7px] group-data-[active=true]:bg-accent" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="max-w-[23rem] text-h5 text-pretty">
                <p data-hero-p="1">{hero.lines[0]}</p>
                <p data-hero-p="2" className="opacity-0">
                  {hero.lines[1]}
                </p>
                <p data-hero-p="3" className="opacity-0">
                  {hero.lines[2]}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row: headline panel, map visible to its right */}
          <div className="relative">
            <span data-hero-hline className="absolute inset-x-0 top-0 z-10 hidden h-px bg-line lg:block" aria-hidden="true" />
            <div
              data-hero-panel
              style={{ '--split': SPLIT }}
              className="relative w-full bg-paper px-margin pb-8 pt-[calc(64px+2.75rem)] lg:w-(--split) lg:py-10"
            >
              <h1
                data-hero-heading
                className="invisible text-h1 text-pretty"
              >
                {hero.title}
              </h1>
              <p data-hero-mobile-text className="mt-6 max-w-md origin-left text-h5 lg:hidden">
                {hero.lines.join(' ')}
              </p>
            </div>
            <span
              data-hero-cross
              style={{ right: SIDE }}
              className="absolute top-0 z-20 hidden size-[30px] translate-x-1/2 -translate-y-1/2 lg:block"
              aria-hidden="true"
            >
              <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-accent" />
              <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-accent" />
            </span>
          </div>

          <span
            data-hero-vline
            style={{ right: SIDE }}
            className="absolute inset-y-0 z-10 hidden w-px bg-line lg:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}

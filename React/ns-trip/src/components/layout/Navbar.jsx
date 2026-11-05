import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/images/logoipsum.svg'
import { gsap, useGSAP } from '../../libs/gsap'
import { getLenis } from '../../hooks/useLenis'
import { navLinks, destinationsMenu } from '../../utils/content'
import Button from '../ui/Button'
import { Caret, Icon } from '../ui/Icons'

const OPEN_DELAY = 120
const CLOSE_DELAY = 150

function Logo() {
  return (
    <a href="/" className="flex shrink-0 items-center" aria-label="ns-trip home">
      <img src={logo} alt="" className="aspect-[123/40] h-8 w-auto lg:h-9" />
    </a>
  )
}

function MenuLink({ link, onClick }) {
  return (
    <a
      href={link.href}
      onClick={onClick}
      className="group/link flex items-center gap-3 rounded-[4px] px-[0.83rem] py-[0.7rem] transition-colors duration-200 hover:bg-light-200"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-[4px] bg-light-300 text-olive">
        <Icon name={link.icon} className="size-5" />
      </span>
      <span className="flex flex-col">
        <span className="flex items-center gap-1.5 text-[0.95em] font-semibold leading-tight text-[#201d1d]">
          {link.title}
          <Icon
            name="arrowRight"
            strokeWidth={2}
            className="size-3.5 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
          />
        </span>
        <span className="mt-1 text-[0.95em] leading-tight text-ink/55">{link.text}</span>
      </span>
    </a>
  )
}

function DestinationsPanel({ onNavigate }) {
  const { columns, featured } = destinationsMenu
  return (
    <div className="grid lg:grid-cols-[1fr_1fr_1.35fr]">
      {columns.map((col) => (
        <div key={col.label} data-menu-fade className="flex flex-col gap-[1.4rem] border-r border-black/10 px-[1.66rem] py-[2.77rem]">
          <span data-menu-fade className="pl-4 text-h6 font-semibold uppercase text-ink/75">
            {col.label}
          </span>
          <ul className="flex flex-col">
            {col.links.map((link) => (
              <li key={link.title} data-menu-fade>
                <MenuLink link={link} onClick={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div data-menu-fade className="flex flex-col gap-[1.4rem] px-[1.66rem] py-[2.77rem]">
        <span data-menu-fade className="text-h6 font-semibold uppercase text-ink/75">
          {featured.label}
        </span>
        <a
          data-menu-fade
          href={featured.href}
          onClick={onNavigate}
          className="group/feat flex min-h-64 flex-col justify-between rounded-lg bg-navy p-8 text-white"
        >
          <span className="max-w-md text-h4 transition-opacity duration-300 group-hover/feat:opacity-80">{featured.title}</span>
          <span className="flex items-center justify-between gap-4 text-small">
            <span className="rounded-[2px] border border-lime px-2 py-0.5 text-lime">{featured.tag}</span>
            <span>{featured.meta}</span>
          </span>
        </a>
      </div>
    </div>
  )
}

export default function Navbar() {
  const root = useRef(null)
  const bar = useRef(null)
  const container = useRef(null)
  const panel = useRef(null)
  const backdrop = useRef(null)
  const caret = useRef(null)
  const mobile = useRef(null)
  const state = useRef({ open: false, hover: null, leave: null, tl: null })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState(false)

  const { contextSafe } = useGSAP(
    (_, safe) => {
      gsap.set(container.current, { height: 0 })
      gsap.set(panel.current, { autoAlpha: 0 })
      gsap.set(backdrop.current, { autoAlpha: 0 })

      // Slides in when the hero intro says so (3s in, after the preloader);
      // pages without the intro show it straight away.
      const slideIn = safe(() => gsap.to(bar.current, { yPercent: 0, duration: 1.5, ease: 'expo.out' }))
      const hasIntro = !!document.querySelector('[data-preloader]')
      if (hasIntro) {
        gsap.set(bar.current, { yPercent: -125 })
        window.addEventListener('ns-trip:nav-in', slideIn, { once: true })
      }

      // Desktop: hide on scroll down past 80px, show on scroll up.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 992px)', () => {
        let last = window.scrollY
        let hidden = false
        const onScroll = () => {
          const y = window.scrollY
          const delta = y - last
          last = y
          if (state.current.open) return
          if (delta > 0 && y > 80 && !hidden) {
            gsap.to(root.current, { yPercent: -150, duration: 0.4, ease: 'power2.inOut' })
            hidden = true
          } else if (delta < 0 && hidden) {
            gsap.to(root.current, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' })
            hidden = false
          }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
          window.removeEventListener('scroll', onScroll)
          gsap.set(root.current, { clearProps: 'transform' })
        }
      })
      return () => {
        window.removeEventListener('ns-trip:nav-in', slideIn)
        mm.revert()
      }
    },
    { scope: root },
  )

  const links = () => gsap.utils.toArray('[data-bar-link]', root.current)

  const dimOthers = contextSafe((target) => {
    links().forEach((l) => gsap.to(l, { opacity: l === target ? 1 : 0.5, duration: 0.2, ease: 'power2.out' }))
  })
  const undim = contextSafe(() => gsap.to(links(), { opacity: 1, duration: 0.2, ease: 'power2.out' }))

  const clearTimers = () => {
    clearTimeout(state.current.hover)
    clearTimeout(state.current.leave)
  }

  const open = contextSafe(() => {
    const s = state.current
    if (s.open) return
    s.open = true
    s.tl?.kill()
    root.current.dataset.menuOpen = 'true'
    root.current.querySelector('[aria-haspopup]')?.setAttribute('aria-expanded', 'true')
    const items = panel.current.querySelectorAll('[data-menu-fade]')
    const height = panel.current.offsetHeight

    const tl = gsap.timeline()
    s.tl = tl
    tl.to(backdrop.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0)
      .to(container.current, { height, duration: 0.35, ease: 'power3.out' }, 0)
      .set(panel.current, { autoAlpha: 1 }, 0.05)
      .fromTo(items, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: { amount: 0.25 }, ease: 'power3.out' }, 0.1)
      .to(caret.current, { rotation: 180, duration: 0.3, ease: 'power2.out' }, 0)
  })

  const close = contextSafe(() => {
    const s = state.current
    if (!s.open) return
    s.tl?.kill()
    root.current.querySelector('[aria-haspopup]')?.setAttribute('aria-expanded', 'false')
    const items = panel.current.querySelectorAll('[data-menu-fade]')
    const tl = gsap.timeline({
      onComplete: () => {
        s.open = false
        root.current.dataset.menuOpen = 'false'
        gsap.set(panel.current, { autoAlpha: 0 })
        undim()
      },
    })
    s.tl = tl
    tl.to(items, { autoAlpha: 0, y: -4, duration: 0.14, ease: 'power2.in' }, 0)
      .to(container.current, { height: 0, duration: 0.25, ease: 'power2.in' }, 0.05)
      .to(backdrop.current, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, 0)
      .to(caret.current, { rotation: 0, duration: 0.25, ease: 'power2.out' }, 0)
  })

  const onToggleEnter = (e) => {
    clearTimers()
    dimOthers(e.currentTarget)
    state.current.hover = setTimeout(open, state.current.open ? 0 : OPEN_DELAY)
  }
  const scheduleClose = () => {
    clearTimeout(state.current.hover)
    state.current.leave = setTimeout(close, CLOSE_DELAY)
  }
  const cancelClose = () => clearTimeout(state.current.leave)
  const onLinkLeave = () => {
    if (!state.current.open) undim()
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimers()
    }
  }, [close])

  // Mobile menu
  const toggleMobile = contextSafe(() => {
    const next = !mobileOpen
    setMobileOpen(next)
    setMobileSub(false)
    if (next) getLenis()?.stop()
    else getLenis()?.start()
    gsap.to(mobile.current, { autoAlpha: next ? 1 : 0, duration: 0.3, ease: 'power2.out' })
    if (next) {
      gsap.fromTo(
        mobile.current.querySelectorAll('[data-mobile-item]'),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power3.out', delay: 0.15 },
      )
    }
  })
  const closeMobile = () => mobileOpen && toggleMobile()

  return (
    <>
      <div
        ref={backdrop}
        onClick={close}
        className="invisible fixed inset-0 z-[100] bg-black/25 opacity-0"
        aria-hidden="true"
      />

      <header ref={root} data-menu-open="false" className="fixed inset-x-0 top-0 z-[101] lg:inset-x-margin lg:top-[22px]">
        <div ref={bar} className="relative z-[3] bg-white lg:rounded-t-[4.4px]">
          <nav
            className="flex h-16 items-center justify-between pl-margin pr-3 lg:h-[71px] lg:px-[1.66rem]"
            aria-label="Main"
          >
            <div className="flex items-center">
              <div className="mr-6 xl:mr-[3.33rem]">
                <Logo />
              </div>
              <ul className="hidden items-center gap-1 lg:flex">
                {navLinks.map((link) =>
                  link.menu ? (
                    <li key={link.label}>
                      <button
                        type="button"
                        data-bar-link
                        aria-expanded="false"
                        aria-haspopup="true"
                        onMouseEnter={onToggleEnter}
                        onMouseLeave={scheduleClose}
                        onFocus={open}
                        onClick={open}
                        className="flex items-center gap-0.5 rounded-[4.4px] py-[0.42rem] pl-[0.69rem] pr-[0.33rem] text-[0.94em] font-semibold"
                      >
                        {link.label}
                        <span ref={caret} className="inline-flex">
                          <Caret className="size-[1.375rem]" />
                        </span>
                      </button>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        data-bar-link
                        onMouseEnter={(e) => dimOthers(e.currentTarget)}
                        onMouseLeave={onLinkLeave}
                        className="block rounded-[4.4px] px-[0.69rem] py-[0.42rem] text-[0.94em] font-semibold"
                      >
                        {link.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden items-center gap-1 sm:flex">
                <Button href="/contact/" variant="outline">
                  Contact
                </Button>
                <Button href="/contact/">Plan your trip</Button>
              </div>
              <button
                type="button"
                onClick={toggleMobile}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="ml-1 grid size-11 place-items-center rounded-[4px] lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-200 ${mobileOpen ? 'top-[5px] rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 top-[5px] h-[1.5px] w-full bg-ink transition-opacity duration-100 ${mobileOpen ? 'opacity-0' : ''}`} />
                  <span className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-200 ${mobileOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Desktop mega menu */}
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          data-lenis-prevent
          className="absolute inset-x-0 top-[calc(100%-4.4px)] z-[2] hidden lg:block"
        >
          <div ref={container} className="relative overflow-hidden rounded-b-[4.4px] bg-white">
            <div ref={panel} className="absolute inset-x-0 top-0">
              <DestinationsPanel onNavigate={close} />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          ref={mobile}
          className="invisible absolute inset-x-0 top-full z-[2] max-h-[calc(100svh-4rem)] overflow-y-auto bg-white opacity-0 lg:hidden"
          data-lenis-prevent
        >
          {!mobileSub ? (
            <ul className="flex flex-col p-4">
              {navLinks.map((link) => (
                <li key={link.label} data-mobile-item>
                  {link.menu ? (
                    <button
                      type="button"
                      onClick={() => setMobileSub(true)}
                      className="flex w-full items-center justify-between py-3 text-h4"
                    >
                      {link.label}
                      <Icon name="arrowRight" className="size-5" />
                    </button>
                  ) : (
                    <a href={link.href} onClick={closeMobile} className="block py-3 text-h4">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              <li data-mobile-item className="mt-4 flex gap-2 sm:hidden">
                <Button href="/contact/" variant="outline" onClick={closeMobile}>
                  Contact
                </Button>
                <Button href="/contact/" onClick={closeMobile}>
                  Plan your trip
                </Button>
              </li>
            </ul>
          ) : (
            <div className="p-2">
              <button
                type="button"
                onClick={() => setMobileSub(false)}
                className="flex items-center gap-2 px-3 py-3 text-[0.94em] font-semibold"
              >
                <Icon name="arrowLeft" className="size-4" />
                Back
              </button>
              {destinationsMenu.columns.map((col) => (
                <div key={col.label} className="pb-4">
                  <span className="block px-3 pb-2 pt-3 text-h6 font-semibold uppercase text-ink/75">{col.label}</span>
                  {col.links.map((link) => (
                    <MenuLink key={link.title} link={link} onClick={closeMobile} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  )
}

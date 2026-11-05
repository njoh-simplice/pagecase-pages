import { useEffect, useRef } from 'react'
import { gsap } from '../../libs/gsap'

// Label bubble that follows the pointer over [data-cursor-hover] elements
// and flips to the left near the right edge of the screen.
export default function Cursor() {
  const root = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
    let px = 0
    let py = 0
    let moved = false

    const update = () => {
      const target = document.elementFromPoint(px, py)?.closest('[data-cursor-hover]')
      const edge = el.getBoundingClientRect().right >= window.innerWidth
      el.dataset.state = target ? (edge ? 'edge' : 'active') : ''
      if (target) label.current.textContent = target.dataset.cursorText || ''
    }
    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      moved = true
      xTo(px)
      yTo(py)
      requestAnimationFrame(update)
    }
    const onScroll = () => moved && requestAnimationFrame(update)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      ref={root}
      data-state=""
      className="group/cursor pointer-events-none fixed left-0 top-0 z-[25] hidden pl-2 pt-4 [@media(hover:hover)_and_(pointer:fine)]:block"
      aria-hidden="true"
    >
      <div className="flex h-10 origin-top-left scale-90 items-center gap-2 whitespace-nowrap rounded-[4px] bg-white px-3 text-black opacity-0 shadow-sm transition-[opacity,transform] duration-300 group-data-[state=active]/cursor:scale-100 group-data-[state=active]/cursor:opacity-100 group-data-[state=edge]/cursor:-translate-x-[calc(100%+1.5rem)] group-data-[state=edge]/cursor:scale-100 group-data-[state=edge]/cursor:opacity-100">
        <span className="size-[11px] rounded-full bg-accent" />
        <span ref={label} />
      </div>
    </div>
  )
}

import TopoCanvas from './TopoCanvas'

export const COLLAPSED_TOP = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
export const COLLAPSED_BOTTOM = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'

// Navy intro screen: the contour map wipes up from the bottom, the lime logo
// wipes in from the top, then the whole screen wipes away upwards to reveal
// the hero. Animated by the Hero timeline.
export default function Preloader() {
  return (
    <div data-preloader className="fixed inset-0 z-[102] bg-[#002743]" aria-hidden="true">
      <div data-preloader-bg className="absolute inset-0 overflow-hidden" style={{ clipPath: COLLAPSED_BOTTOM }}>
        <div data-preloader-bg-image className="absolute inset-0">
          <TopoCanvas className="absolute inset-0 size-full" stroke="rgb(0, 71, 115)" seed={2} />
        </div>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div data-preloader-logo className="flex w-[7.5rem] flex-col items-center gap-3 text-lime lg:w-[11.875rem]" style={{ clipPath: COLLAPSED_TOP }}>
          <span className="aspect-square w-[34%] bg-current" />
          <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em] lg:text-[2.6rem]">ns-trip</span>
        </div>
      </div>
    </div>
  )
}

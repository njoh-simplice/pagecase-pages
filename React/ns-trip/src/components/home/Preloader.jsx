import logo from '../../assets/images/logoipsum.svg'
import TopoCanvas from './TopoCanvas'

export const COLLAPSED_TOP = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
export const COLLAPSED_BOTTOM = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'

// The logo is a mask over a currentColor block, so it takes the lime text colour.
const logoMask = {
  maskImage: `url(${logo})`,
  WebkitMaskImage: `url(${logo})`,
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
}

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
        <div data-preloader-logo className="w-[11rem] text-lime lg:w-[17rem]" style={{ clipPath: COLLAPSED_TOP }}>
          <span className="block aspect-[123/40] w-full bg-current" style={logoMask} />
        </div>
      </div>
    </div>
  )
}

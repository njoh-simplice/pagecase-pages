import { thickPaths, thinPaths, tripPath, VIEWBOX } from '../../utils/trails'
import TopoCanvas from './TopoCanvas'

const viewBox = `0 0 ${VIEWBOX.w} ${VIEWBOX.h}`
const TRIP_DASH = '26 16 4 16'

// Same sizing as the reference: the art layer is widened on narrower screens
// (up to 232% of the viewport) and the artwork is fitted to its width, centred.
const layer = 'absolute inset-y-0 flex items-center justify-center'
const layerInset = { left: 'clamp(-66%, 54.2vw - 1192.37px, 0%)', right: 'clamp(-66%, 54.2vw - 1192.37px, 0%)' }
const art = 'block w-full flex-none'

// Faint map printed on the paper: contour lines plus grey "tracks" of every
// route. The olive and orange lines are drawn over these tracks, so each track
// shows where its line is heading, and reads as a soft shadow once it is drawn.
function BaseMap() {
  return (
    <div className="relative w-full flex-none" style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}>
      <TopoCanvas className="absolute inset-0 size-full" />
      <svg viewBox={viewBox} className="absolute inset-0 size-full" fill="none" aria-hidden="true">
        <g transform="translate(-2.5 -1.3)" stroke="#e8ebea" strokeLinecap="round" strokeLinejoin="round">
          {thickPaths.map((d, i) => (
            <path key={`k${i}`} d={d} strokeWidth="6" />
          ))}
          {thinPaths.map((d, i) => (
            <path key={`t${i}`} d={d} strokeWidth="2" stroke="#eaeaea" />
          ))}
          <path d={tripPath} strokeWidth="5" strokeDasharray={TRIP_DASH} stroke="#eaeaea" />
        </g>
      </svg>
    </div>
  )
}

// Stacked hero artwork. Each layer carries data-mouse="<strength>" for the
// mouse parallax and data-hero-svg so the hero timeline can find it.
export default function HeroArtwork() {
  return (
    <div data-hero-bg data-mouse="0.1" className="absolute inset-0 will-change-transform">
      <div className={layer} style={layerInset}>
        <BaseMap />
      </div>

      <div data-mouse="0.1" className={layer} style={layerInset}>
        <svg data-hero-svg="thick" viewBox={viewBox} className={art} fill="none" aria-hidden="true">
          {thickPaths.map((d, i) => (
            <path key={i} d={d} stroke="#566246" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </svg>
      </div>

      <div data-mouse="0.15" className={layer} style={layerInset}>
        <svg data-hero-svg="thin" viewBox={viewBox} className={art} fill="none" aria-hidden="true">
          {thinPaths.map((d, i) => (
            <path key={i} d={d} stroke="#566246" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </svg>
      </div>

      <div data-mouse="0.3" className={layer} style={layerInset}>
        <svg data-hero-svg="trip" viewBox={viewBox} className={art} fill="none" aria-hidden="true">
          <path d={tripPath} stroke="#ff5c29" strokeWidth="5" strokeLinecap="round" strokeDasharray={TRIP_DASH} />
        </svg>
      </div>
    </div>
  )
}

// Hand-placed trail lines for the hero artwork.
//
// The artwork lives in a 1924 x 1085 viewBox that is fitted to the WIDTH of the
// art layer (see HeroArtwork). Control points below are written in screen pixels
// for a 1920 x 942 viewport; at that size the layer is 2223.5px wide, centred,
// so `toUnits` converts screen pixels into viewBox units.
export const VIEWBOX = { w: 1924, h: 1085 }

const LAYER_AT_1920 = 1920 + 2 * (1192.37 - 54.2 * 19.2) // 2223.5px
const K = LAYER_AT_1920 / VIEWBOX.w // px per unit at 1920
const OFFSET_X = (LAYER_AT_1920 - 1920) / 2
const OFFSET_Y = (VIEWBOX.h * K - 942) / 2

const toUnits = (pts) => pts.map(([x, y]) => [(x + OFFSET_X) / K, (y + OFFSET_Y) / K])

function rng(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// Uniform Catmull-Rom point between p1 and p2.
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  return [0, 1].map(
    (k) =>
      0.5 *
      (2 * p1[k] +
        (-p0[k] + p2[k]) * t +
        (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
        (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3),
  )
}

// Dense polyline along the spline through `pts`, one point every ~`step` units.
function sample(pts, step) {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const n = Math.max(2, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step))
    for (let j = 0; j < n; j++) out.push(cr(p0, p1, p2, p3, j / n))
  }
  out.push(pts[pts.length - 1])
  return out
}

function normals(pts) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [-(b[1] - a[1]) / len, (b[0] - a[0]) / len]
  })
}

// Slightly wander off the ideal line so the result reads as hand-drawn.
function wobble(pts, amount, seed) {
  const rand = rng(seed)
  const nor = normals(pts)
  return pts.map((p, i) => {
    const d = (rand() - 0.5) * 2 * amount
    return [p[0] + nor[i][0] * d, p[1] + nor[i][1] * d]
  })
}

function offset(pts, distance) {
  const nor = normals(pts)
  return pts.map((p, i) => [p[0] + nor[i][0] * distance, p[1] + nor[i][1] * distance])
}

// Open Catmull-Rom spline through pts, as cubic bezier segments.
function toPath(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

// Every route starts off-screen at the left or bottom edge, so it draws in
// from the edge towards the top, as in the reference.
const routes = {
  // Climbs the left edge towards the top.
  west: [[-160, 600], [-40, 520], [30, 470], [85, 385], [135, 305], [200, 235], [275, 195], [345, 120], [410, 45], [445, -40], [470, -160]],
  // Rises from the bottom through the middle and meets the vertical hairline.
  centre: [[330, 1100], [355, 940], [380, 790], [430, 690], [455, 590], [500, 490], [575, 410], [650, 345], [750, 360], [880, 392], [975, 420], [1060, 425], [1140, 385], [1195, 330], [1225, 250], [1250, 180], [1310, 110], [1380, -10], [1420, -160]],
  // Rises from the bottom, loops around the crosshair and leaves at the bottom.
  south: [[1010, 1100], [990, 900], [960, 720], [890, 660], [850, 575], [880, 515], [960, 512], [1060, 525], [1150, 505], [1220, 525], [1244, 590], [1236, 660], [1250, 715], [1310, 752], [1385, 795], [1410, 845], [1350, 885], [1305, 945], [1290, 1020], [1285, 1100]],
  // The dashed trip route, left edge to top.
  trip: [[-160, 720], [-30, 640], [60, 590], [120, 500], [160, 420], [210, 350], [300, 330], [380, 290], [440, 230], [490, 150], [540, 95], [610, 40], [700, 28], [780, 30], [860, 10], [960, -40], [1060, -160]],
}

const px = (n) => n / K // screen pixels at 1920 -> viewBox units

function build(key, seed) {
  return wobble(sample(toUnits(routes[key]), px(46)), px(3.5), seed)
}

const west = build('west', 3)
const centre = build('centre', 7)
const south = build('south', 11)
const trip = build('trip', 19)

export const thickPaths = [west, centre, south].map(toPath)

// Parallel contour lines that draw in on the first scroll step.
export const thinPaths = [
  ...[-15, -27, -39].map((d, i) => toPath(wobble(offset(west, px(d)), px(2), 31 + i))),
  ...[-15, -26, -38, -50].map((d, i) => toPath(wobble(offset(centre, px(d)), px(2), 41 + i))),
  ...[-16, -28, -40].map((d, i) => toPath(wobble(offset(south.slice(17), px(d)), px(2), 51 + i))),
]

export const tripPath = toPath(trip)

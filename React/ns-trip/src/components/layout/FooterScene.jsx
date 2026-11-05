import { useEffect, useRef } from 'react'

// Two-ink "screen print" scene behind the footer: sand-coloured light bursting
// from a sun on the horizon into a blue sky, blue ink sprayed across the sand,
// and three hikers walking out of the sun with long shadows. Drawn once per
// resize with a fixed seed, so it looks the same on every visit.

const SKY_TOP = '#002642' // site navy, so the footer joins the dark section above
const SKY_MID = '#082f86'
const SKY_LOW = '#1745c4'
const LIGHT = '#f1dcb1'
const SAND_TOP = '#f2deb6'
const SAND = '#e6c999'
const SAND_DEEP = '#d8b47f'
const INK = '#1a4bd3'
const FIGURE = '#0b1838'
const FIGURE_PACK = '#22377a'
const DETAIL = '#24387a'

function random(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Distance from (x, y) along (dx, dy) to the edge of the box [0, w] x [top, bottom].
function reach(x, y, dx, dy, w, top, bottom) {
  let t = Infinity
  if (dx > 0) t = Math.min(t, (w - x) / dx)
  if (dx < 0) t = Math.min(t, -x / dx)
  if (dy > 0) t = Math.min(t, (bottom - y) / dy)
  if (dy < 0) t = Math.min(t, (top - y) / dy)
  return t
}

// Collects line segments into a few shared paths (grouped by opacity and
// width) so thousands of streaks cost a handful of stroke calls.
function bucketed() {
  const paths = new Map()
  return {
    add(alpha, width, x1, y1, x2, y2) {
      const key = `${Math.round(alpha * 20)}|${Math.round(width * 2) / 2}`
      let path = paths.get(key)
      if (!path) paths.set(key, (path = new Path2D()))
      path.moveTo(x1, y1)
      path.lineTo(x2, y2)
    },
    stroke(ctx) {
      for (const [key, path] of paths) {
        const [a, wd] = key.split('|')
        ctx.globalAlpha = Number(a) / 20
        ctx.lineWidth = Number(wd)
        ctx.stroke(path)
      }
      ctx.globalAlpha = 1
    },
  }
}

function sky(ctx, rand, { w, vx, hy }) {
  const g = ctx.createLinearGradient(0, 0, 0, hy)
  g.addColorStop(0, SKY_TOP)
  g.addColorStop(0.55, SKY_MID)
  g.addColorStop(1, SKY_LOW)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, hy + 1)

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, w, hy)
  ctx.clip()

  const glow = ctx.createRadialGradient(vx, hy, 0, vx, hy, Math.max(w * 0.45, hy))
  glow.addColorStop(0, 'rgba(241, 220, 177, 0.6)')
  glow.addColorStop(0.12, 'rgba(241, 220, 177, 0.22)')
  glow.addColorStop(1, 'rgba(241, 220, 177, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, hy)

  // Light rays. Many hug the horizon, which builds the bright band there.
  const rays = bucketed()
  const count = Math.round(2600 * Math.min(1.3, Math.max(0.35, w / 1400)))
  for (let i = 0; i < count; i++) {
    let u = rand()
    if (rand() < 0.55) u = rand() < 0.5 ? rand() ** 2.5 * 0.22 : 1 - rand() ** 2.5 * 0.22
    const a = Math.PI + u * Math.PI
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    const len = reach(vx, hy, dx, dy, w, 0, hy) * (0.2 + 0.8 * rand() ** 0.6)
    const width = rand() < 0.8 ? 0.6 : 1.2
    let r = 2 + rand() * 25
    while (r < len) {
      const f = r / len
      const seg = 4 + rand() * 36 * (0.3 + f)
      const alpha = 0.5 * (1 - f) ** 1.4 * (0.35 + 0.65 * rand())
      rays.add(alpha, width, vx + dx * r, hy + dy * r, vx + dx * (r + seg), hy + dy * (r + seg))
      r += seg + rand() * 22 * (0.15 + f)
    }
  }
  ctx.strokeStyle = LIGHT
  ctx.lineCap = 'round'
  rays.stroke(ctx)
  ctx.restore()
}

function ground(ctx, rand, { w, h, vx, hy, G }) {
  const g = ctx.createLinearGradient(0, hy, 0, h)
  g.addColorStop(0, SAND_TOP)
  g.addColorStop(0.25, SAND)
  g.addColorStop(1, SAND_DEEP)
  ctx.fillStyle = g
  ctx.fillRect(0, hy, w, h - hy)

  // Blue spray: streaks along rays from the sun, getting heavier as they come
  // closer to the viewer, with droplets scattered along them.
  const streaks = bucketed()
  const drops = new Path2D()
  const count = Math.round(950 * Math.min(1.3, Math.max(0.3, w / 1400)))
  for (let i = 0; i < count; i++) {
    const a = 0.02 + rand() * (Math.PI - 0.04)
    // Keep a sunlit path of sand open below the sun.
    if (Math.abs(a - Math.PI / 2) < 0.35 && rand() < 0.5) continue
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    const max = reach(vx, hy, dx, dy, w, hy, h)
    let r = max * (0.02 + rand() * 0.3)
    while (r < max) {
      const depth = Math.min(1, (dy * r) / G)
      const s = depth ** 1.2 + 0.05 * (r / max)
      const seg = (3 + rand() * 26) * (0.25 + 2 * depth + 0.4 * (r / max))
      const width = (0.3 + rand() * rand() * 4) * (0.15 + 1.9 * s)
      if (rand() < 0.55) streaks.add(0.92, Math.min(width, 8), vx + dx * r, hy + dy * r, vx + dx * (r + seg), hy + dy * (r + seg))
      if (rand() < 0.18) {
        const rx = width * (1 + rand() * 1.5)
        const px = vx + dx * (r + seg + rx * 2)
        const py = hy + dy * (r + seg + rx * 2)
        drops.moveTo(px + rx, py)
        drops.ellipse(px, py, rx, rx * 0.5, a, 0, Math.PI * 2)
      }
      r += seg + rand() * 55 * (0.3 + depth)
    }
  }
  ctx.strokeStyle = INK
  ctx.fillStyle = INK
  ctx.lineCap = 'round'
  streaks.stroke(ctx)
  ctx.globalAlpha = 0.92
  ctx.fill(drops)
  ctx.globalAlpha = 1

  // Sunlit haze where the ground meets the sun.
  const glow = ctx.createRadialGradient(vx, hy, 0, vx, hy, w * 0.3)
  glow.addColorStop(0, 'rgba(246, 230, 196, 0.85)')
  glow.addColorStop(0.35, 'rgba(246, 230, 196, 0.25)')
  glow.addColorStop(1, 'rgba(246, 230, 196, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, hy, w, h - hy)
}

// Hiker walking toward the viewer, mid-stride, drawn in a 100 x 200 box with
// the feet at the bottom centre: bucket hat, domed pack rising behind the
// shoulders, one pole planted forward and the other swinging back.
const HIKER = {
  back: ['M34 62 V37 Q34 23 50 22 Q66 23 66 37 V62 Z'],
  body: [
    'M42 29 A8 8 0 1 0 58 29 A8 8 0 1 0 42 29 Z',
    'M32 23.5 A18 3.6 0 1 0 68 23.5 A18 3.6 0 1 0 32 23.5 Z',
    'M43.5 23.5 Q44 14 50 14 Q56 14 56.5 23.5 Z',
    'M46.5 35 H53.5 V44 H46.5 Z',
    'M32 46 Q50 39 68 46 Q70.5 60 67.5 74 L64.5 100 Q50 104 35.5 100 L32.5 74 Q29.5 60 32 46 Z',
    // back leg: straight, foot higher because it is further away
    'M37 97 L50 98 L48 140 L46 184 L38.5 184 L38 140 Z',
    // front leg: knee bent outward, foot lower and closer
    'M50 98 L63.5 97 L67 144 L64.5 196 L55 196 L56.5 146 Z',
    'M36 185 A6.5 3.4 0 1 0 49 185 A6.5 3.4 0 1 0 36 185 Z',
    'M51.5 197 A8 4.2 0 1 0 67.5 197 A8 4.2 0 1 0 51.5 197 Z',
    'M22.5 99 A4.5 4.5 0 1 0 31.5 99 A4.5 4.5 0 1 0 22.5 99 Z',
    'M68.5 89 A4.5 4.5 0 1 0 77.5 89 A4.5 4.5 0 1 0 68.5 89 Z',
  ],
  arms: ['M34 49 Q25 65 25 83 L27 97', 'M66 49 Q74 60 74.5 73 L73 87'],
  poles: ['M27 93 L13 199', 'M73 83 L82 181'],
  straps: ['M40 48 Q41 62 41 82', 'M60 48 Q59 62 59 82', 'M41 61 L59 61', 'M36 93 Q50 97 64 93'],
}

let shapes
function hikerShapes() {
  if (!shapes) shapes = Object.fromEntries(Object.entries(HIKER).map(([k, list]) => [k, list.map((d) => new Path2D(d))]))
  return shapes
}

function hikerPass(ctx, color, packColor, extra) {
  const p = hikerShapes()
  ctx.fillStyle = packColor
  ctx.strokeStyle = packColor
  ctx.lineWidth = extra
  for (const s of p.back) {
    ctx.fill(s)
    if (extra) ctx.stroke(s)
  }
  ctx.fillStyle = color
  ctx.strokeStyle = color
  for (const s of p.body) {
    ctx.fill(s)
    if (extra) ctx.stroke(s)
  }
  ctx.lineWidth = 8.5 + extra
  for (const s of p.arms) ctx.stroke(s)
  ctx.lineWidth = 2.4 + extra
  for (const s of p.poles) ctx.stroke(s)
}

function hiker(ctx, { x, y, H, mirror }) {
  const s = H / 200
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(mirror ? -s : s, s)
  ctx.translate(-50, -200)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Rim of sunlight around the silhouette, a touch higher than the body.
  ctx.save()
  ctx.translate(0, -1.2)
  ctx.globalAlpha = 0.75
  hikerPass(ctx, LIGHT, LIGHT, 3)
  ctx.restore()

  hikerPass(ctx, FIGURE, FIGURE_PACK, 0)
  if (H > 60) {
    ctx.strokeStyle = DETAIL
    ctx.lineWidth = 2.2
    for (const st of hikerShapes().straps) ctx.stroke(st)
  }
  ctx.restore()
}

// Long shadow from the feet, pointing away from the sun.
function shadow(ctx, rand, { x, y, H, vx, hy }) {
  let dx = x - vx
  let dy = y - hy
  const len = Math.hypot(dx, dy) || 1
  dx /= len
  dy /= len
  const L = H * 0.95
  const base = H * 0.13
  const tip = H * 0.05
  const nx = -dy
  const ny = dx
  const ex = x + dx * L
  const ey = y + dy * L

  ctx.fillStyle = INK
  ctx.globalAlpha = 0.95
  ctx.beginPath()
  ctx.moveTo(x + nx * base, y + ny * base)
  ctx.quadraticCurveTo(x + dx * L * 0.5 + nx * base * 0.9, y + dy * L * 0.5 + ny * base * 0.9, ex + nx * tip, ey + ny * tip)
  ctx.quadraticCurveTo(ex + dx * tip * 2, ey + dy * tip * 2, ex - nx * tip, ey - ny * tip)
  ctx.quadraticCurveTo(x + dx * L * 0.5 - nx * base * 0.9, y + dy * L * 0.5 - ny * base * 0.9, x - nx * base, y - ny * base)
  ctx.closePath()
  ctx.fill()

  // Ragged spray along the shadow edges so it matches the print texture.
  for (let i = 0; i < 40; i++) {
    const t = rand()
    const side = rand() < 0.5 ? -1 : 1
    const spread = base + (tip - base) * t
    const px = x + dx * L * t + nx * side * spread * (0.8 + rand() * 0.6)
    const py = y + dy * L * t + ny * side * spread * (0.8 + rand() * 0.6)
    const r = H * 0.006 * (1 + rand() * 2)
    ctx.beginPath()
    ctx.ellipse(px, py, r * 2.2, r, Math.atan2(dy, dx), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function draw(canvas, scene) {
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (!w || !h) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const G = Math.round((scene?.offsetHeight || 400) * 0.52) // ground depth
  const hy = h - G // horizon
  const vx = w * 0.62 // sun
  const rand = random(7)
  const geo = { w, h, vx, hy, G }

  sky(ctx, rand, geo)
  ground(ctx, rand, geo)

  ctx.fillStyle = LIGHT
  ctx.globalAlpha = 0.55
  ctx.fillRect(0, hy - 0.75, w, 1.5)
  ctx.globalAlpha = 1

  // Back to front. Height grows with distance below the horizon, as it would
  // with the camera a little below head height.
  const hikers = [0.15, 0.31, 0.62].map((t, i) => ({
    x: vx - t * w * 0.3 + [6, -4, 0][i],
    y: hy + t * G,
    H: t * G * 1.5,
    mirror: i === 1,
  }))
  for (const p of hikers) shadow(ctx, rand, { ...p, vx, hy })
  for (const p of hikers) hiker(ctx, p)
}

export default function FooterScene({ sceneRef, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    let timer
    const run = () => draw(canvas, sceneRef?.current)
    run()
    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(run, 150)
    })
    observer.observe(canvas)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [sceneRef])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

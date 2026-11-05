import { useEffect, useRef } from 'react'

// Faint topographic map: contour lines traced from a domain-warped noise field
// with marching squares, drawn once to a canvas so scaling it stays cheap.

function hash(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

function noise(x, y) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

function height(x, y) {
  x += SEED_X
  y += SEED_Y
  const X = x + (noise(x * 0.8 + 5.2, y * 0.8 + 1.3) - 0.5) * 1.7
  const Y = y + (noise(x * 0.8 + 9.1, y * 0.8 + 7.7) - 0.5) * 1.7
  return noise(X, Y) * 0.62 + noise(X * 2.1, Y * 2.1) * 0.28 + noise(X * 4.3, Y * 4.3) * 0.1
}

let SEED_X = 0
let SEED_Y = 0

const LEVELS = 24
const FROM = 0.22
const TO = 0.78

function draw(canvas, { stroke, seed }) {
  SEED_X = seed * 7.3
  SEED_Y = seed * 3.1
  const dpr = Math.min(window.devicePixelRatio || 1, 2, 3200 / Math.max(1, canvas.clientWidth))
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const cell = 11
  const unit = Math.max(w, 1200) / 3.4
  const nx = Math.ceil(w / cell) + 1
  const ny = Math.ceil(h / cell) + 1
  const grid = new Float32Array((nx + 1) * (ny + 1))
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) grid[j * (nx + 1) + i] = height((i * cell) / unit, (j * cell) / unit)

  for (let l = 0; l < LEVELS; l++) {
    const level = FROM + ((TO - FROM) * l) / (LEVELS - 1)
    const index = l % 4 === 0
    ctx.beginPath()

    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const tl = grid[j * (nx + 1) + i]
        const tr = grid[j * (nx + 1) + i + 1]
        const br = grid[(j + 1) * (nx + 1) + i + 1]
        const bl = grid[(j + 1) * (nx + 1) + i]
        const code = (tl >= level ? 1 : 0) | (tr >= level ? 2 : 0) | (br >= level ? 4 : 0) | (bl >= level ? 8 : 0)
        if (code === 0 || code === 15) continue

        const x = i * cell
        const y = j * cell
        const edge = [
          () => [x + ((level - tl) / (tr - tl)) * cell, y], // top
          () => [x + cell, y + ((level - tr) / (br - tr)) * cell], // right
          () => [x + ((level - bl) / (br - bl)) * cell, y + cell], // bottom
          () => [x, y + ((level - tl) / (bl - tl)) * cell], // left
        ]
        const [T, R, B, L] = [0, 1, 2, 3]
        const segments = {
          1: [[L, T]], 2: [[T, R]], 3: [[L, R]], 4: [[R, B]], 5: [[L, T], [R, B]], 6: [[T, B]], 7: [[L, B]],
          8: [[L, B]], 9: [[T, B]], 10: [[T, R], [L, B]], 11: [[R, B]], 12: [[L, R]], 13: [[T, R]], 14: [[L, T]],
        }[code]

        for (const [a, b] of segments) {
          const p = edge[a]()
          const q = edge[b]()
          ctx.moveTo(p[0], p[1])
          ctx.lineTo(q[0], q[1])
        }
      }
    }

    ctx.strokeStyle = stroke
    ctx.globalAlpha = index ? 0.85 : 1
    ctx.lineWidth = index ? 3.5 : 1.4
    ctx.stroke()
  }
}

export default function TopoCanvas({ className = '', stroke = 'rgba(20, 30, 25, 0.06)', seed = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    let timer
    const run = () => draw(canvas, { stroke, seed })
    run()
    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(run, 200)
    })
    observer.observe(canvas)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [stroke, seed])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}

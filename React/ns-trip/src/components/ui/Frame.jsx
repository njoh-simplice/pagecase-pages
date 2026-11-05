// Small decorative pieces shared by the framed sections.

// 7px squares sitting on the corners of a hairline frame.
export function PixelCorners({ tone = 'navy', className = '' }) {
  const color = tone === 'light' ? 'bg-white' : 'bg-navy'
  const base = `absolute size-[7px] ${color}`
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <span className={`${base} -left-1 -top-1`} />
      <span className={`${base} -right-1 -top-1`} />
      <span className={`${base} -bottom-1 -left-1`} />
      <span className={`${base} -bottom-1 -right-1`} />
    </div>
  )
}

// Thin "+" mark, centred on its position.
export function Cross({ className = '', size = 14, color = 'bg-accent' }) {
  return (
    <span
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 ${color}`} />
      <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 ${color}`} />
    </span>
  )
}

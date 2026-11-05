// Empty block standing in for a photo or video. Swap it for an <img> or
// <video> with the same className when the real media is ready.
export default function MediaPlaceholder({ kind = 'image', label, tone = 'light', className = '', children, ...props }) {
  const dark = tone === 'dark'

  return (
    <div
      role="img"
      aria-label={label ?? `${kind} placeholder`}
      data-media={kind}
      className={`relative overflow-hidden ${dark ? 'bg-white/5' : 'bg-mist'} ${className}`}
      {...props}
    >
      <svg
        className={`absolute inset-0 size-full ${dark ? 'text-white/10' : 'text-ink/10'}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </svg>

      {label && (
        <span
          className={`absolute bottom-3 left-3 rounded-[4px] px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${dark ? 'bg-white/10 text-white/70' : 'bg-paper/80 text-ink/50'}`}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  )
}
